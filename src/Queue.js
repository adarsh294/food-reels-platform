import { Queue } from "bullmq";
import { redisClient } from "./redis.js";

export const emailQueue = new Queue("send-email", {
  connection: redisClient,
});