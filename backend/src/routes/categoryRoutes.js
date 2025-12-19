import express from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from '../controllers/categoryController.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', authMiddleware, authorizeRoles('admin'), [body('name').notEmpty()], validate, createCategory);
router.put('/:id', authMiddleware, authorizeRoles('admin'), validate, updateCategory);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteCategory);

export default router;
