import { Router } from "express";
import { validate } from "../middleware/auth.validate.js";
import rateLimiter from "../middleware/ratelimit.js";
import {auth} from "../middleware/auth.middleware.js";
import user from "../controllers/auth.controller.js"
import { bothAuth } from "../middleware/bothauth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";
export const router = Router();
router.post("/register",validate,user.register);
router.post("/sendotp",user.sendotp);
router.post("/login",rateLimiter,user.login);
router.get("/getuser",bothAuth,user.getfollower);
router.get("/logout",auth,user.logout);
router.get("/logoutAll",auth,user.logoutAll);
router.post("/verify_email",user.verify_email);
router.get("/refresh",auth,user.refreshtoken);
router.get("/follow/:find",bothAuth,user.follow);
router.get("/checkauth",bothAuth,checkAuth);