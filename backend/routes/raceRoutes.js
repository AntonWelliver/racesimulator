const express = require('express');

const {
	getAllRaces,
	getRaceById,
} = require('../controllers/raceController.js');

// Include other resource routers
const raceEntryRouter = require('./raceEntryRoutes');
const router = express.Router();

// Re-route into other resource routers
router.use('/:raceId/race-entries', raceEntryRouter);

//router.route('/').post(registerUser).get(protect, admin, getUsers);
router.route('/').get(getAllRaces);
router.route('/:id').get(getRaceById);

module.exports = router;
