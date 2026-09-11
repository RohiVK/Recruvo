import React from "react";
import { Sparkles, Compass, Zap, Flame } from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useRecruvo();
  const isGenz = theme === "genz";

  if (compact) {
    return (
      <button
        onClick={() => setTheme(isGenz ? "classic" : "genz")}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          isGenz
            ? "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
            : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
        }`}
        title={`Current Theme: ${isGenz ? "Gen-Z (AI-Native)" : "Classic (Minimalist)"}. Click to switch.`}
      >
        {isGenz ? (
          <>
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span className="font-bold tracking-wide">GEN-Z</span>
          </>
        ) : (
          <>
            <Compass className="w-3.5 h-3.5 text-gray-600" />
            <span className="font-medium">CLASSIC</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative inline-flex items-center p-1 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 select-none shadow-2xs backdrop-blur-xs transition-all">
      {/* Sliding Active Pill */}
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out shadow-sm ${
          isGenz
            ? "left-[calc(50%+2px)] bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]"
            : "left-1 bg-white text-gray-900 border border-gray-200/80 shadow-xs"
        }`}
      />

      {/* Classic Option */}
      <button
        type="button"
        onClick={() => setTheme("classic")}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors duration-200 ${
          !isGenz
            ? "font-bold text-gray-900"
            : "font-medium text-gray-400 hover:text-gray-200"
        }`}
      >
        <Compass className={`w-3.5 h-3.5 ${!isGenz ? "text-gray-900" : "text-gray-500"}`} />
        <span>CLASSIC</span>
      </button>

      {/* Gen-Z Option */}
      <button
        type="button"
        onClick={() => setTheme("genz")}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors duration-200 ${
          isGenz
            ? "font-bold text-white tracking-wide"
            : "font-medium text-gray-500 hover:text-gray-900"
        }`}
      >
        <Zap className={`w-3.5 h-3.5 ${isGenz ? "text-amber-300 fill-amber-300 animate-pulse" : "text-gray-400"}`} />
        <span>GEN-Z</span>
      </button>
    </div>
  );
}
