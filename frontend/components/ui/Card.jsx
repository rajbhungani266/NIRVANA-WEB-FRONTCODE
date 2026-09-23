import React from "react";

export function Card({ 
  children, 
  className = "",
  padding = "p-6",
  hoverEffect = false
}) {
  const hoverClass = hoverEffect ? "transition hover:shadow-sm hover:border-slate-300" : "";
  
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-xs ${padding} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
