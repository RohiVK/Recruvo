import React from 'react';
import { useLocation } from 'react-router';
import { Menu, Search, Upload } from 'lucide-react';

export function TopNav({ onOpenSidebar, onOpenCommandPalette, onOpenUploader }) {
  const location = useLocation();

  const getPageContext = (path) => {
    if (path === '/') return { title: 'Overview', desc: 'Your AI hiring workspace at a glance' };
    if (path.startsWith('/candidates')) return { title: 'Candidates', desc: 'Manage, analyze and screen candidate talent pool' };
    if (path.startsWith('/jobs')) return { title: 'Job Roles', desc: 'Define roles and analyze applicant match coverage' };
    if (path.startsWith('/screenings')) return { title: 'Screening Workspace', desc: 'AI-powered match score evaluations and reasoning' };
    return { title: 'Hirely Workspace', desc: 'Hire smarter. Hire better.' };
  };

  const { title, desc } = getPageContext(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile menu toggle + page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-none">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block mt-1">{desc}</p>
        </div>
      </div>

      {/* Right: Search, Actions */}
      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-300 hover:bg-white transition"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
            Ctrl K
          </kbd>
        </button>

        {/* Quick Upload Resume Action */}
        <button
          onClick={onOpenUploader}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Resume</span>
        </button>
      </div>
    </header>
  );
}
