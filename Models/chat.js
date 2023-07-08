import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    room: String,
    user: String,
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  });
  

export default mongoose.model("ChatMessage", chatMessageSchema);
