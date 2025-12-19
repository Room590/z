import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No order items' });

    const enrichedItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findById(productId);
        if (!product || !product.isActive || product.stock < quantity) {
          throw new Error('Invalid product or insufficient stock');
        }
        product.stock -= quantity;
        await product.save();
        return {
          productId,
          quantity,
          price: product.price,
          sellerId: product.sellerId
        };
      })
    );

    const totalAmount = enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ userId: req.user._id, items: enrichedItems, totalAmount });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
