import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createOrder, listSellerOrders, listUserOrders, updateOrderStatus } from '../controllers/orderController.js'

const router = Router()

router.post('/', authenticate, authorize(['user']), [body('items').isArray({ min: 1 })], validateRequest, createOrder)
router.get('/me', authenticate, authorize(['user']), listUserOrders)
router.get('/seller', authenticate, authorize(['seller']), listSellerOrders)
router.patch('/:id/status', authenticate, authorize(['admin']), [body('status').isIn(['pending', 'paid', 'shipped', 'delivered'])], validateRequest, updateOrderStatus)

export default router
