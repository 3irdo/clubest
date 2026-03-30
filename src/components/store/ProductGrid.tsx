import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import mockData from '../../data/mockData.json';

export const ProductGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { products } = mockData;

  const categories = ['Todos', 'Arcos', 'Flechas', 'Accesorios', 'Dianas'];

  const filteredProducts =
    selectedCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Tienda</h2>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-primary hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col h-full border border-gray-100/50 group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div>
                <p className="text-xs font-bold tracking-wider text-secondary uppercase mb-1">
                  {product.category}
                </p>
                <h3 className="text-lg font-bold text-primary-dark leading-tight mb-1 line-clamp-1">
                  {product.name}
                </h3>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
                <div>
                  <span className="block text-xl font-black text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                  </span>
                </div>
                <button
                  disabled={product.stock === 0}
                  className="bg-accent-green hover:bg-secondary text-primary-dark w-10 h-10 rounded-full shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
