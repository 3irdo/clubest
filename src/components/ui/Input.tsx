import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  name,
  required = false,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
        className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
};
