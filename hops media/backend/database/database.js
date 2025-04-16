import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', false); // Optional: Prevent warnings about strictQuery mode
    const db = await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 20000, // 20 seconds timeout
    });

    console.log(`✅ MongoDB connected to: ${db.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // Let the caller handle the failure
  }
};

export default dbConnection;

