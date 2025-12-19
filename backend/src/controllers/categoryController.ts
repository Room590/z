import { Request, Response } from 'express'
import { Category } from '../models/Category.js'

export const createCategory = async (req: Request, res: Response) => {
  const category = new Category(req.body)
  await category.save()
  res.status(201).json(category)
}

export const listCategories = async (_req: Request, res: Response) => {
  const categories = await Category.find().lean()
  res.json(categories)
}
