const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "No user found." });
  }
  res.json(users);
});

// @desc Create New User
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !roles.length) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check for duplicate users
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username detected." });
  }

  // Hash the password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPassword, roles };

  // Create and store the new user
  const user = await User.create(userObject);

  if (user) {
    res
      .status(201)
      .json({ message: `New user, ${username}, has been created!` });
  } else {
    res
      .status(400)
      .json({
        message: "Invalid user data received. No new user was created.",
      });
  }
});

// @desc Update A User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {});

// @desc Delete A User
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
