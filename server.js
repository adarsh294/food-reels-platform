import app from "./src/app.js";
import { logger } from "./src/config/env.js";

app.listen(process.env.PORT,()=>{
 logger.info(`Server started on port ${process.env.PORT}`);
});
