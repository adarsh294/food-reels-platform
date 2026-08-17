import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import cookie from 'cookie-parser'
import foodpartnermodel from '../models/foodpartner.model.js';
import {config} from '../config/config.js';
import sessionmodel from '../models/seccionmodel.js';
import {generateOtp,getOtpHtml} from '../utils/utils.js'
import  otpModel from '../models/otp.model.js'
import { redisClient } from '../redis.js';
import { emailQueue } from "../Queue.js";
import axios from "axios";

// Register API
async function register(req,res,next) {
    
    try {
    const { fullname, email, password ,otp} = req.body;
    const find =await foodpartnermodel.findOne({
       email
    })
    if (find) {
        return res.status(409).json({
            "message":"email already exist"
        })
    }

    //  await sendEmail(email,"otp verification",`your OTP code is ${otp}`,html);
    //         const refreshtoken=await jwt.sign({
    //           id:data._id
    //         },process.env.JWT_SECRET,{expiresIn:"7d"})
    //         res.cookie('refreshtoken',refreshtoken,{
    //             httpOnly:true,
    //             secure:true,
    //             sameSite:"strict",
    //             maxAge:7*24*60*60*1000
    //         });
    
    //        const refreshtokenhash =crypto.createHash("sha256").update(refreshtoken).digest("hex");
    //        console.log(refreshtokenhash)
    //         const session=await sessionmodel.create({
    //             userId:data._id,refreshtoken:refreshtokenhash,ip:req.ip,userAgent:req.headers['user-agent']
    //         })
    //   const accesstoken=await jwt.sign({
    //     id:data._id,
    //     sessionId:session._id
    // },process.env.JWT_SECRET,{expiresIn:"15m"});
    console.log("before")
    const key = `otp:${email}`;


const userotp = await redisClient.get(key);

console.log("REDIS OTP:", userotp);
   const verifyResponse = await axios.post(
            "http://localhost:3000/api/user/verify_email",
            {
                email,
                otp
            }
        );
    const verify=await otpModel.findOne({email});
    if (!verify) {
        return res.status(400).json({message:"verify email first"})
    }
    if(verify.verified !== true){
        return res.status(403).json({message:"email is not verified"})
    }
 
    const hashpass = crypto.createHash("sha256").update(password).digest("hex");
        const data=await foodpartnermodel.create({
            name:fullname,email,password:hashpass,verified:true
        })
        await otpModel.findOneAndDelete({email});
     res.status(200).json({
        "message":"user created  successfully",
        "data":data
    })
  
}
catch (err){
    if (err.response) {
      return res.status(err.response.status).json(
        err.response.data
      );
    }
     return res.status(500).json({
        "message":err.message
       
    })}};

export const sendotp = async (req,res,next)=>{
        const {email}=req.body;
        const findemail=await otpModel.findOne({email});
        let otp=generateOtp();
        if(findemail){
            await otpModel.deleteOne({email});
         await redisClient.set(`otp:${email}`, String(otp), "EX", 300);
         return  res.status(201).json({massage:"otp created successfully",data});
        };
     let html=getOtpHtml(otp);
     const job=  await emailQueue.add("send-otp", {email,otp,html});
   const key = `otp:${email}`;
await redisClient.set(key, String(otp), "EX", 300);
console.log(otp);
console.log("REDIS SET");
console.log("key:", key);
console.log("otp:", String(otp));

const check = await redisClient.get(key);
console.log("redis check:", check);
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
      const data=  await otpModel.create({ email,otphash:otphash })
        res.status(201).json({massage:"otp created successfully",data});
}

// logout
const logout = async (req,res,next) => {
    try{
 const refreshtokenhash = crypto.createHash("sha256").update(req.foodPartner).digest("hex");
    const logout=await sessionmodel.findOne({
        refreshtoken:refreshtokenhash
    })
    if (!logout) {
        return res.status(400).json({
            "message":"refreshtoken not found"
        })
    }
    if (logout.revoke) {
        return res.status(400).json({"message":"user Already logout"});
    }
    logout.revoke = true;
   
   await logout.save();
   res.clearCookie("refreshtoken");
   res.status(200).json({"message":"user logged out successfully"});
}
catch(err){
    next(err);
}
};



