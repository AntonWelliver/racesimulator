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
});
module.exports = mongoose.model('RaceEntry', RaceEntrySchema);
