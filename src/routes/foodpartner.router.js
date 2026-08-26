import foodpartner from "../controllers/foodpartner.controller.js";
import { Router } from "express";
import { validate } from "../middleware/auth.validate.js";
import { foodpartnermiddleware } from "../middleware/food.middleware.js";
import rateLimiter from "../middleware/ratelimit.js";
import { bothAuth } from "../middleware/bothauth.middleware.js";
import upload from "../middleware/upload.js";
import { createfood,getreels,getfoodpartner,toggleLike,Like,save,getsaved} from "../controllers/food.controller.js";

export const foodrouter = Router();
foodrouter.post("/register",validate,upload.single("profile"),foodpartner.register);
foodrouter.post("/login",rateLimiter,foodpartner.login);
foodrouter.get("/getuser",foodpartnermiddleware,foodpartner.getuser);
foodrouter.get("/logout",bothAuth,foodpartner.logout);
foodrouter.get("/logoutAll",foodpartnermiddleware,foodpartner.logoutAll);
foodrouter.post("/verify-email",foodpartner.verify_email);
foodrouter.get("/refresh",foodpartnermiddleware,foodpartner.refreshtoken);
foodrouter.get("/follower/:find",foodpartner.follow)

export const food=Router();
food.post("/upload",bothAuth,upload.single("vedio"),createfood);
food.get("/reels",bothAuth,getreels);
food.get("/account/:find",bothAuth,getfoodpartner);
food.post("/like/:reelId",bothAuth,toggleLike);
food.get("/like",bothAuth,Like);
food.get("/save",bothAuth,save);
food.get("/getsave",bothAuth,getsaved);