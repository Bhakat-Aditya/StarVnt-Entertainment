
import jwt from "jsonwebtoken";
import User from "../models/model.user.js";
import VendorProfile from "../models/model.vendorProfile.js";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },            // Payload: what we encode inside the token
    process.env.JWT_SECRET,    // Secret key: used to sign and later verify the token
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Token expires after 7 days
  );
};

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

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ name, email, password });

    await VendorProfile.create({
      user: user._id,
      vendorName: name, // Pre-fill with their name as a starting point
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

export const getMe = async (req, res) => {

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
