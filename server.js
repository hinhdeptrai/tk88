require('dotenv').config();  // Nạp các biến môi trường từ file .env
var cors = require('cors');
let Telegram = require('node-telegram-bot-api');
let TelegramToken = process.env.TELEGRAM_TOKEN;  // Lấy Telegram Token từ biến môi trường

let TelegramBot = new Telegram(TelegramToken, { polling: true });
let express = require('express');
let app = express();
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
let port = process.env.PORT || 80;
let expressWs = require('express-ws')(app);
let bodyParser = require('body-parser');
var morgan = require('morgan');

// Kết nối tới MongoDB Atlas
let mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

let mongoDB = process.env.MONGODB_URI;  // Lấy chuỗi kết nối MongoDB từ biến môi trường
mongoose.connect(mongoDB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.log('MongoDB Atlas connection failed:', error);
    });

// Cấu hình tài khoản admin mặc định và các dữ liệu mặc định
require('./config/admin');
// Đọc dữ liệu từ form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.set('view engine', 'ejs'); // chỉ định view engine là ejs
app.set('views', './views'); // chỉ định thư mục view

// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static('public'));

// server socket
let redT = expressWs.getWss();
redT.telegram = TelegramBot;
global['redT'] = redT;
global['userOnline'] = 0;

require('./app/Helpers/socketUser')(redT); // Add function socket

require('./routerHttp')(app, redT); // load các routes HTTP
require('./routerHTTPV1')(app, redT); // load routes news
require('./routerSocket')(app, redT); // load các routes WebSocket

require('./app/Cron/taixiu')(redT); // Chạy game Tài Xỉu
require('./app/Cron/baucua')(redT); // Chạy game Bầu Cua
require('./config/Cron')();

require('./update')();

require('./app/Telegram/Telegram')(TelegramBot); // Telegram Bot

app.listen(port, function() {
    console.log("Server listening on port", port);
});
