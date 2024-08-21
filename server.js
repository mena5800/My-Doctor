const express = require('express');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const  redis = require('redis');
const process = require('process');
const userRouter = require('./routers/userRoutes');
const doctorRouter = require('./routers/doctorRoutes');
const fileRouter = require('./routers/fileRoutes');

const PORT = parseInt(process.env.PORT, 10) || 5000;

const app = express();


app.use(express.json()); // Set-up for Json requests
app.use(express.urlencoded({ extended: true })); // Set-up for x-www-form-urlencoded

// Allows CORS from the browser
app.use(cors({
  origin: '*',
  credentials: true // Enable sending cookies across origins
}));

// Create a Redis client
const redisClient = redis.createClient();
redisClient.on('connect', () => console.log('Redis Connected to DB'));
redisClient.on('error', () => console.error('Redis Failed to connect to DB'));

(async () => {
  await redisClient.connect(); // wait for redis to connect
})();

// Set-up Session Handling on Redis
app.use(session({
  store: new RedisStore({ client: redisClient, ttl: 3600 }),
  secret: process.env.SECRET || 'myVerySecretDoctor"sKey',
  resave: false,  // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: { secure: false, maxAge: 3600 * 1000 } // allows http. browser's cookie ttl is 1hr
}));


// routers from user, file and doctor
app.use('/', userRouter);
app.use('/', doctorRouter);
app.use('/', fileRouter);


app.listen(PORT, () => {
  console.log(`Starting Server on PORT ${PORT}`);
});
