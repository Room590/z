import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center mb-3 rounded">
        {product.images?.length ? (
          <img src={product.images[0]} alt={product.title} className="h-full object-cover" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
      <p className="text-orange-600 font-bold mt-1">${product.price}</p>
      <div className="mt-auto flex gap-2 text-sm">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 text-center border border-orange-500 text-orange-600 rounded py-2"
        >
          Details
        </Link>
        <button
          onClick={() => dispatch({ type: 'ADD', payload: product })}
          className="flex-1 text-center bg-orange-500 text-white rounded py-2"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
