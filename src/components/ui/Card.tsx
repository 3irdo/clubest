import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = true }) => {
  const hoverClass = hoverable ? 'hover:shadow-lg' : '';

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-shadow duration-200 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};
