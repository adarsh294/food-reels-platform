import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  refreshtoken: {
    type: String,
    required: true,
  },
  ip: String,
  userAgent: String,
  revoke: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const sessionmodel = mongoose.model("session", sessionSchema);

export default sessionmodel;