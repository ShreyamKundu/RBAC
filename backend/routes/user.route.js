import express from "express";
import { getUserDetails } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/user-dashboard", verifyToken, getUserDetails);

export default router;
