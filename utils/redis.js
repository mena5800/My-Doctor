const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient()

    this.client.on('error', () => console.log('Redis Client could NOT Connect'));
    this.client.on('connect', () => console.log('Successfully Conneted to REDIS'))
    // this.getAsync = promisify(this.client.get).bind(this.client);
    // this.setAsync = promisify(this.client.set).bind(this.client);
    // this.getAsync = promisify(this.client.get).bind(this.client);
  }

  isAlive() {
    return this.client.connected();
  }

  // async get(key) {

  //   const redisGet = await promisify(this.client.get).bind(this.client)
  // }
}

const redisClient = new RedisClient();

module.exports = redisClient.client;  // Exports only the Redis client
