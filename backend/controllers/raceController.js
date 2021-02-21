const asyncHandler = require('express-async-handler');
const Race = require('../models/raceModel');
// For adding runner to race
//const RaceEntry = require('../models/RaceEntry');

// @desc Get All Races
// @route GET /api/v1/race-list
// @access Public
exports.getAllRaces = asyncHandler(async (req, res, next) => {
	const raceList = await Race.find({ simulated: true });
	res.status(200).json({ success: true, count: raceList.length, raceList });
});

// @desc Get Race By Id
// @route GET /api/v1/race-list/:id
// @access Public
exports.getRaceById = asyncHandler(async (req, res, next) => {
	const race = await Race.findById(req.params.id);

	if (!race) {
		res.status(404);
		throw new Error('Race not found');
		// old way:: res.status(404).json({ message: 'Product not found' });
	}
	res.status(200).json({ race });
});
