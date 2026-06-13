import React from "react";

export const Button = ({ children, onClick, variant = 'primary', className = '', full = false, disabled = false }) => {
  const baseStyle = "flex items-center justify-center font-bold rounded-xl transition-all duration-200 py-3.5 px-6 shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 border-2 border-transparent",
    secondary: "bg-white text-emerald-800 border-2 border-emerald-100 hover:bg-emerald-50",
    outline: "bg-transparent text-gray-600 border-2 border-gray-300 hover:border-gray-800",
    ghost: "bg-transparent text-emerald-700 hover:bg-emerald-50 shadow-none",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
