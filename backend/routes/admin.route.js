import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { getAllUsers,deleteUser } from '../controllers/admin.controller.js';

const router = express.Router();

router.get("/users", verifyToken, authorizeRole("Admin"), getAllUsers);
router.delete('/delete/user/:userId', verifyToken, authorizeRole("Admin"),deleteUser);


export default router;
