import React from "react";
import { NavLink } from "react-router";
import {
  FileText,
  Upload,
  BarChart3,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";
import { Skeleton, SkeletonStats, SkeletonCard, SkeletonTable } from "../components/ui/Skeleton";

export default function Dashboard() {
  const { jobs, candidates, screenings, activeJob, recentActivities, isLoading } = useRecruvo();

  const stats = [
    {
      title: "Job Requisitions",
      value: jobs.length,
      icon: FileText,
      description: "Structured job descriptions",
      href: "/upload-jd",
    },
    {
      title: "Candidate Resumes",
      value: candidates.length,
      icon: Upload,
      description: "Parsed candidate profiles",
      href: "/upload-resumes",
    },
    {
      title: "Screening Evaluations",
      value: screenings.length,
      icon: BarChart3,
      description: "Candidate fit analyses",
      href: "/analysis",
    },
    {
      title: "Decision Reports",
      value: Math.max(screenings.length > 0 ? Math.floor(screenings.length * 0.7) : 0, 1),
      icon: Download,
      description: "Candidate & matrix exports",
      href: "/export",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="p-6 md:p-8 rounded-xl border bg-white border-[#ECEFF1] shadow-xs">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="w-48 h-6 rounded-full" />
              <Skeleton className="w-72 md:w-96 h-8 rounded-lg" />
              <Skeleton className="w-full max-w-lg h-4" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-32 h-10 rounded-lg" />
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
          </div>
        </div>

        <SkeletonStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard height="h-44" />
            <SkeletonTable rows={4} />
          </div>
          <div className="space-y-6">
            <SkeletonCard height="h-60" />
            <SkeletonCard height="h-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <BentoCard className="p-6 md:p-8 relative overflow-hidden bg-white border-[#ECEFF1] shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <Briefcase className="w-3.5 h-3.5 text-[#4CAF4F]" />
              <span>Candidate Match & Screening Intelligence</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-[#263238]">
              Resume Screening & Role Evaluation
            </h1>

            <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#717171]">
              Screen candidate resumes against your exact Job Descriptions with multi-dimensional criteria scoring, comparison matrices, and grounded decision support.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <NavLink
                to="/upload-jd"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold transition-all duration-200 shadow-xs bg-[#4CAF4F] text-white hover:bg-[#43A047]"
              >
                <FileText className="w-4 h-4" />
                <span>Upload Target Job Description</span>
              </NavLink>

              <NavLink
                to="/upload-resumes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold transition-all duration-200 border bg-white text-[#263238] border-[#CFD8DC] hover:bg-[#F5F7FA]"
              >
                <Upload className="w-4 h-4 text-[#4CAF4F]" />
                <span>Batch Upload Resumes</span>
              </NavLink>
            </div>
          </div>

          {/* Quick Active Requisition Pill Card */}
          <div className="p-5 rounded-xl border flex flex-col justify-between w-full lg:w-72 shrink-0 bg-[#F5F7FA] border-[#ECEFF1] text-left">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-[#717171]">Active Requisition</span>
              <span className="w-2 h-2 rounded-full bg-[#4CAF4F]" />
            </div>

            <h3 className="text-sm font-bold truncate text-[#263238]">
              {activeJob?.job_description?.title || activeJob?.title || "No Job Selected"}
            </h3>
            <p className="text-[11px] mt-0.5 truncate text-[#717171]">
              {activeJob?.job_description?.company || "Company"} • {activeJob?.job_description?.location || "Remote"}
            </p>

            <div className="mt-4 pt-3 border-t border-[#ECEFF1] flex items-center justify-between">
              <span className="text-[11px] text-[#717171]">
                {candidates.length} candidate(s) loaded
              </span>
              <NavLink
                to="/analysis"
                className="text-xs font-bold flex items-center gap-1 hover:underline text-[#4CAF4F]"
              >
                <span>View Evaluation</span>
                <ArrowRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <NavLink key={i} to={stat.href} className="group">
              <BentoCard className="p-5 h-full flex flex-col justify-between transition-all duration-200 bg-white border-[#ECEFF1] hover:border-[#4CAF4F] hover:shadow-xs text-left">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                      {stat.title}
                    </span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E8F5E9] text-[#2E7D32] group-hover:bg-[#4CAF4F] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="font-extrabold tracking-tight text-2xl text-[#263238]">
                    {stat.value}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#ECEFF1] flex items-center justify-between text-[11px]">
                  <span className="text-[#717171]">
                    {stat.description}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#4CAF4F]" />
                </div>
              </BentoCard>
            </NavLink>
          );
        })}
      </div>

      {/* 3-Step Guided Recruitment Pipeline */}
      <div className="text-left">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold tracking-tight uppercase tracking-wider flex items-center gap-2 text-[#263238]">
            <TrendingUp className="w-4 h-4 text-[#4CAF4F]" />
            Recruitment Workflow
          </h2>
          <span className="text-[11px] text-[#717171]">
            End-to-End Evaluation Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <NavLink to="/upload-jd" className="group">
            <BentoCard className="p-5 h-full flex flex-col justify-between bg-white border-[#ECEFF1] hover:border-[#4CAF4F] transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-[#E8F5E9] text-[#2E7D32]">
                    1
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#2E7D32] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4CAF4F]" /> Step 1
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1 flex items-center justify-between text-[#263238]">
                  <span>1. Job Requisition</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#4CAF4F]" />
                </h3>
                <p className="text-xs leading-relaxed text-[#717171]">
                  Upload PDF/DOCX or paste JD text. Automatically extracts required skills, experience levels, and responsibilities.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ECEFF1] text-[11px] text-[#717171] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#4CAF4F]" />
                <span>{jobs.length} JD(s) in workspace</span>
              </div>
            </BentoCard>
          </NavLink>

          {/* Step 2 */}
          <NavLink to="/upload-resumes" className="group">
            <BentoCard className="p-5 h-full flex flex-col justify-between bg-white border-[#ECEFF1] hover:border-[#4CAF4F] transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-[#E8F5E9] text-[#2E7D32]">
                    2
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#4D5E80] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#4CAF4F]" /> Step 2
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1 flex items-center justify-between text-[#263238]">
                  <span>2. Candidate Resumes</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#4CAF4F]" />
                </h3>
                <p className="text-xs leading-relaxed text-[#717171]">
                  Batch upload candidate resumes. Structured parsing extracts candidate skills, work history, and education.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ECEFF1] text-[11px] text-[#717171] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#4CAF4F]" />
                <span>{candidates.length} Candidate profile(s) loaded</span>
              </div>
            </BentoCard>
          </NavLink>

          {/* Step 3 */}
          <NavLink to="/analysis" className="group">
            <BentoCard className="p-5 h-full flex flex-col justify-between bg-white border-[#ECEFF1] hover:border-[#4CAF4F] transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-[#E8F5E9] text-[#2E7D32]">
                    3
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#4D5E80] flex items-center gap-1">
                    <BarChart3 className="w-3 h-3 text-[#4CAF4F]" /> Step 3
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1 flex items-center justify-between text-[#263238]">
                  <span>3. Fit Evaluation</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#4CAF4F]" />
                </h3>
                <p className="text-xs leading-relaxed text-[#717171]">
                  Evaluate technical fit, experience, project relevance, and missing skills. Compare profiles and export results.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ECEFF1] text-[11px] text-[#717171] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#4CAF4F]" />
                <span>{screenings.length} Evaluated scores</span>
              </div>
            </BentoCard>
          </NavLink>
        </div>
      </div>

      {/* Bottom Grid: Current Active Role Details & Session Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Active Job Breakdown Card */}
        <BentoCard className="lg:col-span-1 p-5 flex flex-col justify-between bg-white border-[#ECEFF1]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
                Active Job Requisition
              </span>
              <Briefcase className="w-4 h-4 text-[#4CAF4F]" />
            </div>

            {activeJob ? (
              <div>
                <h3 className="text-base font-bold text-[#263238]">
                  {activeJob.job_description?.title || "Role #" + activeJob.id}
                </h3>
                <p className="text-xs mt-0.5 text-[#717171]">
                  {activeJob.job_description?.company || "Company"} •{" "}
                  {activeJob.job_description?.location || "Remote"}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#717171]">Experience:</span>
                    <span className="font-semibold text-[#263238]">
                      {activeJob.job_description?.experience_required || "Specified in JD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#717171]">Required Skills:</span>
                    <span className="font-semibold text-[#263238]">
                      {activeJob.job_description?.required_skills?.length || 0} skills identified
                    </span>
                  </div>
                </div>

                {/* Skill Pills preview */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(activeJob.job_description?.required_skills || []).slice(0, 4).map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10.5px] font-medium border bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#717171]">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-[#90A4AE]" />
                No Job Description is currently selected.
                <NavLink
                  to="/upload-jd"
                  className="block mt-2 font-bold underline text-[#4CAF4F]"
                >
                  Upload a JD to begin
                </NavLink>
              </div>
            )}
          </div>

          {activeJob && (
            <div className="mt-5 pt-4 border-t border-[#ECEFF1] flex gap-2">
              <NavLink
                to="/analysis"
                className="flex-1 text-center py-2 rounded-md text-xs font-bold transition-all bg-[#4CAF4F] text-white hover:bg-[#43A047]"
              >
                View Matches
              </NavLink>
              <NavLink
                to="/upload-resumes"
                className="flex-1 text-center py-2 rounded-md text-xs font-semibold border transition-all bg-white border-[#CFD8DC] text-[#263238] hover:bg-[#F5F7FA]"
              >
                Add Resumes
              </NavLink>
            </div>
          )}
        </BentoCard>

        {/* Recent Session Activity Timeline */}
        <BentoCard className="lg:col-span-2 p-5 bg-white border-[#ECEFF1]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#263238]">
              <Clock className="w-4 h-4 text-[#4CAF4F]" />
              Recent Workspace Activity
            </h3>
            <span className="text-[11px] font-mono text-[#717171]">Activity Log</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#717171]">
              No recent activity recorded yet. Start by uploading a Job Description or candidate resumes.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between py-2 border-b border-[#ECEFF1] last:border-0"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#4CAF4F]" />
                    <p className="text-xs font-medium text-[#263238]">{act.text}</p>
                  </div>
                  <span className="text-[10px] text-[#717171] shrink-0 ml-4 font-mono">
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
