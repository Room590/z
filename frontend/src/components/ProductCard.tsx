import { Link } from 'react-router-dom'
import { CartItem, useCart } from '../context/CartContext'

type Props = {
  product: { _id: string; title: string; price: number; description: string; images: string[]; sellerId: string }
}

const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart()

  const addToCart = () => {
    const item: CartItem = { productId: product._id, title: product.title, price: product.price, quantity: 1, image: product.images[0] }
    addItem(item)
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col">
      <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.title} className="h-40 object-cover rounded" />
      <h3 className="font-semibold mt-3 text-lg line-clamp-1">{product.title}</h3>
      <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mt-auto pt-3">
        <span className="text-primary font-bold">${product.price}</span>
        <div className="flex gap-2">
          <button onClick={addToCart} className="btn-primary text-sm">Add to Cart</button>
          <Link to={`/products/${product._id}`} className="text-primary text-sm hover:underline">
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
