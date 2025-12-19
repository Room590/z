import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

export const listProducts = async (req, res, next) => {
  try {
    const { categoryId, sellerId, search } = req.query;
    const query = { isActive: true };
    if (categoryId) query.categoryId = categoryId;
    if (sellerId) query.sellerId = sellerId;
    if (search) query.title = { $regex: search, $options: 'i' };
    const products = await Product.find(query).populate('categoryId', 'name');
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: 'Invalid category' });
    const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];
    const product = await Product.create({
      title,
      description,
      price,
      stock,
      categoryId,
      sellerId: req.user._id,
      images
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updates = req.body;
    if (req.files?.length) {
      updates.images = [...(product.images || []), ...req.files.map((f) => `/uploads/${f.filename}`)];
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    product.isActive = false;
    await product.save();
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
};
