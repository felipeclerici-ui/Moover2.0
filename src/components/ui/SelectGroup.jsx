import React from "react";
import { IChevron } from "./Icon.jsx";

export const SelectGroup = ({ label, options, value, onChange, icon }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-4 top-3.5 w-5 h-5 text-stone-400">{icon}</span>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl py-3.5 ${icon ? 'pl-11' : 'pl-4'} pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer font-medium text-stone-800`}
      >
        <option value="" disabled>Seleccionar...</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-4 pointer-events-none">
        <IChevron className="text-stone-400" />
      </div>
    </div>
  </div>
);
