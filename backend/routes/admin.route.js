import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { getAllUsers } from '../controllers/admin.controller.js';

const router = express.Router();

router.get("/users", verifyToken, authorizeRole("Admin"), getAllUsers);



export default router;
