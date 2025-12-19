import { useEffect, useState } from 'react'
import api from '../api/client'
import ProductCard from '../components/ProductCard'

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [productRes, categoryRes] = await Promise.all([api.get('/products', { params: { category: selectedCategory || undefined } }), api.get('/categories')])
      setProducts(productRes.data)
      setCategories(categoryRes.data)
      setLoading(false)
    }
    load()
  }, [selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Explore products</h1>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
