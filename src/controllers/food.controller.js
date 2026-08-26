import { likemodel } from "../models/like.model.js";
import foodmodel from "../models/food.model.js";
import uploadFile from "../services/storage.service.js";
import { savemodel } from "../models/save.model.js";
import mongoose from "mongoose";
export const createfood = async (req,res,next) => {
    try {
        const {name,description}=req.body;
        const result = await uploadFile(req.file.buffer.toString("base64"),name);
        const data=await foodmodel.create({name,description,vedio:result.url,foodpartner:req.foodPartner});
        res.status(200).json({message:"reel uploaded successfully",data});
    } catch (error) {
        next(error);
    }
};

export const getreels = async (req,res,next) => {
    try {    
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
         const skip = (page - 1) * limit;
        const data=await foodmodel.find().populate("foodpartner","name profile address").skip(skip).limit(limit);
           const totalReels = await foodmodel.countDocuments();
        res.status(200).json({message:"reels got successfully",data, pagination: {
                currentPage: page,
                limit: limit,
                totalReels: totalReels,
                totalPages: Math.ceil(totalReels / limit),
                hasNextPage: page < Math.ceil(totalReels / limit),
                hasPreviousPage: page > 1
            }});
    } catch (error) {
        next(error);
    }
};

export const getfoodpartner = async (req,res,next) =>{
    try{
   const {find}=req.params;

    if (!find) {
        return res.status(400).json({ success: false, message: "Food partner id is required" });
    }

    const data = await foodmodel.find({ foodpartner: find }).populate("foodpartner", "name email address followers profile");

    res.status(200).json({ message: "foodpartner found", data });
    }
    catch(err){
        next(err);
    }
};


export const toggleLike = async (req, res, next) => {
    try {

        const { reelId } = req.params;
        const reel = await foodmodel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found"
            });
        }
        let userId;
        let userModel;
        if (req.user) {
            userId = req.user.id;
            userModel = "user";
        } 
        else if (req.foodPartner) {
            userId = req.foodPartner;
            userModel = "foodPartner";
        } 
        else {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // 3. Check already liked
        const existingLike = await likemodel.findOne({
            user: userId,
            userModel: userModel,
            reel: reelId
        });

        // 4. Already liked -> unlike
        if (existingLike) {

            await likemodel.findByIdAndDelete(existingLike._id);

            const totalLikes = await likemodel.countDocuments({
                reel: reelId
            });

            return res.status(200).json({
                message: "Reel unliked",
                liked: false,
                totalLikes
            });
        }

        // 5. Not liked -> create like
        await likemodel.create({
            user: userId,
            userModel: userModel,
            reel: reelId
        });

        const totalLikes = await likemodel.countDocuments({
            reel: reelId
        });

        return res.status(201).json({
            message: "Reel liked",
            liked: true,
            totalLikes
        });

    } catch (error) {
        next(error);
    }
};

export const Like = async (req, res, next) => {
  try {
    let userId;

    if (req.user) {
      userId = req.user.id;
    } else if (req.foodPartner) {
      userId = req.foodPartner;
    } else {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    userId = new mongoose.Types.ObjectId(userId);

    const data = await likemodel.aggregate([
      {
        $group: {
          _id: "$reel",

          users: {
            $push: "$user"
          },

          count: {
            $sum: 1
          }
        }
      },

      {
        $project: {
          _id: 1,
          count: 1,

          liked: {
            $in: [userId, "$users"]
          }
        }
      }
    ]);

    res.status(200).json({
      message: "likes found",
      data
    });

  } catch (error) {
    next(error);
  }
};

export const save = async (req, res, next) => {
    try {
        const { reel, food } = req.query;

        let userId;
        let userModel;

        if (req.user) {
            userId = req.user.id;
            userModel = "user";
        } 
        else if (req.foodPartner) {
            userId = req.foodPartner;
            userModel = "foodPartner";
        } 
        else {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const find = await savemodel.findOne({
            user: userId,
            userModel,
            reel
        });

        if (find) {
            await savemodel.deleteOne({
                user: userId,
                userModel,
                reel
            });

            return res.status(200).json({
                message: "reel unsaved successfully"
            });
        }

        const data = await savemodel.create({
            user: userId,
            userModel,
            reel,
            foodpartner: food
        });

        return res.status(200).json({
            message: "reel saved successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};

export const getsaved = async (req, res, next) => {
    try {
        let userId;
        let userModel;
        if (req.user) {
            userId = req.user.id;
            userModel = "user";
        } 
        else if (req.foodPartner) {
            userId = req.foodPartner;
            userModel = "foodPartner";
        } 
        else {
            return res.status(401).json({
                message: "Unauthorized"
            });
        };
        const find = await savemodel.find({user:userId}).populate("foodpartner","name profile").populate("reel","vedio description");
       if (!find) {
         return  res.status(200).json({message:"reel saved not found"})
       }
        res.status(200).json({message:"reel saved successfully",find})

    } catch (error) {
        next(error);
    }
};