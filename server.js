const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const  redis = require('redis');
const router = require('./routers/index');

const PORT = parseInt(process.env.PORT, 10) || 5000;

const app = express();

const redisClient = redis.createClient();
(async () => {
  // wait for redis to connect
  await redisClient.connect();
})();

redisClient.on('connect', () => console.log('Redis Connected to DB'));
redisClient.on('error', () => console.error('Redis Failed to connect to DB'));

app.use(express.json());
app.use(session({
  store: new RedisStore({ client: redisClient, ttl: 3600 }),
  secret: process.env.SECRET || 'myVerySecretDoctor"sKey',
  resave: false,  // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: { secure: false, maxAge: 3600 * 1000 } // allows http. browser's cookie ttl is 1hr
}));
app.use('/', router);


app.listen(PORT, () => {
  console.log(`Starting Server on PORT ${PORT}`);
})
