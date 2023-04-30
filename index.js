
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import paymentRoutes from "./routes/payment";
import orderRoutes from "./routes/order";


const morgan = require("morgan");

const app = express();

// db connection
mongoose.set("strictQuery", false); // required for version 6
mongoose
  .connect(DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

// middlewares
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// route middlewares
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.listen(8000, () => console.log("Server running on port 8000"));
