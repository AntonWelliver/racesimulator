const express = require('express');
const { createResultList } = require('../controllers/raceResultController');

// Protected routes
const { protect, admin } = require('../middleware/authMiddleware.js');

// Obs merge params
//const router = express.Router({ mergeParams: true });
const router = express.Router();

//const Race = require('../models/Race');
router.route('/').post(protect, admin, createResultList);

module.exports = router;
