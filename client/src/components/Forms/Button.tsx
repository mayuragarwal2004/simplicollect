import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  // Base button styles
  const baseStyles = `
    flex items-center justify-center rounded p-3 font-medium transition
  `;

  // Variant-based styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    secondary: 'bg-secondary text-white hover:bg-opacity-90',
    danger: 'bg-red-500 text-white hover:bg-opacity-90',
  };

  // Disabled styles
  const disabledStyles = 'cursor-not-allowed opacity-50';

  return (
    <button
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${disabled ? disabledStyles : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
