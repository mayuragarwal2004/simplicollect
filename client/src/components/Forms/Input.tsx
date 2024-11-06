import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  disabled = false,
  className = "",
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

  return (
    <div className="input-wrapper">
      {label && <label className="mb-2.5 block text-black dark:text-white">{label}</label>}
      <input
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
