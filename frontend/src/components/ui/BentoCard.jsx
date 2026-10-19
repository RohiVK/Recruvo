import React from "react";

export default function BentoCard({
  children,
  className = "",
  highlight = false,
  onClick = null,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 bg-white border ${
        highlight
          ? "border-slate-900 shadow-sm"
          : "border-slate-200 hover:border-slate-300 shadow-xs"
      } rounded-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
