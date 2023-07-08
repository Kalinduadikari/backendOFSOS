import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const fishmongerSchema = new Schema(
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
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Generate a random password reset token and set the expiration time
fishmongerSchema.methods.generatePasswordResetToken = function () {
  this.passwordResetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour from now

  return this.passwordResetToken; // Add this line to return the generated token
};


export default mongoose.model("Fishmonger", fishmongerSchema);
