import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set. Auth and database-backed notices are unavailable.");
    return false;
  }

  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn("Start MongoDB to use registration, login, and protected notice routes.");
    return false;
  }
};
