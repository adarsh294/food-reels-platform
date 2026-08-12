import jwt from "jsonwebtoken";

export const auth = async (req,res,next) =>{
   try{
   const token = req.cookies.refreshtoken;
   if (!token) {
    return res.status(401).json({message:"unauthorized User"});
   };
 const data = jwt.verify(token, process.env.JWT_SECRET);
       if (!data) {
        return res.status(401).json({message:"invalid token"});
       };
       req.user={id:data.id,token};
       next();
      }
   catch(err){
    next(err);
   }
};