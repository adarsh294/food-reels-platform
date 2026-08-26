import mongoose from "mongoose";

const userschema =mongoose.Schema({
    name:{
       type:String,
       require:true      
    },
    email:{
        type:String,
        require:true,
        unique:true 
    },
    password:{
        type:String
    },
      verified:{
        type:Boolean,
        default:false
    },
    following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodPartner"
    }
  ]
},{
    timestamps:true
});

const usermodel=mongoose.model('user',userschema)
export default usermodel;