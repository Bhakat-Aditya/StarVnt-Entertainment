// config/db.js
// Handles the MongoDB connection using Mongoose.
// We export a single async function so server.js can await it before starting.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise — we await it so the server
    // only starts AFTER the database is ready.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the process.
    // Exiting with code 1 signals an abnormal termination to the OS.
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
