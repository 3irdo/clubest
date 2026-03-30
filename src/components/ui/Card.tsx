import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = true }) => {
  const hoverClass = hoverable ? 'hover:shadow-md hover:-translate-y-1' : '';

  return (
    <div className={`bg-slate-50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};
