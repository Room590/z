import { Router } from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/authController.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), body('role').isIn(['user', 'seller'])],
  validateRequest,
  register
)

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validateRequest, login)

export default router
