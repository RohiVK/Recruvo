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
          ? "border-[#4CAF4F] ring-1 ring-[#4CAF4F]/20 shadow-sm"
          : "border-[#ECEFF1] hover:border-[#CFD8DC] shadow-xs"
      } rounded-xl ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
