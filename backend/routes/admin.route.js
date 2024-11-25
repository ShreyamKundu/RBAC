import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { getAllUsers } from '../controllers/admin.controller.js';

const router = express.Router();

router.get("/admin-dashboard", verifyToken, authorizeRole("admin"), getAllUsers);



export default router;
