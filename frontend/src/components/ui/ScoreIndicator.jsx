import React from "react";

export default function ScoreIndicator({
  score = 0,
  label = "Overall Match",
  size = "md", // sm | md | lg | xl
  showRing = true,
  category = null,
}) {
  const numScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color mapping
  const getColor = (val) => {
    if (val >= 80) {
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        stroke: "#059669",
      };
    }
    if (val >= 60) {
      return {
        text: "text-indigo-700",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        stroke: "#4F46E5",
      };
    }
    if (val >= 40) {
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        stroke: "#D97706",
      };
    }
    return {
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      stroke: "#E11D48",
    };
  };

  const colors = getColor(numScore);

  // Linear bar representation for compact views
  if (!showRing || size === "sm") {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">{label}</span>
            <span className={`font-bold ${colors.text}`}>{numScore}%</span>
          </div>
        )}
        <div className="h-2 rounded-full overflow-hidden bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-slate-900"
            style={{ width: `${numScore}%` }}
          />
        </div>
      </div>
    );
  }

  // Circular / Radial indicator for detailed analysis
  const radius = size === "xl" ? 54 : size === "lg" ? 40 : 30;
  const strokeWidth = size === "xl" ? 8 : size === "lg" ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="#E2E8F0"
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
            className="transition-all duration-700 ease-out"
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
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-500">
              {numScore >= 80 ? "Top Match" : numScore >= 60 ? "Strong Fit" : "Partial"}
            </span>
          )}
        </div>
      </div>

      {label && size !== "sm" && (
        <span className="mt-2 text-xs font-semibold text-center text-slate-700">
          {label}
        </span>
      )}
    </div>
  );
}
