import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { config } from '../config/env.js'

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: config.jwtExpiry })
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ name, email, passwordHash: hashed, role })
  await user.save()
  const token = generateToken(user.id, user.role)
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user.id, user.role)
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}
