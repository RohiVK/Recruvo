import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export function LoadingOverlay({ isVisible, message = '✦ Hirely AI is processing your request...', subtext = 'Please wait while we parse resume data and evaluate candidate match alignment.' }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center space-y-6 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

        {/* Pulse AI Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-indigo-100 animate-ping opacity-75" />
          <div className="relative p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-white shadow-xl">
            <Sparkles className="w-8 h-8 text-indigo-300 animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
            <span>{message}</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {subtext}
          </p>
        </div>

        {/* Progress shimmer bar */}
        <div className="w-full space-y-2 pt-2">
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 animate-shimmer" />
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 block">
            Analyzing with Gemini AI
          </span>
        </div>
      </div>
    </div>
  );
}
