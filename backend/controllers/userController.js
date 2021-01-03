const asyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/generateToken.js');
const User = require('../models/userModel.js');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

// password validator
const passwordValidated = (password) => {
	const schema = new passwordValidator();

	const validation = schema
		.is()
		.min(6)
		.is()
		.max(12)
		.has()
		.uppercase()
		.has()
		.lowercase()
		.digits(1)
		.not()
		.spaces()
		.validate(password);
	return validation;
};

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public

//const authUser = asyncHandler(async (req,res) => {

exports.authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @desc Register a new user
// @route POST /api/users
// @access Public

//const registerUser = asyncHandler(async (req,res) => {

exports.registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	// Check that email format is OK
	if (!email || emailValidator.validate(email) === false) {
		res.status(400);
		throw new Error('Invalid email format');
	}
	// Check that password format is OK
	if (!password || !passwordValidated(password)) {
		res.status(400);
		throw new Error('Invalid password format');
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private

//const getUserProfile = asyncHandler(async (req,res) => {

exports.getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private

//const updateUserProfile = asyncHandler(async (req,res) => {

exports.updateUserProfile = asyncHandler(async (req, res) => {
	// Validate email
	// Check that email format is OK
	if (req.body.email && emailValidator.validate(req.body.email) === false) {
		res.status(400);
		throw new Error('Invalid email');
	}

	// Check that password format is OK
	if (req.body.password && !passwordValidated(req.body.password)) {
		res.status(400);
		throw new Error('Invalid password format');
	}

	const user = await User.findById(req.user._id);

	if (user) {
		// add updated name OR keep old name
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		// check if password is sent
		// We don't want to include password unless it has been modified
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Get all users
// @route GET /api/users
// @access Private/Admin

//const getUser = asyncHandler(async (req,res) => {

exports.getUsers = asyncHandler(async (req, res) => {
	let pageSize = 4;
	if (req.query.pageSize) {
		pageSize = Number(req.query.pageSize);
	}

	let page = 1;
	if (req.query.pageNumber) {
		page = Number(req.query.pageNumber);
	}

	const count = await User.countDocuments({});

	const users = await User.find({})
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ users, page, pages: Math.ceil(count / pageSize) });

	//const users = await User.find({});

	//res.json(users);
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin

//const deleteUser = asyncHandler(async (req,res) => {

exports.deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.remove();
		res.json({ message: 'User removed' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin

//const getUser = asyncHandler(async (req,res) => {

exports.getUserById = asyncHandler(async (req, res) => {
	const user = await await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin

//const updateUserProfile = asyncHandler(async (req,res) => {

exports.updateUser = asyncHandler(async (req, res) => {
	// Validate email
	// Check that email format is OK
	if (req.body.email && emailValidator.validate(req.body.email) === false) {
		res.status(400);
		throw new Error('Invalid email');
	}

	// Check that password format is OK
	if (req.body.password && !passwordValidated(req.body.password)) {
		res.status(400);
		throw new Error('Invalid password format');
	}

	const user = await User.findById(req.params.id);

	if (user) {
		// add updated name OR keep old name
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		user.isAdmin = req.body.isAdmin;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

/*
exports {
  authUser,
  getUserProfile,
  updateUserProfile,
  registerUser
}
*/
