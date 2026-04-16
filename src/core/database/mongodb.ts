import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

export const connectDatabase = async () => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set!");
  }

  try {
    await mongoose.connect(DATABASE_URL as string);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw so the caller can handle it
  }
};
