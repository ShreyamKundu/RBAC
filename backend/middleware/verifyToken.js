import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    let user = null;

    if (token) {
      // Verify the backend's JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized - invalid token" });
      }

      // Attach user details from JWT
      req.userId = decoded.userId;
      req.role = decoded.role;
    } else {
      // No token, check for Google sign-in using userId
      const userId = req.body.userId || req.params.userId;
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated - invalid or missing token or userId",
        });
      }
      // Find user by userId with a valid googleId
      user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Google sign-in not found",
        });
      }

      // Attach user details
      req.userId = user._id;
      req.role = user.role;
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error in verifyToken: ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
