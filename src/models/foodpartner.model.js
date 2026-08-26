import mongoose from "mongoose";

const foodpartner =mongoose.Schema({
     name:{
       type:String,
       require:true,
       unique:true     
    },
    email:{
        type:String,
        require:true,
        unique:true 
    },
    address:{
         type:String,
         required:true
    },
    password:{
        type:String
    },
    followers:{
        type:Number,
        default:0,    
    },
    profile:{
          type:String
    },
    following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "foodPartner"
        }
      ]
},{
    timesamps:true
})
const foodpartnermodel =mongoose.model("foodPartner",foodpartner);
export default foodpartnermodel;