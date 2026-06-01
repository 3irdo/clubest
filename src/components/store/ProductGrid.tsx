import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useData } from '../../hooks/useData';
import { getProducts } from '../../lib/api/products';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';

export const ProductGrid: React.FC = () => {
  const { profile } = useAuth();
  const clientId = profile?.client_id;
  const { addItem, items } = useCart();

  const { data: products, isLoading, error } = useData(
    () => clientId ? getProducts(clientId) : Promise.resolve([]),
    [clientId]
  );

  const inCart = (id: string) => items.some(i => i.id === id);

  if (!clientId || isLoading) return <LoadingSpinner message="Cargando productos..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Tienda</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(products ?? []).length === 0 ? (
          <p className="text-text-secondary">No hay productos disponibles.</p>
        ) : (
          (products ?? []).map((product: any) => (
            <Card key={product.id_product} className="flex flex-col h-full border border-gray-100/50 group">
              <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="text-gray-400 font-medium">Sin imagen</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div>
                  <h3 className="text-lg font-bold text-primary-dark leading-tight mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                    {product.description}
                  </p>
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
                    onClick={() => addItem({
                      id: product.id_product,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url ?? '',
                    })}
                    className={`w-10 h-10 rounded-full shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                      inCart(product.id_product)
                        ? 'bg-primary text-white hover:bg-primary-light'
                        : 'bg-accent-green hover:bg-secondary text-primary-dark'
                    }`}
                  >
                    {inCart(product.id_product) ? <Check size={18} /> : <ShoppingCart size={18} />}
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
