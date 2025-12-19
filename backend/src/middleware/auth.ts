import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { User, UserRole } from '../models/User.js'

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { id: string; role: UserRole }
    const user = await User.findById(payload.id)
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' })
    }

    req.user = { id: user.id, role: user.role }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
