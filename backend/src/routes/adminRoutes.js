import express from 'express';
import {
  dashboardStats,
  listUsers,
  promoteSeller,
  updateUserStatus
} from '../controllers/adminController.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin'));
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/promote', promoteSeller);
router.get('/stats', dashboardStats);

export default router;
