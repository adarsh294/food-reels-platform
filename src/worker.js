
import "./config/env.js";
import { logger } from "./config/env.js";
import { Worker } from "bullmq";
import { redisClient } from "./redis.js";
import sendEmail from "./services/email.js";
console.log("worker.js",process.env.google_refresh_token);
console.log("worker.js",process.env.client_id);
logger.info(`worker is running in background`);
const worker = new Worker(
  "send-email",
  async (job) => {
    console.log(process.env.google_refresh_token);
console.log(process.env.client_id);
     const { email, otp, html } = job.data;
  
    // yaha email bhejna
    await sendEmail(email,"OTP Verification",`Your OTP is ${otp}`,html);
  },
  {
    connection: redisClient,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(err);
});