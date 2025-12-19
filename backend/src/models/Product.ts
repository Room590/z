import mongoose, { Document, Schema } from 'mongoose'
import { ICategory } from './Category.js'
import { IUser } from './User.js'

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  images: string[]
  stock: number
  sellerId: IUser['_id']
  categoryId: ICategory['_id']
  isActive: boolean
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, min: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const Product = mongoose.model<IProduct>('Product', ProductSchema)
