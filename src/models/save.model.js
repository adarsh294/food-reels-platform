import mongoose from "mongoose";

const save = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "userModel"
    },
    userModel: {
        type: String,
        required: true,
        enum: ["user", "foodPartner"]
    },
    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    foodpartner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner",
        required: true}
    
});

export const savemodel = mongoose.model("save", save);