const redis = require("redis");

const redisClient = redis.createClient();
redisClient.on("connect", () => console.log("Redis Connected to DB"));
redisClient.on("error", () => console.error("Redis Failed to connect to DB"));
(async () => {
  // wait for redis to connect
  await redisClient.connect();
})();

module.exports = redisClient;