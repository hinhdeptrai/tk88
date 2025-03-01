
const mongoose = require("mongoose");
require("dotenv").config(); // Đọc biến môi trường từ .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME, // Đảm bảo kết nối đúng database
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Giới hạn thời gian chờ MongoDB phản hồi
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Thoát nếu kết nối thất bại
  }
};

module.exports = connectDB;
