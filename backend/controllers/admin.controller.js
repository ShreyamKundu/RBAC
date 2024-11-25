import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
      // Fetch all users' name and email
      const users = await User.find({}, "name email role"); // Only name and email
  
      return res.status(200).json({
        success: true,
        users, // Send the list of users' name and email
      });
    } catch (error) {
      console.log("Error in getAllUsers: ", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteUser: ", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};
