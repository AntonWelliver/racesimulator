const asyncHandler = require('express-async-handler');

const RaceEntry = require('../models/raceEntryModel');
const Race = require('../models/raceModel');

const kmTimes = (allTimes) => {
	const listOfTimes = allTimes.map((lap) => (lap.totalTime * 100).toFixed());
	return listOfTimes;
};

// @desc Create Result List
// @route POST /api/result-list
// @access Private
//const addOrderItems = asyncHandler(async (req,res) => {

exports.createResultList = asyncHandler(async (req, res) => {
	const { raceId, resultListInfo } = req.body;

	// Get Race
	// Check that the race exists
	const race = await Race.findById(raceId);

	if (!race) {
		res.status(404);
		throw new Error('Race not found');
	}

	// Update Race till todays date - do this last
	const raceDate = new Date(race.date).toISOString();
	const today = new Date();
	const todayUtc = today.toISOString();
	const newRaceDate = todayUtc.substring(0, 10) + raceDate.substring(10);

	// Update Race
	// Update #entries in actual Race
	const newInfo = 'Tack för ett bra race, lycka till nästa gång!';

	const updatedRace = await Race.findByIdAndUpdate(
		raceId,
		{ date: newRaceDate, info3: newInfo, raceStatus: 'completed' },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!updatedRace) {
		res.status(400);
		throw new Error('Update Race failed');
	}

	// Update runners

	// Sort by totalTime
	const sortedResultList = resultListInfo.resultList.sort((a, b) => {
		return a.totalTime - b.totalTime;
	});

	// Prepare results for update
	// All times as integer in seconds * 100
	let currentPlace = 1;
	let place = 0;
	let currentTime = 0;
	const raceResults = sortedResultList.map((runner, index) => {
		if (index === 0) {
			// First runner
			currentPlace = 1;
			place = 1;
			currentTime = runner.totalTime;
		} else {
			// Check if next runner has the same time as prev
			if (runner.totalTime === currentTime) {
				// same place as prev
				place = currentPlace;
			} else {
				place = index + 1;
				currentPlace = place;
				currentTime = runner.totalTime;
			}
		}

		return {
			_id: runner._id,
			totalTime: (runner.totalTime * 100).toFixed(),
			kmTimes: kmTimes(runner.allTimes),
			place: place,
		};
	});

	raceResults.forEach(async (runner) => {
		// Check that race entry exists
		//const entry = await RaceEntry.findById(runner._id);

		let totalTime = runner.totalTime;
		let kmTimes = runner.kmTimes;
		let place = runner.place;

		// Update race entry

		try {
			const updatedEntry = await RaceEntry.findByIdAndUpdate(
				runner._id,
				{ totalTime, status: 'completed', kmTimes, place },
				{
					new: true,
					runValidators: true,
				}
			);
		} catch (err) {
			console.log(`Update raceEntry ${runner._id} failed`);
			console.log(err.message);
		}
	});

	// Update place

	// Update result in db

	res.status(200).json({ message: 'Result List is updated' });
});

/*

// Get info on specific race
// -------------------------
// @desc Get all race entries
// @route GET /api/v1/race-entries
// @route GET /api/v1/race-list/:raceId/race-entries
// @route GET /api/v1/user/:userId/race-entries
// @access Public

// Get info per User
// -----------------
exports.getRaceEntries = asyncHandler(async (req, res, next) => {
	let query = null;
	let fields = null;
	let sortBy = null;
	let populateFields = null;

	// select: ?select=name,startNumber
	// sort: ?select=name,startNumber&sort=name (ascending)
	// sort, descending: ?select=name,startNumber&sort=-name (descending)
	// populate: ?select=name,startNumber&sort=-name (descending)& populate=name

	// make a copy of req.query
	const reqQuery = { ...req.query };

	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit', 'populate'];

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// Add raceId as a query parameter
	// Needed if you want to list all entries of a specific race
	if (req.params.raceId) {
		reqQuery.race = req.params.raceId;
	}

	// Get string version of query object
	let queryStr = JSON.stringify(reqQuery);

	// Here we get the basic query for find - I think
	query = RaceEntry.find(JSON.parse(queryStr));

	// If select is present - add to query
	if (req.query.select) {
		fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	//Sort
	if (req.query.sort) {
		sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('name');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	let total = 0;
	if (req.params.raceId) {
		// If race-entries per race
		total = await RaceEntry.countDocuments({ race: req.params.raceId });
	} else {
		// If total race-entries
		total = await RaceEntry.countDocuments();
	}

	// Populate
	if (req.query.populate) {
		populateFields = req.query.populate.split(',').join(' ');
		query = query.populate({
			path: 'race',
			select: populateFields,
		});
	}

	query = query.skip(startIndex).limit(limit);

	// Execute call to Mongo
	const raceEntries = await query;

	// Pagination result
	const pagination = {};

	const pages = Math.ceil(total / limit);

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	// Add number of pages
	pagination.pages = pages;

	res.status(200).json({
		count: raceEntries.length,
		pagination,
		raceEntries,
	});
});

/*
// Get info on specific race
// -------------------------
// @desc Get all race entries
// @route GET /api/v1/race-entries/:email
// @access Public

// Get race antries per User
// -----------------
exports.getRaceEntriesByUser = asyncHandler(async (req, res, next) => {
	// Check that user has race-entries
	const raceEntriesByUser = await RaceEntry.find({ email: req.params.email });
	if (!raceEntriesByUser) {
		return next(
			new ErrorResponse(
				`Resource not found for user with email ${req.params.email}`,
				404
			)
		);
	}

	let query = null;
	let fields = null;
	let sortBy = null;
	let populateFields = null;

	// select: ?select=name,startNumber
	// sort: ?select=name,startNumber&sort=name (ascending)
	// sort, descending: ?select=name,startNumber&sort=-name (descending)
	// populate: ?select=name,startNumber&sort=-name (descending)& populate=name

	// make a copy of req.query
	const reqQuery = { ...req.query };

	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit', 'populate'];

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// Get string version of query object
	let queryStr = JSON.stringify(reqQuery);

	// Here we get the basic query for find - I think
	query = RaceEntry.find({ email: req.params.email });

	// add select fields to query
	if (req.query.select) {
		fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	//add sort to query
	if (req.query.sort) {
		sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('name');
	}

	// Add pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await RaceEntry.countDocuments();

	// add populate
	if (req.query.populate) {
		populateFields = req.query.populate.split(',').join(' ');
		query = query.populate({
			path: 'race',
			select: populateFields,
		});
	}

	query = query.skip(startIndex).limit(limit);

	// Do the call to Mongo
	const raceEntries = await query;

	// Pagination result
	const pagination = {};

	const pages = Math.ceil(total / limit);

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	// Add number of pages
	pagination.pages = pages;

	res.status(200).json({
		success: true,
		count: raceEntries.length,
		pagination,
		raceEntries,
	});
});
*/
