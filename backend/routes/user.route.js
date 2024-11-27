import express from "express";
import { getUserDetails, updateTask } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/user-dashboard", verifyToken, getUserDetails);
router.patch("/update-task/:taskId", verifyToken, updateTask);

export default router;
