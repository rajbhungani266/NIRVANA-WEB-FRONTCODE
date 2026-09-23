import React from "react";

export const Input = React.forwardRef(({ 
  className = "", 
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440] focus:ring-2 focus:ring-[#a98440]/20 transition-all ${
          error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
