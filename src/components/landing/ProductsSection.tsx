import React from 'react';
import { ShoppingCart } from 'lucide-react';
import mockData from '../../data/mockData.json';
import { withBase } from '../../lib/withBase';

export const ProductsSection: React.FC = () => {
  const products = mockData.products.slice(0, 3);

  return (
    <section id="equipamiento" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-dark mb-4">
            Equipamiento <span className="text-accent-green">Profesional</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Descubre nuestra selección de equipo de alta calidad, diseñado
            para arqueros de todos los niveles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {product.name}
                </h3>
                <p className="text-text-secondary mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  <button className="bg-accent-green hover:bg-secondary text-primary-dark p-3 rounded-lg transition-colors">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={withBase('tienda')}
            className="inline-block bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Ver la tienda
          </a>
        </div>
      </div>
    </section>
  );
};
