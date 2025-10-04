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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-secondary bg-opacity-20 text-primary text-sm font-semibold rounded-full">
                {product.category}
              </span>
              <h3 className="text-xl font-bold text-primary-dark">
                {product.name}
              </h3>
              <p className="text-text-secondary text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between pt-4">
                <span className="text-2xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm text-text-secondary">
                  Stock: {product.stock}
                </span>
              </div>
              <Button
                variant="accent"
                className="w-full flex items-center justify-center gap-2"
                disabled={product.stock === 0}
              >
                <ShoppingCart size={20} />
                Agregar al carrito
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
