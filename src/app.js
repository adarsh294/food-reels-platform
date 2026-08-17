import "./config/env.js";
import express, { urlencoded } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { conectDB } from "./config/db.js";
import { errorhandle } from "./middleware/err.middleware.js";
import { router } from "./routes/auth.router.js";
import { foodrouter } from "./routes/foodpartner.router.js";
import { food } from "./routes/foodpartner.router.js";
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));
import "./redis.js";

conectDB();
app.use("/api/user",router);
app.use("/api/foodpartner",foodrouter);
app.use("/api/food",food);
app.use(errorhandle);
export default app;