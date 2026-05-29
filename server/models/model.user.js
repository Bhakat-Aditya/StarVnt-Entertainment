
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

      select: false,
    },
    role: {
      type: String,
      enum: ["vendor", "admin"], // Only these two values are allowed
      default: "vendor",
    },
  },
  {

    timestamps: true,
  }
);

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return; // Skip if password hasn't changed

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
