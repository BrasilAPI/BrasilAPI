import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 2,
  duration: 5,
});

async function rateLimit(ip) {
  try {
    await limiter.consume(ip);
  } catch (error) {
    throw new Error('RateLimit', 'API Rate Limit');
  }
}

export default rateLimit;
