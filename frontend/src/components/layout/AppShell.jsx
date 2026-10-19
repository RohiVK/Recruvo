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
    <div className="min-h-screen flex flex-col md:flex-row antialiased bg-[#F8FAFC] text-slate-900">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b z-50 bg-white border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs bg-slate-900 text-white shadow-xs">
            R
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900">Recruvo</span>
            <span className="block text-[10px] text-slate-500">Recruitment Platform</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col justify-between transform transition-transform duration-250 ease-in-out md:static md:translate-x-0 border-r bg-white border-slate-200 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-100">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm bg-slate-900 text-white shadow-xs group-hover:bg-black transition-colors">
                R
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight leading-tight text-slate-900">
                  Recruvo
                </h1>
                <p className="text-[10.5px] text-slate-500">
                  Hiring & Screening Platform
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
                      ? "bg-slate-900 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Active Job Quick Selector */}
          <div className="p-3 mx-3 mb-3 rounded-xl border bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-500">
                <Briefcase className="w-3 h-3 text-slate-500" /> Active Job
              </span>
              {activeJob && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Selected
                </span>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setJobDropdownOpen(!jobDropdownOpen)}
                className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs flex items-center justify-between border transition-all bg-white border-slate-200 text-slate-800 hover:border-slate-300 cursor-pointer"
              >
                <span className="truncate font-medium">
                  {activeJob ? currentJobTitle : "Select or Upload JD"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1" />
              </button>

              {jobDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 p-1 border bg-white border-slate-200 text-slate-800">
                  {jobs.length === 0 ? (
                    <div className="p-2.5 text-[11px] opacity-60 text-center">
                      No Job Descriptions yet
                    </div>
                  ) : (
                    jobs.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => {
                          setActiveJob(j);
                          setJobDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activeJob?.id === j.id
                            ? "bg-slate-100 text-slate-900 font-bold"
                            : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="truncate">
                          {j.job_description?.title || `Job #${j.id}`}
                        </span>
                        {activeJob?.id === j.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                        )}
                      </button>
                    ))
                  )}
                  <NavLink
                    to="/upload-jd"
                    onClick={() => setJobDropdownOpen(false)}
                    className="block text-center text-[11px] font-semibold py-1.5 border-t border-slate-100 text-slate-700 hover:text-black mt-1"
                  >
                    + Upload New Job Description
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border bg-slate-100 text-slate-700 border-slate-200">
                RK
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight text-slate-900">Rohith</p>
                <p className="text-[10px] text-slate-500">Lead Recruiter</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b z-10 transition-colors bg-white border-slate-200">
          {/* Active Job Requisition Context */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Workspace
            </span>
            <span className="opacity-30">•</span>
            {activeJob ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 border-slate-200 text-slate-800">
                <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                <span>Requisition: {currentJobTitle}</span>
              </div>
            ) : (
              <NavLink
                to="/upload-jd"
                className="text-xs underline flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
              >
                No active JD selected (Click to upload)
              </NavLink>
            )}
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>System Operational</span>
            </div>
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
