import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [ true, "Email is required" ]
    },
    verified: {
        type: Boolean,
        default:false
    },
    otphash: {
        type: String,
        required: [ true, "OTP hash is required" ]
    }
}, {
    timestamps: true
})

const otpModel = mongoose.model("otps", otpSchema)

export default otpModel;