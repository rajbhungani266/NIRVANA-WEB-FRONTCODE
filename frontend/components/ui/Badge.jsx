import React from "react";

export function Badge({ 
  children, 
  variant = "neutral", 
  className = "" 
}) {
  const baseClasses = "inline-block rounded-md px-2 py-0.5 text-xs font-bold whitespace-nowrap";
  
  const variants = {
    primary: "bg-[#a98440]/15 text-[#8a682b] border border-[#a98440]/30",
    success: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    warning: "bg-amber-100 text-amber-700 border border-amber-300",
    danger: "bg-red-100 text-red-700 border border-red-300",
    neutral: "bg-slate-100 text-slate-600",
    dark: "bg-slate-800 text-white"
  };

  const variantClass = variants[variant] || variants.neutral;

  return (
    <span className={`${baseClasses} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
