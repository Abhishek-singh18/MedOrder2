// controllers/authController.js

const User = require("/models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user (Customer, Seller, or Rider)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, address, phone } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 2. Create the user
  try {
    const user = await User.create({
      name,
      email,
      password, // Password hashing happens in the User model pre-save hook
      role: role || "customer", // Default role is customer
      address,
      phone,
    });

    // 3. Respond with user data and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user
  const user = await User.findOne({ email });

  // 2. Check password and user existence
  if (user && (await user.matchPassword(password))) {
    // 3. Respond with user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = { registerUser, loginUser };
