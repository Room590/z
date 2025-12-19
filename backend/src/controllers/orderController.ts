import { AuthRequest } from '../middleware/auth.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { Response } from 'express'

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { items } = req.body
  const productIds = items.map((item: any) => item.productId)
  const dbProducts = await Product.find({ _id: { $in: productIds }, isActive: true })

  const enrichedItems = items.map((item: any) => {
    const product = dbProducts.find((p) => p.id === item.productId)
    if (!product) throw new Error('Invalid product in cart')
    return { productId: product.id, quantity: item.quantity, price: product.price }
  })

  const totalAmount = enrichedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const order = new Order({ userId: req.user!.id, items: enrichedItems, totalAmount })
  await order.save()
  res.status(201).json(order)
}

export const listUserOrders = async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ userId: req.user!.id }).populate('items.productId')
  res.json(orders)
}

export const listSellerOrders = async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ 'items.productId': { $exists: true } })
    .populate({ path: 'items.productId', match: { sellerId: req.user!.id } })
    .lean()
  const filtered = orders.filter((order) => order.items.some((i: any) => i.productId))
  res.json(filtered)
}

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  order.status = req.body.status
  await order.save()
  res.json(order)
}
