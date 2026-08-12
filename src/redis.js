import IORedis from "ioredis";
import pino from "pino";

const logger = pino();

const redisUrl = process.env.NODE_ENV === "production"? "redis://redis:6379": "redis://127.0.0.1:6379";

console.log("REDIS_URL =", redisUrl);

export const redisClient = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
  logger.info(`✅ Redis Connected to ${redisUrl}`);
});

redisClient.on("ready", () => {
  logger.info("✅ Redis Ready");
});

redisClient.on("error", (err) => {
  logger.error(err, "❌ Redis Error");
});