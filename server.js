const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

const {
	notFound,
	errorHandler,
} = require('./backend/middleware/errorMiddleware.js');

const connectDB = require('./backend/config/db.js');

// Routes
const raceRoutes = require('./backend/routes/raceRoutes.js');
const raceEntryRoutes = require('./backend/routes/raceEntryRoutes.js');
const raceResultRoutes = require('./backend/routes/raceResultRoutes.js');


const userRoutes = require('./backend/routes/userRoutes.js');

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/', (req, res) => {
	res.send('API running...');
});

app.use(express.json());

// Should we use /api/v1
app.use('/api/v1/race-list', raceRoutes);
app.use('/api/v1/race-entries', raceEntryRoutes);
app.use('/api/v1/race-result', raceResultRoutes);
app.use('/api/v1/users', userRoutes);

// For deployment
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	);
} else {
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

// Handle errors
// handle 404 errors
// Set not found as default ?
app.use(notFound);

// Get errors from routes
// check actual error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
