import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../controllers/productController.js'

const router = Router()

router.get('/', listProducts)
router.get('/:id', getProduct)

router.post(
  '/',
  authenticate,
  authorize(['seller']),
  [body('title').notEmpty(), body('description').notEmpty(), body('price').isFloat({ min: 0 }), body('stock').isInt({ min: 0 }), body('categoryId').notEmpty(), body('images').isArray({ min: 1 })],
  validateRequest,
  createProduct
)

router.put(
  '/:id',
  authenticate,
  authorize(['seller']),
  [body('title').optional().notEmpty(), body('price').optional().isFloat({ min: 0 }), body('stock').optional().isInt({ min: 0 })],
  validateRequest,
  updateProduct
)

router.delete('/:id', authenticate, authorize(['seller']), deleteProduct)

export default router
