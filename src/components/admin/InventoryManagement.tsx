import React from 'react';
import { CreditCard as Edit, Trash2, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import mockData from '../../data/mockData.json';

export const InventoryManagement: React.FC = () => {
  const { products } = mockData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Gestión de Inventario</h2>
        <Button variant="accent">
          <Package size={20} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Producto
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Categoría
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Precio
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Stock
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Estado
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-text-secondary line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-secondary bg-opacity-20 text-primary text-sm font-semibold rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-primary">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        product.stock < 10 ? 'text-red-500' : 'text-text-primary'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock === 0
                          ? 'bg-red-500 text-white'
                          : product.stock < 10
                          ? 'bg-yellow-400 text-primary-dark'
                          : 'bg-accent-green text-primary-dark'
                      }`}
                    >
                      {product.stock === 0
                        ? 'Agotado'
                        : product.stock < 10
                        ? 'Bajo stock'
                        : 'Disponible'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors">
                        <Edit size={18} className="text-primary" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
