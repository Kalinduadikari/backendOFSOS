import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
