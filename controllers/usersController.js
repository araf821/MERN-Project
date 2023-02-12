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
    res.status(400).json({
      message: "Invalid user data received. No new user was created.",
    });
  }
});

// @desc Update A User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm Data
  if (!id || !username || !roles.length || typeof active !== "boolean") {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(id).exec();
  // Check if the user exists
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Check for duplicate user if the update leads to duplicating usernames
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the origin, first user of the duplicates
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username." });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash the new password by 10 salt rounds
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.username} updated successfully.` });
});

// @desc Delete A User
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
