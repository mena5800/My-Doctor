const express = require("express");
require("dotenv").config();
const cors = require('cors');

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const userRouter = require("./routers/userRoutes");
const doctorRouter = require("./routers/doctorRoutes");
const fileRouter = require("./routers/fileRoutes");
const chatRouter = require("./routers/chatRoutes");
const messagerRouter = require("./routers/messageRoutes");
const patientRouter = require("./routers/patientRoutes")
const {initializeSocket} = require('./server/socket');
const http = require('http');

const connectDB = require("./utils/db");
const redisClient = require("./utils/redis")
const PORT = parseInt(process.env.PORT, 10) || 5000;

const app = express();
// Set-up for Json requests
app.use(express.json());

// Configure CORS to allow credentials from any origin
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from any origin
    callback(null, origin);
  },
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,

}));

connectDB();

// Set-up Session Handling on Redis
app.use(
  session({
    store: new RedisStore({ client: redisClient, ttl: 3600 }),
    secret: process.env.SECRET || 'myVerySecretDoctor"sKey',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { secure: false, maxAge: 3600 * 1000 }, // allows http. browser's cookie ttl is 1hr
  })
);



// routers from user, file and doctor
app.use("/api/v1/", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messagerRouter);


const server = http.createServer(app);
initializeSocket(server);



// app.listen(PORT, () => {
//   console.log(`Starting Server on PORT ${PORT}`);
// });

server.listen(PORT, () => {
  console.log('Server is running on port 3000');
});