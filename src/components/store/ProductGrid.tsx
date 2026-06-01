import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Check, ArrowUpDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useData } from '../../hooks/useData';
import { getProducts } from '../../lib/api/products';
import { getClients } from '../../lib/api/clients';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
type StockFilter = 'all' | 'in-stock' | 'out-of-stock';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const stockFilters: { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
];

export const ProductGrid: React.FC = () => {
  const { profile } = useAuth();
  const clientId = profile?.client_id;
  const { addItem, items } = useCart();
  const [sort, setSort] = useState<SortOption>('default');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [clients, setClients] = useState<{ id_client: string; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    getClients().then((data) => {
      setClients(data);
      if (!selectedClient && clientId) setSelectedClient(clientId);
    }).catch(() => {});
  }, [clientId]);

  useEffect(() => {
    if (clientId && !selectedClient) setSelectedClient(clientId);
  }, [clientId, selectedClient]);

  const showAll = selectedClient === '__all__';
  const activeClient = showAll ? null : (selectedClient || clientId);

  const { data: products, isLoading, error } = useData(
    () => getProducts(activeClient),
    [activeClient]
  );

  const filtered = useMemo(() => {
    let list = [...(products ?? [])] as any[];

    if (stockFilter === 'in-stock') list = list.filter(p => p.stock > 0);
    else if (stockFilter === 'out-of-stock') list = list.filter(p => p.stock === 0);

    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return list;
  }, [products, sort, stockFilter]);

  const inCart = (id: string) => items.some(i => i.id === id);

  if ((!showAll && !activeClient) || isLoading) return <LoadingSpinner message="Cargando productos..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">
          {showAll ? 'Todos los productos' : `Tienda ${clients.find(c => c.id_client === activeClient)?.name ?? ''}`}
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={showAll ? '__all__' : activeClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="input-field text-sm py-1.5 pr-8 min-w-[180px]"
          >
            <option value={clientId ?? ''}>My Club</option>
            <option value="__all__">All Clubs</option>
            {clients.filter(c => c.id_client !== clientId).map((c) => (
              <option key={c.id_client} value={c.id_client}>{c.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-text-secondary" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-field text-sm py-1.5 pr-8"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as StockFilter)}
            className="input-field text-sm py-1.5 pr-8"
          >
            {stockFilters.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <p className="text-text-secondary col-span-full text-center py-12">
            {stockFilter !== 'all' ? 'No products match the selected filter.' : 'No hay productos disponibles.'}
          </p>
        ) : (
          filtered.map((product: any) => (
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
