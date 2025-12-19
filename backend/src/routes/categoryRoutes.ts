import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createCategory, listCategories } from '../controllers/categoryController.js'

const router = Router()

router.get('/', listCategories)
router.post('/', authenticate, authorize(['admin']), [body('name').notEmpty()], validateRequest, createCategory)

export default router
