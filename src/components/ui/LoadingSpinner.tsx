// src/components/ui/LoadingSpinner.tsx
import React from 'react'

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="flex flex-col items-center justify-center py-12 text-text-secondary gap-3">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-sm">{message}</p>
  </div>
)

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <p className="text-red-500 text-sm font-medium">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
)
