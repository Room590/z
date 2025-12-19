import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = req.body.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const promoteSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'seller';
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const dashboardStats = async (req, res, next) => {
  try {
    const [userCount, productCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);
    res.json({ userCount, productCount, orderCount });
  } catch (err) {
    next(err);
  }
};
