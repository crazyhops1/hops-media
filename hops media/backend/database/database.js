import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', false); // Optional but useful
    const db = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // 20 seconds
    });

    console.log(`✅ MongoDB connected to: ${db.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // important: let the caller handle the failure
  }
};

export default dbConnection;

