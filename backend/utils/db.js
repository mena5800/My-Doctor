const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace with your actual MongoDB connection string
    const conn = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/myDoctor', {
      // Removed deprecated options
      
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;