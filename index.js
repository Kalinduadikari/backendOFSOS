
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import ChatMessage from "./Models/chat";
require('dotenv').config();


import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import paymentRoutes from "./routes/payment";
import orderRoutes from "./routes/order";
import fishmongersRoutes from "./routes/fishmongers";
import mlModelRoutes from './routes/mlmodel';
import chatRoutes from "./routes/chat";
import CustomError from "./errors/CustomError";


const morgan = require("morgan");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://webofsos.onrender.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });


  
    socket.on("send_message", async (data) => {
    const newMessage = new ChatMessage({
        user: data.author,
        username: data.author,
        message: data.message,
        timestamp: Date.now(),
    });

    try {
      await newMessage.save();

      // Send the message to all OTHER clients
      socket.broadcast.emit("receive_message", {
        _id: newMessage._id,
        text: newMessage.message,
        createdAt: newMessage.timestamp,
        user: {
            _id: newMessage.user,
            name: newMessage.username,
        },
      },data);

      console.log(data);
    } catch (err) {
        console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

});




// db connection
mongoose.set("strictQuery", false); // required for version 6
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

// middlewares
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["https://webofsos.onrender.com"], credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// route middlewares
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/fishmongers", fishmongersRoutes);
app.use("/api/mlmodel", mlModelRoutes);
app.use("/api/chat", chatRoutes);


// custom error handler
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    // Log error details
    console.error("CustomError Details:");
    console.error(`  - StatusCode: ${err.statusCode}`);
    console.error(`  - Message: ${err.message}`);
    console.error(`  - ErrorCode: ${err.errorCode}`);
    console.error(`  - Details: ${err.details}`);
    console.error(`  - Stack Trace: ${err.stack}`);

    // Send response with error details
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        errorCode: err.errorCode,
        details: err.details,
      },
    });
  } else {
    // Log unknown error details
    console.error("Unknown Error:", err);

    // Send response with generic error message
    res.status(500).json({ error: "An unknown error occurred" });
  }
});

const PORT = process.env.PORT

server.listen(PORT, () => console.log("Server running on port " + PORT));
