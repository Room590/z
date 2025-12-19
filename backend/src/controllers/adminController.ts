import { Request, Response } from 'express'
import { User } from '../models/User.js'

export const listUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-passwordHash')
  res.json(users)
}

export const updateSellerStatus = async (req: Request, res: Response) => {
  const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'seller' }, { isActive: req.body.isActive }, { new: true })
  if (!user) return res.status(404).json({ message: 'Seller not found' })
  res.json(user)
}
