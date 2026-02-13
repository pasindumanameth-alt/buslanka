const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env");
  
  // Validate URI format
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error("Invalid MONGODB_URI format. Must start with 'mongodb://' or 'mongodb+srv://'");
  }
  
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // Retry connection on failure
      retryWrites: true,
      retryReads: true,
    });
    console.log("✅ MongoDB connected (BusLanka)");
  } catch (error) {
    // Provide more helpful error messages
    if (error.name === 'MongoServerSelectionError' || error.message.includes('ENOTFOUND')) {
      console.error("\n⚠️  MongoDB Connection Troubleshooting:");
      console.error("1. Verify your MONGODB_URI in .env file is correct");
      console.error("2. Check if your MongoDB Atlas cluster is running (not paused)");
      console.error("3. Verify your IP is whitelisted in MongoDB Atlas Network Access");
      console.error("4. Check your internet connection and DNS resolution");
      console.error("5. For mongodb+srv:// URIs, ensure the cluster hostname is correct\n");
      throw new Error(`MongoDB connection failed: ${error.message}`);
    }
    throw error;
  }
}

module.exports = connectDB;