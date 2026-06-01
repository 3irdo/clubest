// Wraps the entire dashboard with AuthProvider so useAuth() works in all children.
import React from 'react'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  )
}