// login API
const login = async (req,res,next) => {
    try{
    const {email,fullname,password}=req.body;
     const data = await foodpartnermodel.findOne({
        $or:[{email},{name:fullname}]
     });
     if (!data) {
        return res.status(401).json({"message":"invalid email or fullname"})
     };
      const hashpass = crypto.createHash("sha256").update(password).digest("hex");

    if (data.password != hashpass) {
        return res.status(401).json({message:"invalid password"})
    }
  

    const refreshtoken=await jwt.sign({
      id:data._id
    },process.env.JWT_SECRET,{expiresIn:"7d"})
    res.cookie("foodpartnerrefreshtoken", refreshtoken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});
   const refreshtokenhash = crypto.createHash("sha256").update(refreshtoken).digest("hex");
    
    await sessionmodel.create({
        userId:data._id,refreshtoken:refreshtokenhash,ip:req.ip,userAgent:req.headers['user-agent']
    })
    const accesstoken=await jwt.sign({
      id:data._id
  },process.env.JWT_SECRET,{expiresIn:"15m"});

    res.status(200).json({messagge:"user logged in successfully",
        data:data,
        token:accesstoken
    })
}
catch(err){
    next(err);
}
}



// logout from All Device
const logoutAll = async (req,res,next)=>{ 
    try{

const refreshtokenhash = crypto.createHash("sha256").update(req.foodPartner).digest("hex");



const session = await sessionmodel.findOne({
    refreshtoken: refreshtokenhash,
    revoke: false
});

if (!session) {
    return res.status(404).json({
        message: "Session not found"
    });
}

await sessionmodel.updateMany(
    {
        userId: session.userId,
        revoke: false
    },
    {
        revoke: true
    }
);

res.clearCookie("foodpartnerrefreshtoken");

res.status(200).json({
    message: "Logged out from all devices"
});
    }
    catch(err){
        next(err);
    }
}


// verify-email
const verify_email = async (req,res,next) => {
    console.log(" VERIFY API HIT");
    try{
    const {otp,email} = req.body;
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
    
    const find=await otpModel.findOne({
        otphash,email
    });
 if (!find) {
  return  res.status(400).json({"message":"verify email first"});
 }
const userotp= await redisClient.get(`otp:${email}`);
    if (!userotp) {
        return res.status(400).json({message:"otp expired"});
    }
    else if (userotp !== otp) {
        return res.status(400).json({message:"otp invalid"});
    }
  
 const data = await otpModel.findOneAndUpdate({email:email},{verified:true}, { returnDocument: "after" });

 res.status(200).json({message:"email verified successfully"});
    }
    catch(err){
        next(err);
    }
}
const resetpassword = async() =>{

}
// refresh token
 const refreshtoken = async (req,res,next) => {
    try{
        
        const refresh=req.foodPartner
    const refreshtokenhash = crypto.createHash("sha256").update(req.foodPartner).digest("hex");
     const sessiondata=await sessionmodel.findOne({
        refreshtoken:refreshtokenhash,
        revoke:false
     });
     if (!sessiondata) {
         return res.status(401).json({message:"login First"});
     }

    const data=jwt.verify(refresh,process.env.JWT_SECRET);
    if (!data) {
         return res.status(401).json({message:"unauthorized user"});
    }
    console.log(data);
      const accesstoken=await jwt.sign({
        id:data.id
    },process.env.JWT_SECRET,{expiresIn:"15m"});
    const refreshtokken=await jwt.sign({
        id:data.id
    },process.env.JWT_SECRET,{expiresIn:"7d"});
     res.cookie('foodpartnerrefreshtoken',refreshtokken,{
                httpOnly:true,
                secure:true,
                sameSite:"strict",
                maxAge:7*24*60*60*1000
            });
    res.status(200).json({message:"access token refreshed successfully",token:accesstoken});
        }
       catch(err){
        next(err);
       } 
}




// get user data
const getuser = async (req, res,next) => {
    try {
        const userData = await redisClient.get(`user:${req.foodPartner}`);
        if (userData) {
            return res.status(200).json({
                message: "User found in Redis",
                data:userData
            });
        }
        const finddata=await foodpartnermodel.findById({_id:req.foodPartner});
        if (!finddata) {
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({
            message: "User data retrieved successfully",
            data:finddata
        });

    } catch (err) {
       next(err);
    }
};

export default {register,login,refreshtoken,logoutAll,verify_email,getuser,logout,sendotp};
