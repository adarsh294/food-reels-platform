import mongoose from "mongoose";

const foodpartner =mongoose.Schema({
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
    }
})
const foodpartnermodel =mongoose.model("foodPartner",foodpartner);
export default foodpartnermodel;