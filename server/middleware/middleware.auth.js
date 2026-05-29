// middleware/middleware.auth.js
// JWT Authentication Middleware.
// This function runs BEFORE any protected route handler.
// It checks that the request has a valid JWT token.

import jwt from "jsonwebtoken";
import User from "../models/model.user.js";

const protect = async (req, res, next) => {
  let token;

  // --- Step 1: Extract the Token ---
  // We expect the token in the Authorization header as: "Bearer <token>"
  // The 'authorization' header is lowercased by Express.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Split "Bearer eyJhbGci..." into ["Bearer", "eyJhbGci..."]
    // and take index 1 (the actual token)
    token = req.headers.authorization.split(" ")[1];
  }

  // --- Step 2: Check if Token Exists ---
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }

  try {
    // --- Step 3: Verify the Token ---
    // jwt.verify() decodes the token and checks the signature using JWT_SECRET.
    // If the token is expired or tampered with, it throws an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- Step 4: Attach User to Request ---
    // The token payload contains { id: user._id } (set during login).
    // We fetch the user from DB (excluding the password) and attach it to req.
    // This makes req.user available in every subsequent route handler.
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }

    // --- Step 5: Pass Control to the Next Middleware/Route ---
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token is invalid or expired.",
    });
  }
};

export default protect;
