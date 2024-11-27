import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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
      message: "Server error",
    });
  }
};

// Update a user's role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate the role
    const validRoles = ["User", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's role
    user.role = role;
    await user.save();

    generateTokenAndSetCookie(res, user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in updateUserRole: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
