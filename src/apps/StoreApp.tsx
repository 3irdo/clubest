import React, { useState } from 'react';
import { AppProviders } from '../components/providers/AppProviders';
import { Navbar } from '../components/navigation/Navbar';
import { ProductGrid } from '../components/store/ProductGrid';
import { CartDrawer } from '../components/store/CartDrawer';
import { ContactSection } from '../components/landing/ContactSection';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleRoute from '../components/auth/RoleRoute';
import { ROLE_NAMES } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const StorePage: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <div className="bg-gray-50 flex flex-col min-h-screen">
        <Navbar isLanding={false} onCartClick={() => setCartOpen(true)} totalCartItems={totalItems} />
        <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
          <ProductGrid />
        </main>
        <ContactSection />
      </div>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export const StoreApp: React.FC = () => {
  return (
    <AppProviders>
      <ProtectedRoute>
        <RoleRoute allowedRoles={[ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER]}>
          <StorePage />
        </RoleRoute>
      </ProtectedRoute>
    </AppProviders>
  );
};
