import { json } from "express";
import foodmodel from "../models/food.model.js";
import uploadFile from "../services/storage.service.js";
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
        const data=await foodmodel.find();
        res.status(200).json({message:"reels got successfully",data});
    } catch (error) {
        next(error);
    }
}
