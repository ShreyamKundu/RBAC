import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Password required only for local authentication
      required: function () {
        return !this.googleId;
      },
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    role: {
      type: String,
      enum: ["Admin", "User"], 
      default: "User", 
    },
    googleId: {
      type: String, 
      unique: true,
      sparse: true, 
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
