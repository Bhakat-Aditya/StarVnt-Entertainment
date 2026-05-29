// controllers/controller.auth.js
// Handles user registration and login logic.
// Controllers contain the core business logic; routes just wire them up.

import jwt from "jsonwebtoken";
import User from "../models/model.user.js";
import VendorProfile from "../models/model.vendorProfile.js";

// --- Helper: Generate JWT Token ---
// We keep this as a local helper function so both register and login can reuse it.
// The token payload contains the user's ID — this is what we decode in the auth middleware.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },            // Payload: what we encode inside the token
    process.env.JWT_SECRET,    // Secret key: used to sign and later verify the token
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Token expires after 7 days
  );
};

// --- Helper: Send Token Response ---
// A consistent way to send back user data + token.
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ============================================================
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new vendor user and create their profile
// ============================================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // --- Check for Existing User ---
    // We check before trying to create to give a clear error message.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // --- Create the User ---
    // The password is automatically hashed by the pre-save hook in model.user.js
    const user = await User.create({ name, email, password });

    // --- Create an Empty VendorProfile ---
    // Every registered vendor gets an empty profile automatically.
    // They can fill it in later from the Vendor Profile page.
    await VendorProfile.create({
      user: user._id,
      vendorName: name, // Pre-fill with their name as a starting point
    });

    // Send back token + user info
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

// ============================================================
// @route   POST /api/auth/login
// @access  Public
// @desc    Login with email and password, receive a JWT
// ============================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validate Input ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    // --- Find User (include password) ---
    // By default, the password field has 'select: false' in the schema.
    // We use .select('+password') to explicitly include it for this query only.
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // IMPORTANT: Use a vague message to avoid revealing whether the email exists
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // --- Verify Password ---
    // user.comparePassword() is the instance method we defined in model.user.js
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // --- Success: Send Token ---
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// ============================================================
// @route   GET /api/auth/me
// @access  Private (requires token)
// @desc    Get the currently logged-in user's data
// ============================================================
export const getMe = async (req, res) => {
  // req.user is populated by the protect middleware (middleware.auth.js)
  // so we don't need to query the DB again — it's already there.
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
