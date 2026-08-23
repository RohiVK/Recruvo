import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Users, Briefcase, Sparkles, BarChart2, Settings, ShieldCheck, X } from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const mainNav = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'Candidates', to: '/candidates', icon: Users },
    { label: 'Job Roles', to: '/jobs', icon: Briefcase },
    { label: 'Screenings', to: '/screenings', icon: Sparkles },
  ];

  const secondaryNav = [
    { label: 'Analytics', to: '/screenings', icon: BarChart2 },
    { label: 'Settings', to: '/jobs', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-black shadow-xs group-hover:bg-indigo-600 transition">
              <span className="text-base font-extrabold tracking-tight">✦</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                Hirely
              </span>
              <span className="text-[10px] font-medium text-slate-400 block mt-1 tracking-wider uppercase">
                AI Hiring Intelligence
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </div>
        <nav className="space-y-1 mb-6">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Workspace section */}
        <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Workspace Shortcuts
        </div>
        <nav className="space-y-1 mb-auto">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Recruiter Workspace Info */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3 px-1">
          <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
            HR
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 truncate">
              Recruiter Workspace
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              hirely.ai SaaS
            </p>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        </div>
      </aside>
    </>
  );
}
