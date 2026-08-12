import "./env.js";
import { logger } from "./env.js";
if (!process.env.MONGO_URI) {
   logger.error(`mongo url is not Defined in environment Variable`);
}

if (!process.env.PORT) {
    logger.error(`port is not Defined in environment Variable`);
}

export const config={
    MONGO_URI : process.env.MONGO_URI,
    PORT : process.env.PORT
};