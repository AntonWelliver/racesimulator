const express = require('express');
const { getRaceEntries } = require('../controllers/raceEntryController');

// Obs merge params
const router = express.Router({ mergeParams: true });

//const Race = require('../models/Race');
router.route('/').get(getRaceEntries);

module.exports = router;
