import React from "react";

export const InputGroup = ({
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  invalid = false,
  hint = null,
  ...rest
}) => (
  <div className="mb-4">
    {label && (
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-3.5 w-5 h-5 text-stone-400">{icon}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full bg-stone-50 border rounded-xl py-3.5 ${icon ? "pl-11" : "pl-4"} pr-4 focus:outline-none focus:ring-2 focus:bg-white transition-all text-stone-800 font-medium ${
          invalid
            ? "border-red-300 focus:ring-red-500"
            : "border-stone-200 focus:ring-emerald-500"
        }`}
        placeholder={placeholder}
        {...rest}
      />
    </div>
    {hint && (
      <p className={`text-xs mt-2 ml-1 ${invalid ? "text-red-600" : "text-stone-500"}`}>
        {hint}
      </p>
    )}
  </div>
);
