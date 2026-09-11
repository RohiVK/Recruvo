import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  Upload,
  BarChart3,
  Users,
  Download,
  Settings,
  MessageSquare,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";
import ThemeToggle from "./ThemeToggle";

export default function AppShell({ children }) {
  const location = useLocation();
  const { activeJob, jobs, setActiveJob, theme } = useRecruvo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const isGenz = theme === "genz";

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Upload JD", href: "/upload-jd", icon: FileText },
    { name: "Upload Resumes", href: "/upload-resumes", icon: Upload },
    { name: "Analysis", href: "/analysis", icon: BarChart3 },
    { name: "Compare", href: "/compare", icon: Users },
    { name: "Export", href: "/export", icon: Download },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
  ];

  const currentJobTitle = activeJob?.job_description?.title || activeJob?.title || "No Job Selected";

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row antialiased transition-colors duration-250 ${
        isGenz
          ? "bg-[#08090E] text-slate-100"
          : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Mobile Top Bar */}
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 border-b z-50 ${
          isGenz
            ? "bg-[#0E1018]/95 border-white/10 backdrop-blur-md"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
              isGenz
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                : "bg-slate-900 text-white"
            }`}
          >
            R
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight">Recruvo</span>
            <span className={`block text-[10px] ${isGenz ? "text-indigo-300" : "text-slate-500"}`}>
              Smarter Hiring
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isGenz ? "text-slate-300 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"}`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col justify-between transform transition-transform duration-250 ease-in-out md:static md:translate-x-0 border-r ${
          isGenz
            ? "bg-[#0E1018] border-white/[0.08]"
            : "bg-white border-slate-200"
        } ${mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand Header */}
          <div className={`p-5 border-b ${isGenz ? "border-white/[0.08]" : "border-slate-100"}`}>
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  isGenz
                    ? "bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-[0_0_20px_-3px_rgba(99,102,241,0.6)] group-hover:scale-105"
                    : "bg-slate-900 text-white shadow-xs group-hover:bg-black"
                }`}
              >
                R
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight leading-tight flex items-center gap-1.5">
                  Recruvo
                  {isGenz && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AI
                    </span>
                  )}
                </h1>
                <p className={`text-[10.5px] ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Smarter Hiring. Brighter Teams.
                </p>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? isGenz
                        ? "bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-[0_0_18px_-3px_rgba(99,102,241,0.5)] border border-indigo-400/30 font-bold"
                        : "bg-slate-900 text-white shadow-xs"
                      : isGenz
                      ? "text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : isGenz
                        ? "text-slate-400 group-hover:text-indigo-400"
                        : "text-slate-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Active Job Quick Selector */}
          <div
            className={`p-3 mx-3 mb-3 rounded-xl border ${
              isGenz
                ? "bg-white/[0.03] border-white/[0.08]"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isGenz ? "text-slate-400" : "text-slate-400"
                }`}
              >
                <Briefcase className="w-3 h-3" /> Active JD
              </span>
              {activeJob && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                    isGenz
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  Selected
                </span>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setJobDropdownOpen(!jobDropdownOpen)}
                className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs flex items-center justify-between border transition-all ${
                  isGenz
                    ? "bg-[#141724] border-white/10 text-slate-200 hover:border-indigo-500/50"
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                }`}
              >
                <span className="truncate font-medium">
                  {activeJob ? currentJobTitle : "Select or Upload JD"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1" />
              </button>

              {jobDropdownOpen && (
                <div
                  className={`absolute bottom-full left-0 right-0 mb-1 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 p-1 border ${
                    isGenz
                      ? "bg-[#161928] border-white/10 text-slate-200"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  {jobs.length === 0 ? (
                    <div className="p-2.5 text-[11px] opacity-60 text-center">
                      No Job Descriptions yet
                    </div>
                  ) : (
                    jobs.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => {
                          setActiveJob(j);
                          setJobDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          activeJob?.id === j.id
                            ? isGenz
                              ? "bg-indigo-600/30 text-indigo-300 font-bold"
                              : "bg-slate-100 text-slate-900 font-bold"
                            : isGenz
                            ? "hover:bg-white/[0.06] text-slate-300"
                            : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="truncate">
                          {j.job_description?.title || `Job #${j.id}`}
                        </span>
                        {activeJob?.id === j.id && (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${isGenz ? "text-indigo-400" : "text-slate-900"}`}
                          />
                        )}
                      </button>
                    ))
                  )}
                  <NavLink
                    to="/upload-jd"
                    onClick={() => setJobDropdownOpen(false)}
                    className={`block text-center text-[11px] font-semibold py-1.5 border-t mt-1 ${
                      isGenz
                        ? "border-white/10 text-indigo-400 hover:text-indigo-300"
                        : "border-slate-100 text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    + Upload New JD
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Footer */}
          <div className={`p-4 border-t ${isGenz ? "border-white/[0.08]" : "border-slate-100"} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  isGenz
                    ? "bg-indigo-950/80 text-indigo-200 border-indigo-500/40"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                RK
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">Rohith</p>
                <p className={`text-[10px] ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Lead Recruiter
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header
          className={`hidden md:flex items-center justify-between px-8 py-3.5 border-b z-10 transition-colors ${
            isGenz
              ? "bg-[#0E1018]/80 border-white/[0.08] backdrop-blur-md"
              : "bg-white border-slate-200"
          }`}
        >
          {/* Active Job Requisition Context */}
          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isGenz ? "text-slate-400" : "text-slate-400"
              }`}
            >
              Recruvo Workspace
            </span>
            <span className="opacity-30">•</span>
            {activeJob ? (
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                  isGenz
                    ? "bg-white/[0.04] border-white/10 text-slate-200 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 opacity-60 text-indigo-400" />
                <span>Requisition: {currentJobTitle}</span>
              </div>
            ) : (
              <NavLink
                to="/upload-jd"
                className={`text-xs underline flex items-center gap-1 font-medium ${
                  isGenz ? "text-indigo-400 hover:text-indigo-300" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                No active JD selected (Click to upload)
              </NavLink>
            )}
          </div>

          {/* Right Header Actions: Theme Switcher & AI Status */}
          <div className="flex items-center gap-4">
            {/* AI Health Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                isGenz
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded AI Online</span>
            </div>

            {/* Global Theme Toggle (CLASSIC ◐ GEN-Z) */}
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
