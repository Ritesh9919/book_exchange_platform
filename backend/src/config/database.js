import mongoose from "mongoose";
import { Book } from "../models/book.model.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected!");
  } catch (error) {
    console.error("MongoDb database connection failed", error);
  }
};

export default connectDB;
