import React from "react";
import { NavLink } from "react-router";
import {
  FileText,
  Upload,
  BarChart3,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Layers,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";

export default function Dashboard() {
  const { jobs, candidates, screenings, activeJob, recentActivities } = useRecruvo();

  const stats = [
    {
      title: "Job Descriptions",
      value: jobs.length,
      icon: FileText,
      description: "Active & stored roles",
      href: "/upload-jd",
    },
    {
      title: "Resumes Uploaded",
      value: candidates.length,
      icon: Upload,
      description: "Parsed candidate profiles",
      href: "/upload-resumes",
    },
    {
      title: "Analyses Run",
      value: screenings.length,
      icon: BarChart3,
      description: "AI evaluations completed",
      href: "/analysis",
    },
    {
      title: "Reports Exported",
      value: Math.max(screenings.length > 0 ? Math.floor(screenings.length * 0.7) : 0, 1),
      icon: Download,
      description: "PDF & CSV summaries generated",
      href: "/export",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gray-900" />
              Recruvo Recruitment Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Welcome back!
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              "Smarter Hiring. Brighter Teams." Analyze candidate resumes, evaluate alignment with your
              Job Descriptions, and compare top talent with deep AI grounding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/upload-jd"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-semibold shadow-xs transition-all"
            >
              <FileText className="w-4 h-4" />
              Upload New JD
            </NavLink>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <NavLink
              key={i}
              to={stat.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">{stat.title}</span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
              <p className="text-[11px] text-gray-400 mt-1">{stat.description}</p>
            </NavLink>
          );
        })}
      </div>

      {/* Quick Workflow Action Cards */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Recruitment Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NavLink
            to="/upload-jd"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-900/40 hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center justify-between">
                Upload Job Description
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-gray-500">
                Paste plain text or upload PDF/DOCX to extract skills, qualifications, and role criteria.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {jobs.length} JD(s) stored
            </div>
          </NavLink>

          <NavLink
            to="/upload-resumes"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-900/40 hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center justify-between">
                Upload Resumes
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-gray-500">
                Drag and drop multiple candidate resumes (PDF, DOCX, TXT) for instant AI profile extraction.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              {candidates.length} Candidate(s) loaded
            </div>
          </NavLink>

          <NavLink
            to="/analysis"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-900/40 hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center justify-between">
                Analyze & Match
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-gray-500">
                Run automated candidate screening, evaluate score breakdowns, compare candidates, and export reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              {screenings.length} Evaluated
            </div>
          </NavLink>
        </div>
      </div>

      {/* Active Job Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Job Card */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current Active Role
              </span>
              <Briefcase className="w-4 h-4 text-gray-400" />
            </div>

            {activeJob ? (
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeJob.job_description?.title || "Role #" + activeJob.id}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activeJob.job_description?.company || "Company"} •{" "}
                  {activeJob.job_description?.location || "Remote"}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Experience Required:</span>
                    <span className="font-semibold text-gray-800">
                      {activeJob.job_description?.experience_required || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Required Skills:</span>
                    <span className="font-semibold text-gray-800">
                      {activeJob.job_description?.required_skills?.length || 0} skills
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500">
                <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                No Job Description is currently selected.
                <NavLink
                  to="/upload-jd"
                  className="block mt-2 font-semibold text-gray-900 underline"
                >
                  Upload a JD to begin
                </NavLink>
              </div>
            )}
          </div>

          {activeJob && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
              <NavLink
                to="/analysis"
                className="flex-1 text-center py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                View Matches
              </NavLink>
              <NavLink
                to="/upload-resumes"
                className="flex-1 text-center py-2 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                Add Resumes
              </NavLink>
            </div>
          )}
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              Recent Activity
            </h3>
            <span className="text-[11px] text-gray-400">Session History</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              No recent activity recorded yet. Start by uploading a Job Description or resumes.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-gray-800 font-medium">{act.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-4 font-mono">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
