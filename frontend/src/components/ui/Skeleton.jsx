import React from "react";

/**
 * Base atomic Skeleton box with shimmer wave effect
 */
export function Skeleton({ className = "", rounded = "rounded-lg" }) {
  return (
    <div
      className={`${rounded} ${className} bg-slate-200/70 skeleton-shimmer-classic`}
    />
  );
}

/**
 * Skeleton Line / Text Bar
 */
export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${
            i === lines - 1 ? "w-3/5" : i === 0 ? "w-11/12" : "w-full"
          }`}
          rounded="rounded-md"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Card for Grids
 */
export function SkeletonCard({ className = "", height = "h-48" }) {
  return (
    <div className={`p-5 rounded-2xl border bg-white border-slate-200 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-2.5" />
          </div>
        </div>
        <Skeleton className="w-14 h-5 rounded-full" />
      </div>
      <div className={`space-y-2.5 ${height}`}>
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    </div>
  );
}

/**
 * 4-Stat Metric Row Skeleton for Dashboard
 */
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border bg-white border-slate-200 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
          <Skeleton className="w-16 h-7 mb-2" />
          <Skeleton className="w-28 h-2.5" />
        </div>
      ))}
    </div>
  );
}

/**
 * Candidate Evaluation / Table Skeleton
 */
export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="rounded-2xl border overflow-hidden bg-white border-slate-200 shadow-xs">
      <div className="p-4 border-b flex items-center justify-between border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-12 h-4 rounded-full" />
        </div>
        <Skeleton className="w-24 h-7 rounded-lg" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-1.5 min-w-0">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-12 h-6 rounded-lg" />
            </div>

            <Skeleton className="w-20 h-8 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full Candidate Deep-Dive Analysis Skeleton
 */
export function SkeletonCandidateDetails() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Skeleton */}
      <div className="p-6 md:p-8 rounded-2xl border bg-white border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
              <Skeleton className="w-32 h-3.5" />
              <div className="flex gap-3 pt-1">
                <Skeleton className="w-28 h-3" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="w-28 h-8 rounded-xl" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
        </div>

        {/* Tab Bar Skeleton */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-lg shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard height="h-32" />
          <SkeletonCard height="h-44" />
        </div>
        <div className="space-y-6">
          <SkeletonCard height="h-64" />
        </div>
      </div>
    </div>
  );
}

/**
 * Full Page Fallback Loader for React Suspense / Page Transitions
 */
export function SkeletonPageLoader() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 animate-fadeIn">
      {/* Top Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-40 h-7" />
          <Skeleton className="w-64 h-3.5" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-24 h-9 rounded-xl" />
          <Skeleton className="w-28 h-9 rounded-xl" />
        </div>
      </div>

      {/* Stats row */}
      <SkeletonStats />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard height="h-48" />
          <SkeletonTable rows={3} />
        </div>
        <div className="space-y-6">
          <SkeletonCard height="h-72" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
