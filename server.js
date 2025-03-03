//server.js

require("dotenv").config();
var cors = require("cors");

let Telegram = require("node-telegram-bot-api");
let TelegramToken = process.env.TELEGRAM_TOKEN || "1359141283:AAEMQ-iws4XdsG0XiajuaCmBjkNKOTkfV_I";

let TelegramBot = new Telegram(TelegramToken, { polling: true });
let express = require("express");
let app = express();
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);
let port = process.env.PORT || 8080;
let expressWs = require("express-ws")(app);
let bodyParser = require("body-parser");
var morgan = require("morgan");

// ✅ KẾT NỐI MONGODB (SỬA LẠI CHO CHUẨN)
const mongoose = require("mongoose");
require("mongoose-long")(mongoose); // INT 64bit

console.log("MongoDB URI:", process.env.MONGO_URI);
mongoose.set("strictQuery", false); // Hoặc true nếu muốn


// Kết nối MongoDB Atlas thay vì localhost
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Giảm lỗi timeout
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Thoát nếu lỗi
  }
};
connectDB(); // Gọi kết nối MongoDB

// Cấu hình tài khoản admin mặc định và dữ liệu mặc định
require("./config/admin");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.set("view engine", "ejs"); // chỉ định view engine là ejs
app.set("views", "./views"); // chỉ định thư mục view

// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static("public"));

// server socket
let redT = expressWs.getWss();
redT.telegram = TelegramBot;
global["redT"] = redT;
global["userOnline"] = 0;

// ✅ GIỮ NGUYÊN TOÀN BỘ ROUTES VÀ CẤU HÌNH CỦA ANH
require("./app/Helpers/socketUser")(redT);
require("./routerHttp")(app, redT);
require("./routerHTTPV1")(app, redT);
require("./routerSocket")(app, redT);
require("./app/Cron/taixiu")(redT);
require("./app/Cron/baucua")(redT);
require("./config/Cron")();
require("./update")();
require("./app/Telegram/Telegram")(TelegramBot);

// Chạy server
app.listen(port, function () {
  console.log("🚀 Server listen on port", port);
});
