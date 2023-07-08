import express from "express";
import ChatMessage from "../Models/chat";

const router = express.Router();

router.get("/history/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
  
    try {
      const messages = await ChatMessage.find({ room: roomId }).sort({ timestamp: -1 });
      const formattedMessages = messages.map(m => ({
        _id: m._id,
        text: m.message,
        createdAt: m.timestamp.toISOString(),
        user: {
          _id: m.user,
          name: m.username,
        },
      }));
      res.status(200).json(formattedMessages);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  
  

export default router;
