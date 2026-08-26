import mongoose from "mongoose";

const likes = new mongoose.Schema({

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
    }

});

export const likemodel = mongoose.model("like", likes);