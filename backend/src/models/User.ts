import mongoose, { Document, Schema } from 'mongoose'

export type UserRole = 'user' | 'seller' | 'admin'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  isActive: boolean
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>('User', UserSchema)
