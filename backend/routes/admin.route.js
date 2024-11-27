import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { getAllUsers,deleteUser ,updateUserRole, assignTask, getUserTasks} from '../controllers/admin.controller.js';

const router = express.Router();

router.get("/users/:userId", verifyToken, authorizeRole("Admin"), getAllUsers);
router.delete('/delete/user/:userId', verifyToken, authorizeRole("Admin"),deleteUser);
router.patch('/update/user/:userId', verifyToken, authorizeRole("Admin"),updateUserRole);
router.post('/assign/task/:userId', verifyToken, authorizeRole("Admin"),assignTask);
router.get('/tasks/:userId', verifyToken,getUserTasks);

export default router;
