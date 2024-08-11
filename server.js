const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
// const redisclient = require('./utils/redis');
const  redis = require('redis');
const multer = require('multer');
const router = require('./routers/index');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const upload = multer({dest: 'uploads/'})
const app = express();

const redisClient = redis.createClient();
(async () => {
  // This is an asynchronous method that explicitly initiates the connection
  // to the Redis server. if any Redis-opeation (get, set, del etc) is called, this
  // is automatically called. since, we aren't, we need to call it ourselves
  await redisClient.connect();
})();

// redisClient.on('connect', () => console.log('Redis Connected to DB'));
redisClient.on('error', () => console.error('Redis Failed to connect to DB'));

app.use(express.json());
app.use(upload.single('file'));
app.use(session({
  store: new RedisStore({ client: redisClient, ttl: 3600 }),
  secret: process.env.SECRET || 'mySecretDoctor"sKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600 * 1000 }
}))


app.use('/', router);

app.listen(PORT, () => {
  console.log(`Starting Server on PORT ${PORT}`);
})
