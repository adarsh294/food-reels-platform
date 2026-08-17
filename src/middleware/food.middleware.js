
import jwt from "jsonwebtoken";
import foodmodel from "../models/foodpartner.model.js";
export const foodpartnermiddleware = async (req,res,next) => {
    try {
        const token = req.cookies.foodpartnerrefreshtoken;
           if (!token) {
            return res.status(401).json({message:"unauthorized User"});
           };
         const data = jwt.verify(token, process.env.JWT_SECRET);
               if (!data) {
                return res.status(401).json({message:"invalid token"});
               };
          const foodPartner = await foodmodel.findById(data.id);
          if (!foodPartner) {
            return  res.status(401).json({message:"unauthorized user"});
          };
          req.foodPartner =data.id;
            next();
    } catch (error) {
        next(error);
    }
};