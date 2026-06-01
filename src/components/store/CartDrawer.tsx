import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createCompleteSale } from '../../lib/api/sales';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { profile } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!profile?.client_id || !profile?.id) return;
    setCheckingOut(true);
    setError(null);
    try {
      await createCompleteSale(
        profile.id,
        items.map(i => ({
          id_product: i.id,
          quantity: i.quantity,
          unit_price: i.price,
        })),
        profile.client_id,
      );
      clearCart();
      setCheckoutDone(true);
    } catch (err: any) {
      setError(err.message ?? 'Error al procesar la compra');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleClose = () => {
    setShowCheckout(false);
    setCheckoutDone(false);
    setError(null);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
          <div className="ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col h-full relative z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-primary-dark">
                  Carrito ({totalItems})
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-text-secondary p-8">
                <ShoppingBag size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">Carrito vacío</p>
                <p className="text-sm">Agrega productos desde la tienda</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary-dark text-sm truncate">{item.name}</p>
                        <p className="text-primary font-bold text-sm">${item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:text-red-500 transition-colors self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Total</span>
                    <span className="text-xl font-black text-primary">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={clearCart} className="flex-1">
                      Vaciar
                    </Button>
                    <Button
                      variant="accent"
                      onClick={() => setShowCheckout(true)}
                      className="flex-1"
                    >
                      Pagar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={showCheckout} onClose={() => !checkingOut && setShowCheckout(false)} title="Confirmar compra" size="sm">
        {checkoutDone ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">¡Compra realizada!</h3>
            <p className="text-text-secondary mb-6">Tu pedido ha sido registrado exitosamente.</p>
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        ) : (
          <>
            <p className="text-text-secondary mb-4">Confirma los siguientes artículos:</p>
            <ul className="space-y-2 mb-6">
              {items.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {item.name} <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center border-t pt-3 mb-6">
              <span className="font-bold text-primary-dark">Total</span>
              <span className="text-xl font-black text-primary">${totalPrice.toLocaleString()}</span>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCheckout(false)} disabled={checkingOut} className="flex-1">
                Cancelar
              </Button>
              <Button variant="accent" onClick={handleCheckout} disabled={checkingOut} className="flex-1">
                {checkingOut ? 'Procesando...' : 'Confirmar compra'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};