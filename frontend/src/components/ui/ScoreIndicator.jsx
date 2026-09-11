import React from "react";
import { Sparkles, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

export default function ScoreIndicator({
  score = 0,
  label = "Overall Match",
  size = "md", // sm | md | lg | xl
  showRing = true,
  category = null,
}) {
  const { theme } = useRecruvo();
  const isGenz = theme === "genz";
  const numScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color mapping
  const getColor = (val) => {
    if (val >= 80) {
      return {
        text: isGenz ? "text-emerald-400" : "text-emerald-700",
        bg: isGenz ? "bg-emerald-500/10" : "bg-emerald-50",
        border: isGenz ? "border-emerald-500/30" : "border-emerald-200",
        stroke: isGenz ? "#34D399" : "#059669",
        glow: isGenz ? "shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]" : "",
      };
    }
    if (val >= 60) {
      return {
        text: isGenz ? "text-indigo-400" : "text-indigo-700",
        bg: isGenz ? "bg-indigo-500/10" : "bg-indigo-50",
        border: isGenz ? "border-indigo-500/30" : "border-indigo-200",
        stroke: isGenz ? "#818CF8" : "#4F46E5",
        glow: isGenz ? "shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]" : "",
      };
    }
    if (val >= 40) {
      return {
        text: isGenz ? "text-amber-400" : "text-amber-700",
        bg: isGenz ? "bg-amber-500/10" : "bg-amber-50",
        border: isGenz ? "border-amber-500/30" : "border-amber-200",
        stroke: isGenz ? "#FBBF24" : "#D97706",
        glow: isGenz ? "shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]" : "",
      };
    }
    return {
      text: isGenz ? "text-rose-400" : "text-rose-700",
      bg: isGenz ? "bg-rose-500/10" : "bg-rose-50",
      border: isGenz ? "border-rose-500/30" : "border-rose-200",
      stroke: isGenz ? "#F87171" : "#E11D48",
      glow: isGenz ? "shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]" : "",
    };
  };

  const colors = getColor(numScore);

  // Linear bar representation for Classic or compact views
  if (!showRing || size === "sm") {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between text-xs">
            <span className={isGenz ? "text-gray-400" : "text-gray-600"}>{label}</span>
            <span className={`font-bold ${colors.text}`}>{numScore}%</span>
          </div>
        )}
        <div className={`h-2 rounded-full overflow-hidden ${isGenz ? "bg-white/10" : "bg-gray-100"}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isGenz ? "bg-gradient-to-r from-indigo-500 to-emerald-400" : "bg-gray-900"
            }`}
            style={{ width: `${numScore}%` }}
          />
        </div>
      </div>
    );
  }

  // Circular / Radial indicator for Hero & Detailed Analysis
  const radius = size === "xl" ? 54 : size === "lg" ? 40 : 30;
  const strokeWidth = size === "xl" ? 8 : size === "lg" ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className={`relative flex flex-col items-center justify-center ${isGenz ? colors.glow : ""}`}>
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={isGenz ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`font-black tracking-tight leading-none ${
              size === "xl"
                ? "text-3xl"
                : size === "lg"
                ? "text-2xl"
                : "text-lg"
            } ${colors.text}`}
          >
            {numScore}%
          </span>
          {size === "xl" && (
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isGenz ? "text-gray-400" : "text-gray-500"}`}>
              {numScore >= 80 ? "Top Fit" : numScore >= 60 ? "Solid Match" : "Partial"}
            </span>
          )}
        </div>
      </div>

      {label && size !== "sm" && (
        <span
          className={`mt-2 text-xs font-semibold text-center ${
            isGenz ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
