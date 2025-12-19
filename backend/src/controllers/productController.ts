import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { Product } from '../models/Product.js'

export const createProduct = async (req: AuthRequest, res: Response) => {
  const product = new Product({ ...req.body, sellerId: req.user!.id })
  await product.save()
  res.status(201).json(product)
}

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const product = await Product.findOne({ _id: req.params.id, sellerId: req.user!.id })
  if (!product) return res.status(404).json({ message: 'Product not found' })

  Object.assign(product, req.body)
  await product.save()
  res.json(product)
}

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, sellerId: req.user!.id },
    { isActive: false },
    { new: true }
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
}

export const listProducts = async (req: AuthRequest, res: Response) => {
  const { category, seller } = req.query
  const filter: any = { isActive: true }
  if (category) filter.categoryId = category
  if (seller) filter.sellerId = seller

  const products = await Product.find(filter).populate('categoryId').lean()
  res.json(products)
}

export const getProduct = async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id).populate('categoryId')
  if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
}
