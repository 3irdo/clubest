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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {products.map((product) => (
            <div key={product.id} className="bg-slate-50 rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-primary-dark leading-tight mb-3">
                  {product.name}
                </h3>
                <p className="text-text-secondary mb-6 line-clamp-2 leading-relaxed text-sm">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-black text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  <button className="bg-accent-green hover:bg-secondary text-primary-dark p-3 rounded-xl shadow-sm transition-colors flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={withBase('store')}
            className="inline-block bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Ver la tienda
          </a>
        </div>
      </div>
    </section>
  );
};
