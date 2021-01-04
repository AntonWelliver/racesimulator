const asyncHandler = require('express-async-handler');

const RaceEntry = require('../models/raceEntryModel');
const Race = require('../models/raceModel');

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
