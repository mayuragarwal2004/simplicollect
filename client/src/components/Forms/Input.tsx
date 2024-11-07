import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  status?: 'error' | 'success' | 'default';
  errorMessage?: string;
  parentClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  disabled = false,
  className = '',
  status = 'default',
  errorMessage,
  parentClassName = '',
  ...props
}) => {
  // Define base styles and additional classNames based on props
  const baseStyles = `
    w-full rounded-lg border-[1.5px] py-3 px-5 text-black outline-none transition
    dark:text-white
  `;
  const enabledStyles = `
    border-stroke bg-transparent focus:border-primary active:border-primary 
    dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary
  `;
  const disabledStyles = `
    cursor-default bg-whiter dark:bg-black
  `;

  // Conditional styles for error and success
  const statusStyles = {
    error: 'border-red-500 focus:border-red-500 text-red-600 dark:text-red-500',
    success: 'border-green-500 focus:border-green-500 text-green-600 dark:text-green-500',
    default: ''
  };

  return (
    <div className={`input-wrapper ${parentClassName}`}>
      {label && (
        <label className="mb-2.5 mt-5 block text-black dark:text-white">
          {label}
        </label>
      )}
      <input
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles} ${
          statusStyles[status]
        } ${className}`}
        {...props}
      />
      {status === 'error' && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
