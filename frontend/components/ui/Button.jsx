"use client";
import React from "react";

export function Button({ 
  children, 
  variant = "primary", 
  className = "", 
  fullWidth = false, 
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center font-bold shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap";
  
  const variants = {
    primary: "bg-[#a98440] hover:bg-[#977232] text-white",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
    success: "bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100",
    outline: "bg-transparent border-2 border-[#a98440] text-[#a98440] hover:bg-[#a98440] hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-2xl"
  };

  const variantClass = variants[variant] || variants.primary;
  // Default to md size unless a specific size class is provided in className (simple approach)
  const sizeClass = className.includes("text-") || className.includes("py-") ? "" : sizes.md;
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
