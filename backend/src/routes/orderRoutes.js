import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getAllOrders,
  getSellerOrders,
  getUserOrders,
  updateStatus
} from '../controllers/orderController.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [body('items').isArray({ min: 1 }), body('items.*.productId').notEmpty(), body('items.*.quantity').isInt({ min: 1 })],
  validate,
  createOrder
);
router.get('/me', authMiddleware, authorizeRoles('user', 'seller', 'admin'), getUserOrders);
router.get('/seller', authMiddleware, authorizeRoles('seller', 'admin'), getSellerOrders);
router.get('/', authMiddleware, authorizeRoles('admin'), getAllOrders);
router.patch('/:id/status', authMiddleware, authorizeRoles('admin'), updateStatus);

export default router;
