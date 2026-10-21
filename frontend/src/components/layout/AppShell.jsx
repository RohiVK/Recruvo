import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
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
  LogOut,
  Home,
} from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

export default function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeJob, jobs, setActiveJob } = useRecruvo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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
    <div className="min-h-screen flex flex-col md:flex-row antialiased bg-[#F5F7FA] text-[#263238]">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b z-50 bg-white border-[#ECEFF1]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs bg-[#4CAF4F] text-white shadow-xs">
            R
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#263238]">Recruvo</span>
            <span className="block text-[10px] text-[#717171]">Recruitment Platform</span>
          </div>
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            title="Landing Page / Sign Out"
            className="p-2 rounded-lg text-[#717171] hover:text-[#263238] hover:bg-[#F5F7FA]"
          >
            <LogOut className="w-4 h-4" />
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#263238] hover:bg-[#F5F7FA] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col justify-between transform transition-transform duration-250 ease-in-out md:static md:translate-x-0 border-r bg-white border-[#ECEFF1] ${
          mobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-[#ECEFF1] flex items-center justify-between">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm bg-[#4CAF4F] text-white shadow-xs group-hover:bg-[#43A047] transition-colors">
                R
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight leading-tight text-[#263238]">
                  Recruvo
                </h1>
                <p className="text-[10.5px] text-[#717171]">
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
                item.href === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#4CAF4F] text-white shadow-xs font-bold"
                      : "text-[#4D5E80] hover:text-[#263238] hover:bg-[#E8F5E9]/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white" : "text-[#717171]"
                    }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Active Job Quick Selector */}
          <div className="p-3 mx-3 mb-3 rounded-lg border bg-[#F5F7FA] border-[#ECEFF1]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-[#717171]">
                <Briefcase className="w-3 h-3 text-[#4CAF4F]" /> Active Job
              </span>
              {activeJob && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  Selected
                </span>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setJobDropdownOpen(!jobDropdownOpen)}
                className="w-full text-left rounded-md px-2.5 py-1.5 text-xs flex items-center justify-between border transition-all bg-white border-[#CFD8DC] text-[#263238] hover:border-[#4CAF4F] cursor-pointer"
              >
                <span className="truncate font-medium">
                  {activeJob ? currentJobTitle : "Select or Upload JD"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1 text-[#717171]" />
              </button>

              {/* Dropdown Options */}
              {jobDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg shadow-lg border p-1 z-50 max-h-48 overflow-y-auto bg-white border-[#ECEFF1]">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                    Available Requisitions ({jobs.length})
                  </div>
                  {jobs.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-[#717171] text-center">
                      No jobs uploaded yet
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
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                          activeJob?.id === j.id
                            ? "bg-[#E8F5E9] font-bold text-[#2E7D32]"
                            : "hover:bg-[#F5F7FA] text-[#4D5E80]"
                        }`}
                      >
                        <span className="truncate">
                          {j.job_description?.title || `Job #${j.id}`}
                        </span>
                        {activeJob?.id === j.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF4F]" />
                        )}
                      </button>
                    ))
                  )}
                  <NavLink
                    to="/upload-jd"
                    onClick={() => setJobDropdownOpen(false)}
                    className="block text-center text-[11px] font-semibold py-1.5 border-t border-[#ECEFF1] text-[#4CAF4F] hover:text-[#388E3C] mt-1"
                  >
                    + Upload New Job Description
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Footer & Sign Out */}
          <div className="p-4 border-t border-[#ECEFF1] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]">
                RK
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight text-[#263238]">Rohith</p>
                <p className="text-[10px] text-[#717171]">Lead Recruiter</p>
              </div>
            </div>

            <NavLink
              to="/"
              title="Return to Landing Page / Sign Out"
              className="p-1.5 rounded-md text-[#717171] hover:text-[#C62828] hover:bg-[#FFEBEE] transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b z-10 transition-colors bg-white border-[#ECEFF1]">
          {/* Active Job Requisition Context */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Workspace
            </span>
            <span className="opacity-30">•</span>
            {activeJob ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]">
                <Briefcase className="w-3.5 h-3.5 text-[#4CAF4F]" />
                <span>Requisition: {currentJobTitle}</span>
              </div>
            ) : (
              <NavLink
                to="/upload-jd"
                className="text-xs underline flex items-center gap-1 font-medium text-[#4CAF4F] hover:text-[#388E3C]"
              >
                No active JD selected (Click to upload)
              </NavLink>
            )}
          </div>

          {/* Right Header Status & Landing Link */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <span className="w-2 h-2 rounded-full bg-[#4CAF4F]" />
              <span>System Operational</span>
            </div>

            <NavLink
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#4D5E80] hover:text-[#263238] px-3 py-1 rounded-md hover:bg-[#F5F7FA] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </NavLink>
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
