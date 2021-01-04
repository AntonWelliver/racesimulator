const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const RaceSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Enter a race name'],
	},
	distance: {
		type: Number,
		required: [true, 'Enter a distance'],
	},
	date: {
		type: Date,
		required: [true, 'Enter date and time'],
	},
	capacity: {
		type: Number,
		required: [true, 'Enter a capacity'],
	},
	entries: {
		type: Number,
		default: 0,
	},
	location: {
		type: String,
		required: [true, 'Enter a location'],
	},
	info1: {
		type: String,
	},
	info2: {
		type: String,
	},
	info3: {
		type: String,
	},
	price: {
		type: String,
		required: [true, 'Enter a price'],
	},
	show: {
		type: String,
		enum: ['no', 'yes'],
		default: 'no',
	},
});

// Cascade delete raceEntries when a race is deleted
RaceSchema.pre('remove', async function (next) {
	await this.model('RaceEntry').deleteMany({ race: this._id });
	next();
});

// FIX-races
//module.exports = mongoose.model('races', RaceSchema);
module.exports = mongoose.model('Race', RaceSchema);
