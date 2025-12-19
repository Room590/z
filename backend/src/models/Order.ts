import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './User.js'
import { IProduct } from './Product.js'

export interface IOrderItem {
  productId: IProduct['_id']
  quantity: number
  price: number
}

export interface IOrder extends Document {
  userId: IUser['_id']
  items: IOrderItem[]
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
)

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' }
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Order', OrderSchema)
