import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "./env.js";
export const conectDB =async () => {
    try{
    await mongoose.connect(config.MONGO_URI);
    logger.info(`Database has Connected Successfully`);
    }
    catch(err){
        logger.error(`Database Connection Failed ${err}`);
        process.exit(1);
    }
};