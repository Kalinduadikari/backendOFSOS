import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
    members: {
        type: Array,
    },
}, 
{
    timestamps: true, 
}
);

const chatModel = mongoose.model("chat", chatModel)
export default chatModel 