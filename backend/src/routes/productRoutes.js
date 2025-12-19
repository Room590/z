import express from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from '../controllers/productController.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'backend/uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post(
  '/',
  authMiddleware,
  authorizeRoles('seller', 'admin'),
  upload.array('images', 4),
  [body('title').notEmpty(), body('price').isNumeric(), body('categoryId').notEmpty()],
  validate,
  createProduct
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('seller', 'admin'),
  upload.array('images', 4),
  validate,
  updateProduct
);
router.delete('/:id', authMiddleware, authorizeRoles('seller', 'admin'), deleteProduct);

export default router;
