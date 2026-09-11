import React from "react";
import { useRecruvo } from "../../context/RecruvoContext";

export default function BentoCard({
  children,
  className = "",
  glow = false,
  highlight = false,
  onClick = null,
}) {
  const { theme } = useRecruvo();
  const isGenz = theme === "genz";

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ${
        isGenz
          ? `bg-[#121420]/90 border ${
              highlight
                ? "border-indigo-500/50 shadow-[0_0_25px_-5px_rgba(99,102,241,0.35)]"
                : "border-white/[0.08] hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
            } rounded-2xl backdrop-blur-md`
          : `bg-white border ${
              highlight ? "border-gray-900 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
            } rounded-2xl`
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Top subtle sheen highlight for Gen-Z */}
      {isGenz && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
}
