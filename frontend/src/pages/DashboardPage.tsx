import { FormEvent, useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', description: '', price: 0, stock: 0, categoryId: '', images: ['https://via.placeholder.com/300'] })
  const [categories, setCategories] = useState<any[]>([])

  const load = async () => {
    const [productRes, orderRes, categoryRes] = await Promise.all([api.get('/products', { params: { seller: user?.id } }), api.get(user?.role === 'seller' ? '/orders/seller' : '/orders/me'), api.get('/categories')])
    setProducts(productRes.data)
    setOrders(orderRes.data)
    setCategories(categoryRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    await api.post('/products', form)
    setForm({ title: '', description: '', price: 0, stock: 0, categoryId: '', images: ['https://via.placeholder.com/300'] })
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard ({user?.role})</h1>
      {user?.role === 'seller' && (
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Create product</h2>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded px-3 py-2" placeholder="Title" />
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="border rounded px-3 py-2" placeholder="Price" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded px-3 py-2 col-span-2" placeholder="Description" />
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} className="border rounded px-3 py-2" placeholder="Stock" />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border rounded px-3 py-2">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary col-span-2">
              Publish
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Your products</h2>
          {products.length === 0 ? <p>No products yet.</p> : products.map((p) => <div key={p._id} className="border-b py-2 flex justify-between"><span>{p.title}</span><span>${p.price}</span></div>)}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Orders</h2>
          {orders.length === 0 ? (
            <p>No orders.</p>
          ) : (
            orders.map((o) => (
              <div key={o._id} className="border-b py-2">
                <p className="font-semibold">Order #{o._id}</p>
                <p className="text-sm text-slate-500">{o.items?.length} items • ${o.totalAmount}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
