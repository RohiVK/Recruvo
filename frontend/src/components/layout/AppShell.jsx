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
} from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

export default function AppShell({ children }) {
  const location = useLocation();
  const { activeJob, jobs, setActiveJob } = useRecruvo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 antialiased font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-gray-900 leading-none">Recruvo</h1>
            <span className="text-[10px] text-gray-500">Smarter Hiring</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                R
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-tight">Recruvo</h1>
                <p className="text-[11px] text-gray-500 font-normal">Smarter Hiring. Brighter Teams.</p>
              </div>
            </div>
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Active Job Description Quick Selector */}
          <div className="p-3 mx-3 mb-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Active JD
              </span>
              {activeJob && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setJobDropdownOpen(!jobDropdownOpen)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <span className="truncate font-medium">
                  {activeJob ? currentJobTitle : "Select or Upload JD"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
              </button>

              {jobDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 p-1">
                  {jobs.length === 0 ? (
                    <div className="p-2 text-[11px] text-gray-500 text-center">
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
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                          activeJob?.id === j.id
                            ? "bg-gray-100 text-gray-900 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="truncate">
                          {j.job_description?.title || `Job #${j.id}`}
                        </span>
                        {activeJob?.id === j.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-900" />
                        )}
                      </button>
                    ))
                  )}
                  <NavLink
                    to="/upload-jd"
                    onClick={() => setJobDropdownOpen(false)}
                    className="block text-center text-[11px] text-indigo-600 hover:text-indigo-800 font-medium py-1.5 border-t border-gray-100 mt-1"
                  >
                    + Upload New JD
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-xs border border-gray-300">
                RK
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">Rohith</p>
                <p className="text-[10px] text-gray-500">Lead Recruiter</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recruvo System</span>
            <span className="text-gray-300">•</span>
            {activeJob ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                <span>Target: {currentJobTitle}</span>
              </div>
            ) : (
              <NavLink
                to="/upload-jd"
                className="text-xs text-gray-500 hover:text-gray-900 underline flex items-center gap-1"
              >
                No active JD selected (Click to upload)
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Engine Ready
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
              RK
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
