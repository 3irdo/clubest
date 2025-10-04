import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  disabled = false
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary hover:bg-primary-light text-white',
    secondary: 'bg-secondary hover:bg-secondary-light text-primary-dark',
    accent: 'bg-accent-green hover:bg-secondary text-primary-dark',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };

  const sizes = {
    sm: 'py-1 px-4 text-sm',
    md: 'py-2 px-6 text-base',
    lg: 'py-3 px-8 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
