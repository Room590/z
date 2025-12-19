import React from 'react';
import { OrderService } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const checkout = async () => {
    const payload = {
      items: state.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }))
    };
    await OrderService.create(payload);
    dispatch({ type: 'CLEAR' });
    alert('Order placed (payment mocked).');
  };

  if (!state.items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="space-y-4">
      {state.items.map((item) => (
        <div key={item.product._id} className="bg-white p-4 rounded shadow-sm flex justify-between">
          <div>
            <p className="font-semibold">{item.product.title}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold">${item.product.price * item.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE', id: item.product._id })}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm">
        <span className="font-semibold">Total: ${total}</span>
        <button onClick={checkout} className="bg-orange-500 text-white px-4 py-2 rounded">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
