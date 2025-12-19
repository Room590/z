import React, { useEffect, useState } from 'react';
import { OrderService, ProductService } from '../services/api.js';

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      if (user.role === 'seller') {
        const [orderRes, productRes] = await Promise.all([
          OrderService.sellerOrders(),
          ProductService.list({ sellerId: user.id })
        ]);
        setOrders(orderRes.data);
        setMyProducts(productRes.data);
      } else {
        const orderRes = await OrderService.myOrders();
        setOrders(orderRes.data);
      }
    };
    load();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {user?.role === 'seller' && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">My Products</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {myProducts.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded shadow-sm">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-500">Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Orders</h2>
        {orders.length ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded shadow-sm">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                  <span className="font-semibold text-orange-600">{order.status}</span>
                </div>
                <ul className="mt-2 text-sm list-disc list-inside">
                  {order.items.map((item, idx) => (
                    <li key={idx}>Qty {item.quantity}</li>
                  ))}
                </ul>
                <p className="font-semibold mt-2">Total ${order.totalAmount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
