import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { listUsers, updateSellerStatus } from '../controllers/adminController.js'

const router = Router()

router.use(authenticate, authorize(['admin']))
router.get('/users', listUsers)
router.patch('/sellers/:id/status', updateSellerStatus)

export default router
