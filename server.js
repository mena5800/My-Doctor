const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session); // Correct way to use RedisStore with connect-redis@5.2.0
const redis = require('redis');
const multer = require('multer');
const cors = require('cors');  // Import the cors middleware
const router = require('./routers/index');

const PORT = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });
const app = express();

// Create a Redis client
const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Redis Connected to DB');
});

redisClient.on('error', (err) => {
  console.error('Redis Connection Error:', err);
});

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(upload.single('file'));

app.use(session({
  store: new RedisStore({ client: redisClient, ttl: 3600 }),
  secret: process.env.SECRET || 'mySecretDoctor"sKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600 * 1000 }
}));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Starting Server on PORT ${PORT}`);
});
