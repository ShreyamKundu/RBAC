import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js"; 

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user, 
    });
  } catch (error) {
    console.log("Error in getUserDetails ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId, status } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.status = status;
    await task.save();
    console.log("task", task);
    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.log("Error in updateTask ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};