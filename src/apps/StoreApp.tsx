import React, { useState } from 'react';
import { AppProviders } from '../components/providers/AppProviders';
import { Navbar } from '../components/navigation/Navbar';
import { ProductGrid } from '../components/store/ProductGrid';
import { CartDrawer } from '../components/store/CartDrawer';
import { ContactSection } from '../components/landing/ContactSection';
import { useCart } from '../context/CartContext';

export const StoreApp: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AppProviders>
      <Inner onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </AppProviders>
  );
};

const Inner: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Navbar isLanding={false} onCartClick={onCartClick} totalCartItems={totalItems} />
      <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        <ProductGrid />
      </main>
      <ContactSection />
    </div>
  );
};
