import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "Subscriber",
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    resetCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
