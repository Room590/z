import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductService } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { dispatch } = useCart();

  useEffect(() => {
    const load = async () => {
      const res = await ProductService.get(id);
      setProduct(res.data);
    };
    load();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow-sm">
        {product.images?.length ? (
          <img src={product.images[0]} alt={product.title} className="w-full object-cover" />
        ) : (
          <div className="h-60 bg-gray-100 flex items-center justify-center">No image</div>
        )}
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-orange-600 text-xl font-bold">${product.price}</p>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        <button
          onClick={() => dispatch({ type: 'ADD', payload: product })}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
