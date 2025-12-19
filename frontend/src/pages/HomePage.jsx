import React, { useEffect, useState } from 'react';
import { ProductService, CategoryService } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', categoryId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        ProductService.list(filters),
        CategoryService.list()
      ]);
      setProducts(productRes.data);
      setCategories(categoryRes.data);
      setLoading(false);
    };
    load();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search products"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <select
          value={filters.categoryId}
          onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default HomePage;
