import React from "react";

export default function ScoreIndicator({
  score = 0,
  label = "Overall Match",
  size = "md", // sm | md | lg | xl
  showRing = true,
  category = null,
}) {
  const numScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color mapping matching Nexcent Green theme
  const getColor = (val) => {
    if (val >= 80) {
      return {
        text: "text-[#2E7D32]",
        bg: "bg-[#E8F5E9]",
        border: "border-[#C8E6C9]",
        stroke: "#4CAF4F",
      };
    }
    if (val >= 60) {
      return {
        text: "text-[#388E3C]",
        bg: "bg-[#E8F5E9]",
        border: "border-[#C8E6C9]",
        stroke: "#66BB6A",
      };
    }
    if (val >= 40) {
      return {
        text: "text-[#E65100]",
        bg: "bg-[#FFF3E0]",
        border: "border-[#FFE0B2]",
        stroke: "#FFA726",
      };
    }
    return {
      text: "text-[#C62828]",
      bg: "bg-[#FFEBEE]",
      border: "border-[#FFCDD2]",
      stroke: "#EF5350",
    };
  };

  const colors = getColor(numScore);

  // Linear bar representation for compact views
  if (!showRing || size === "sm") {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4D5E80] font-medium">{label}</span>
            <span className={`font-bold ${colors.text}`}>{numScore}%</span>
          </div>
        )}
        <div className="h-2 rounded-full overflow-hidden bg-[#ECEFF1]">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-[#4CAF4F]"
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
            stroke="#ECEFF1"
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
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[#717171]">
              {numScore >= 80 ? "Top Match" : numScore >= 60 ? "Strong Fit" : "Partial"}
            </span>
          )}
        </div>
      </div>

      {label && size !== "sm" && (
        <span className="mt-2 text-xs font-semibold text-center text-[#263238]">
          {label}
        </span>
      )}
    </div>
  );
}
