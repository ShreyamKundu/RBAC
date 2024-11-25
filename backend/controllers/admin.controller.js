import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
      // Fetch all users' name and email
      const users = await User.find({}, "name email"); // Only name and email
  
      return res.status(200).json({
        success: true,
        users, // Send the list of users' name and email
      });
    } catch (error) {
      console.log("Error in getAllUsers: ", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  