import React from 'react';

export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-slate-200/80 ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className={`h-4 ${i === 0 ? 'w-36' : i === 1 ? 'w-24' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  );
}
