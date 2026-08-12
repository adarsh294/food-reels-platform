import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    vedio: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    foodpartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner"
    }
});

const foodmodel = mongoose.model("food", foodSchema);

export default foodmodel;