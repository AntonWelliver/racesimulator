const mongoose = require('mongoose');

const RaceEntrySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Add a name'],
	},
	startNumber: {
		type: Number,
		required: [true, 'Add a start number'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	race: {
		type: mongoose.Schema.ObjectId,
		//FIX-races
		//ref: 'races',
		ref: 'Race',
		required: true,
	},
	email: {
		type: String,
		required: [true, 'Add an email'],
	},
	totalTime: {
		type: Number,
		default: 0,
	},
	kmTimes: [Number],
	status: {
		type: String,
		enum: ['not-started', 'started', 'completed', 'not-finished'],
		default: 'not-started',
	},
	place: {
		type: Number,
		default: 0,
	},
});
module.exports = mongoose.model('RaceEntry', RaceEntrySchema);
