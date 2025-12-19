import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'
import { useCart } from '../context/CartContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<any>()
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/products/${id}`)
      setProduct(res.data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!product) return <p>Product not found</p>

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-white rounded shadow p-4">
      <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.title} className="rounded" />
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-slate-500">{product.description}</p>
        </div>
        <p className="text-primary text-xl font-semibold">${product.price}</p>
        <button className="btn-primary" onClick={() => addItem({ productId: product._id, title: product.title, price: product.price, quantity: 1 })}>
          Add to cart
        </button>
      </div>
    </div>
  )
}

export default ProductDetailPage
