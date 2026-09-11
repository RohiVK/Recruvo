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
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Flame,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";
import ScoreIndicator from "../components/ui/ScoreIndicator";

export default function Dashboard() {
  const { jobs, candidates, screenings, activeJob, recentActivities, theme } = useRecruvo();
  const isGenz = theme === "genz";

  const stats = [
    {
      title: "Job Requisitions",
      value: jobs.length,
      icon: FileText,
      tag: "Active Roles",
      description: "Parsed & structured JDs",
      href: "/upload-jd",
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-500",
    },
    {
      title: "Candidate Resumes",
      value: candidates.length,
      icon: Upload,
      tag: "Talent Roster",
      description: "Parsed candidate profiles",
      href: "/upload-resumes",
      color: "from-indigo-500 to-purple-600",
      accent: "text-indigo-500",
    },
    {
      title: "Screening Analyses",
      value: screenings.length,
      icon: BarChart3,
      tag: "Evaluations",
      description: "5-Pillar fit evaluations",
      href: "/analysis",
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-500",
    },
    {
      title: "Decision Reports",
      value: Math.max(screenings.length > 0 ? Math.floor(screenings.length * 0.7) : 0, 1),
      icon: Download,
      tag: "PDF & CSV",
      description: "Candidate & matrix exports",
      href: "/export",
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner with Visual Storytelling */}
      <BentoCard
        highlight={isGenz}
        className={`p-6 md:p-8 relative overflow-hidden ${
          isGenz
            ? "bg-gradient-to-br from-[#121526] via-[#14172B] to-[#0E101D] border-indigo-500/30"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Ambient Gradient Glow for Gen-Z */}
        {isGenz && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        )}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Tagline Pill */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                isGenz
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenz ? "text-amber-300 animate-pulse" : "text-slate-800"}`} />
              <span>Smarter Hiring. Brighter Teams.</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              AI-Native Recruitment Intelligence
            </h1>

            <p className={`mt-2 text-xs md:text-sm leading-relaxed ${isGenz ? "text-slate-300" : "text-slate-600"}`}>
              Eliminate recruitment guesswork. Screen candidate resumes against your exact Job Descriptions with multi-dimensional fit scoring, side-by-side comparison matrices, and grounded decision support.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <NavLink
                to="/upload-jd"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                  isGenz
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]"
                    : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Upload Target JD</span>
              </NavLink>

              <NavLink
                to="/upload-resumes"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isGenz
                    ? "bg-white/[0.05] hover:bg-white/10 text-slate-200 border-white/10"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Batch Upload Resumes</span>
              </NavLink>
            </div>
          </div>

          {/* Quick Active Requisition Pill Card */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between w-full lg:w-72 shrink-0 ${
              isGenz
                ? "bg-[#181B2E]/90 border-indigo-500/20 shadow-lg"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className={isGenz ? "text-indigo-400" : "text-slate-500"}>Active Requisition</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h3 className="text-sm font-bold truncate">
              {activeJob?.job_description?.title || activeJob?.title || "No Job Selected"}
            </h3>
            <p className={`text-[11px] mt-0.5 truncate ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
              {activeJob?.job_description?.company || "Company"} • {activeJob?.job_description?.location || "Remote"}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className={`text-[11px] ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                {candidates.length} candidate(s) loaded
              </span>
              <NavLink
                to="/analysis"
                className={`text-xs font-bold flex items-center gap-1 hover:underline ${
                  isGenz ? "text-indigo-400" : "text-slate-900"
                }`}
              >
                <span>View Fit</span>
                <ArrowRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Metrics Grid (Bento Style in Gen-Z, Minimal Cards in Classic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <NavLink key={i} to={stat.href} className="group">
              <BentoCard
                className={`p-5 h-full flex flex-col justify-between transition-all duration-300 ${
                  isGenz
                    ? "hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(99,102,241,0.25)]"
                    : "hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isGenz ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {stat.title}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isGenz
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white"
                          : "bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Oversized Statistics in Gen-Z */}
                  <div
                    className={`font-black tracking-tight ${
                      isGenz ? "text-3xl text-white font-mono" : "text-2xl text-slate-900"
                    }`}
                  >
                    {stat.value}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className={isGenz ? "text-slate-400" : "text-slate-500"}>
                    {stat.description}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                      isGenz ? "text-indigo-400" : "text-slate-900"
                    }`}
                  />
                </div>
              </BentoCard>
            </NavLink>
          );
        })}
      </div>

      {/* 3-Step Guided Recruitment Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-bold tracking-tight uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Decision Workflow
          </h2>
          <span className={`text-[11px] ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            SRS Compliant Screening Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <NavLink to="/upload-jd" className="group">
            <BentoCard className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isGenz
                        ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    1
                  </span>
                  <span className="text-[10.5px] font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Step 1
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1 flex items-center justify-between">
                  <span>1. Job Requisition</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Upload PDF/DOCX or paste JD text. AI extracts required skills, experience levels, and responsibilities.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] opacity-70 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>{jobs.length} JD(s) in database</span>
              </div>
            </BentoCard>
          </NavLink>

          {/* Step 2 */}
          <NavLink to="/upload-resumes" className="group">
            <BentoCard className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isGenz
                        ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    2
                  </span>
                  <span className="text-[10.5px] font-semibold text-indigo-400 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Step 2
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1 flex items-center justify-between">
                  <span>2. Batch Resume Parser</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Drop multiple candidate resumes. Automated structured extraction categorizes skills, work history, and education.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] opacity-70 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{candidates.length} Candidate(s) loaded</span>
              </div>
            </BentoCard>
          </NavLink>

          {/* Step 3 */}
          <NavLink to="/analysis" className="group">
            <BentoCard className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isGenz
                        ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    3
                  </span>
                  <span className="text-[10.5px] font-semibold text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Step 3
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1 flex items-center justify-between">
                  <span>3. Multi-Factor Screening</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Evaluate technical fit, experience, project relevance, and missing skills. Compare top profiles & export PDF/CSV.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] opacity-70 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>{screenings.length} Evaluated scores</span>
              </div>
            </BentoCard>
          </NavLink>
        </div>
      </div>

      {/* Bottom Grid: Current Active Role Details & Session Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Job Breakdown Card */}
        <BentoCard className="lg:col-span-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isGenz ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Requisition Target
              </span>
              <Briefcase className="w-4 h-4 opacity-50" />
            </div>

            {activeJob ? (
              <div>
                <h3 className="text-base font-bold">
                  {activeJob.job_description?.title || "Role #" + activeJob.id}
                </h3>
                <p className={`text-xs mt-0.5 ${isGenz ? "text-indigo-300" : "text-slate-500"}`}>
                  {activeJob.job_description?.company || "Company"} •{" "}
                  {activeJob.job_description?.location || "Remote"}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className={isGenz ? "text-slate-400" : "text-slate-500"}>Experience:</span>
                    <span className="font-semibold">
                      {activeJob.job_description?.experience_required || "Specified in JD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={isGenz ? "text-slate-400" : "text-slate-500"}>Required Skills:</span>
                    <span className="font-semibold text-indigo-400">
                      {activeJob.job_description?.required_skills?.length || 0} skills identified
                    </span>
                  </div>
                </div>

                {/* Skill Pills preview */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(activeJob.job_description?.required_skills || []).slice(0, 4).map((sk, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                        isGenz
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                          : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs opacity-70">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No Job Description is currently selected.
                <NavLink
                  to="/upload-jd"
                  className={`block mt-2 font-bold underline ${
                    isGenz ? "text-indigo-400" : "text-slate-900"
                  }`}
                >
                  Upload a JD to begin
                </NavLink>
              </div>
            )}
          </div>

          {activeJob && (
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex gap-2">
              <NavLink
                to="/analysis"
                className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
                  isGenz
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
                    : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                View Matches
              </NavLink>
              <NavLink
                to="/upload-resumes"
                className={`flex-1 text-center py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isGenz
                    ? "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
                    : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                }`}
              >
                Add Resumes
              </NavLink>
            </div>
          )}
        </BentoCard>

        {/* Recent Session Activity Timeline */}
        <BentoCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 opacity-50" />
              Recent Recruitment Activity
            </h3>
            <span className="text-[11px] font-mono opacity-50">Local Session Audit</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-xs opacity-50">
              No recent activity recorded yet. Start by uploading a Job Description or candidate resumes.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className={`flex items-start justify-between py-2 border-b last:border-0 ${
                    isGenz ? "border-white/[0.04]" : "border-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        isGenz ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-slate-900"
                      }`}
                    />
                    <p className="text-xs font-medium">{act.text}</p>
                  </div>
                  <span className="text-[10px] opacity-50 shrink-0 ml-4 font-mono">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </div>
    </div>
  );
}
