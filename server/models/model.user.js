// models/model.user.js
// Defines the User schema for MongoDB.
// Users can be either a 'vendor' (managing their profile) or 'admin'.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// --- Schema Definition ---
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes leading/trailing whitespace
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Enforces uniqueness at the DB level
      lowercase: true, // Normalizes email for consistent lookup
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // 'select: false' means this field is NOT returned in queries by default.
      // You have to explicitly request it with .select('+password')
      select: false,
    },
    role: {
      type: String,
      enum: ["vendor", "admin"], // Only these two values are allowed
      default: "vendor",
    },
  },
  {
    // Mongoose automatically adds 'createdAt' and 'updatedAt' timestamps
    timestamps: true,
  }
);

// --- Pre-Save Middleware (Password Hashing) ---
// This hook runs automatically BEFORE a User document is saved to the DB.
// It only hashes if the password field has been modified (avoids re-hashing on updates).
// NOTE: In Mongoose 8+, async pre-hooks work without calling next() — just return.
userSchema.pre("save", async function () {
  // 'this' refers to the current user document being saved
  if (!this.isModified("password")) return; // Skip if password hasn't changed

  // bcrypt.hash(plaintext, saltRounds) — the number 12 is the "cost factor".
  // Higher = more secure but slower to compute. 12 is a good production default.
  this.password = await bcrypt.hash(this.password, 12);
});


// --- Instance Method (Password Comparison) ---
// We add a custom method to every User document.
// This lets us call: user.comparePassword(enteredPassword)
userSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare hashes the entered password with the same salt
  // and compares it to the stored hash. Returns true/false.
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Model Export ---
// mongoose.model('User', userSchema) creates a collection named 'users' in MongoDB
const User = mongoose.model("User", userSchema);

export default User;
