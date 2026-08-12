import dotenv from "dotenv";
import pino from "pino";
export const logger=pino();
dotenv.config();
logger.info(`✅ environment varaible loaded`);
