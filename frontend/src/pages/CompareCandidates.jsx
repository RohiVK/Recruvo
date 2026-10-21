import React, { useState, useEffect } from "react";
import {
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Briefcase,
  Download,
  AlertCircle,
  ChevronDown,
  Scale,
  Zap,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import RecruvoAIChat from "../components/ai/RecruvoAIChat";
import BentoCard from "../components/ui/BentoCard";
import ScoreIndicator from "../components/ui/ScoreIndicator";
import { exportComparisonPDF } from "../api/exports";

export default function CompareCandidates() {
  const { candidates, screenings, activeJob, theme, isVibe } = useRecruvo();
  const isGenz = isVibe;

  const [candidateAId, setCandidateAId] = useState(
    candidates.length > 0 ? String(candidates[0].id) : ""
  );
  const [candidateBId, setCandidateBId] = useState(
    candidates.length > 1
      ? String(candidates[1].id)
      : candidates.length > 0
      ? String(candidates[0].id)
      : ""
  );

  useEffect(() => {
    if (candidates.length > 0 && !candidateAId) {
      setCandidateAId(String(candidates[0].id));
    }
    if (candidates.length > 1 && !candidateBId) {
      setCandidateBId(String(candidates[1].id));
    }
  }, [candidates]);

  const candA = candidates.find((c) => String(c.id) === String(candidateAId));
  const candB = candidates.find((c) => String(c.id) === String(candidateBId));

  const profileA = candA?.resume || candA || {};
  const profileB = candB?.resume || candB || {};

  const screeningA = (screenings || []).find((s) => String(s.resume_id) === String(candidateAId)) || {};
  const screeningB = (screenings || []).find((s) => String(s.resume_id) === String(candidateBId)) || {};

  const scoreA = screeningA.score ? Math.round(screeningA.score * 10) : 0;
  const scoreB = screeningB.score ? Math.round(screeningB.score * 10) : 0;

  const techA = screeningA.technicalScore ? Math.round(screeningA.technicalScore * 10) : scoreA;
  const techB = screeningB.technicalScore ? Math.round(screeningB.technicalScore * 10) : scoreB;

  const expA = screeningA.experienceScore ? Math.round(screeningA.experienceScore * 10) : scoreA;
  const expB = screeningB.experienceScore ? Math.round(screeningB.experienceScore * 10) : scoreB;

  const eduA = screeningA.educationScore ? Math.round(screeningA.educationScore * 10) : scoreA;
  const eduB = screeningB.educationScore ? Math.round(screeningB.educationScore * 10) : scoreB;

  const projA = screeningA.projectScore ? Math.round(screeningA.projectScore * 10) : scoreA;
  const projB = screeningB.projectScore ? Math.round(screeningB.projectScore * 10) : scoreB;

  const nameA = profileA.name || "Candidate A";
  const nameB = profileB.name || "Candidate B";

  const comparisonSuggestions = [
    "Which candidate is stronger technically?",
    "Who has more relevant experience?",
    "What are the biggest differences between them?",
    "Which candidate has fewer skill gaps?",
    "Summarize the tradeoffs.",
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Comparison Matrix</h1>
          <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Side-by-side evaluation of competencies, seniority alignment, verified skills, and trade-offs.
          </p>
        </div>

        {activeJob && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]">
            <Briefcase className="w-3.5 h-3.5 text-[#4CAF4F]" />
            <span>Target: {activeJob.job_description?.title || "Active Job"}</span>
          </div>
        )}
      </div>

      {/* Candidate Selector Bento Bar */}
      <BentoCard className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-11 items-center gap-3">
            {/* Candidate A Selector */}
            <div className="sm:col-span-5">
              <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5 text-[#4D5E80]">
                Candidate A
              </label>
              <select
                value={candidateAId}
                onChange={(e) => setCandidateAId(e.target.value)}
                className="w-full rounded-md px-3.5 py-2.5 text-xs font-bold focus:outline-none transition-all border bg-white border-[#CFD8DC] text-[#263238] focus:border-[#4CAF4F] focus:ring-1 focus:ring-[#4CAF4F]"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`} ({c.resume?.experience?.[0]?.role || "Candidate"})
                  </option>
                ))}
              </select>
            </div>

            {/* VS Badge */}
            <div className="sm:col-span-1 text-center flex justify-center">
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                VS
              </span>
            </div>

            {/* Candidate B Selector */}
            <div className="sm:col-span-5">
              <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5 text-[#4D5E80]">
                Candidate B
              </label>
              <select
                value={candidateBId}
                onChange={(e) => setCandidateBId(e.target.value)}
                className="w-full rounded-md px-3.5 py-2.5 text-xs font-bold focus:outline-none transition-all border bg-white border-[#CFD8DC] text-[#263238] focus:border-[#4CAF4F] focus:ring-1 focus:ring-[#4CAF4F]"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`} ({c.resume?.experience?.[0]?.role || "Candidate"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PDF Download Button */}
          {candA && candB && (
            <button
              onClick={() =>
                exportComparisonPDF({
                  candidateA: candA,
                  screeningA,
                  candidateB: candB,
                  screeningB,
                  job: activeJob,
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-xs font-bold border transition-all shrink-0 self-end md:self-center bg-white border-[#CFD8DC] text-[#263238] hover:bg-[#F5F7FA] shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#4CAF4F]" />
              <span>Comparison PDF</span>
            </button>
          )}
        </div>
      </BentoCard>

      {candidates.length < 2 ? (
        <BentoCard className="p-12 text-center">
          <Scale className="w-10 h-10 opacity-30 mx-auto mb-2" />
          <p className="font-bold text-sm">Need at least 2 candidates to compare</p>
          <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Please upload more resumes on the Upload Resumes page.
          </p>
        </BentoCard>
      ) : (
        /* Main Grid: Comparison Table on Left (8 cols) + Contextual Comparison AI on Right (4 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Comparison Matrix */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <BentoCard className="overflow-hidden">
              <div
                className={`p-4 border-b flex items-center justify-between ${
                  isGenz ? "bg-white/[0.02] border-white/[0.08]" : "bg-slate-50/70 border-slate-200"
                }`}
              >
                <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  Side-by-Side Evaluation Matrix
                </h2>
                <span className={`text-[11px] font-mono ${isGenz ? "text-slate-400" : "text-slate-400"}`}>
                  Grounded Tradeoff Assessment
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-xs font-bold ${
                        isGenz ? "border-white/[0.06] bg-white/[0.01]" : "border-slate-200 bg-slate-50/40"
                      }`}
                    >
                      <th className="py-3 px-4 w-36 uppercase text-[10.5px] text-[#717171]">Pillar</th>
                      <th className="py-3 px-4 text-sm font-bold text-[#4CAF4F]">{nameA}</th>
                      <th className="py-3 px-4 text-sm font-bold text-[#2E7D32]">{nameB}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEFF1] text-xs text-[#263238]">
                    {/* Overall Match */}
                    <tr className="hover:bg-[#F5F7FA]">
                      <td className="py-3.5 px-4 font-bold opacity-80">Overall Fit</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2.5 overflow-hidden bg-[#ECEFF1]">
                            <div
                              className="h-full rounded-full transition-all duration-700 bg-[#4CAF4F]"
                              style={{ width: `${scoreA}%` }}
                            />
                          </div>
                          <span className="font-bold font-mono w-9 text-right text-[#4CAF4F]">{scoreA}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2.5 overflow-hidden bg-[#ECEFF1]">
                            <div
                              className="h-full rounded-full transition-all duration-700 bg-[#2E7D32]"
                              style={{ width: `${scoreB}%` }}
                            />
                          </div>
                          <span className="font-bold font-mono w-9 text-right text-[#2E7D32]">{scoreB}%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Technical Score */}
                    <tr className="hover:bg-[#F5F7FA]">
                      <td className="py-3.5 px-4 font-bold opacity-80">Technical Skills</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2.5 overflow-hidden bg-[#ECEFF1]">
                            <div
                              className="h-full rounded-full bg-[#4CAF4F]"
                              style={{ width: `${techA}%` }}
                            />
                          </div>
                          <span className="font-semibold font-mono w-9 text-right">{techA}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2.5 overflow-hidden bg-[#ECEFF1]">
                            <div
                              className="h-full rounded-full bg-[#2E7D32]"
                              style={{ width: `${techB}%` }}
                            />
                          </div>
                          <span className="font-semibold font-mono w-9 text-right">{techB}%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Experience Score */}
                    <tr className="hover:bg-[#F5F7FA]">
                      <td className="py-3.5 px-4 font-bold opacity-80">Experience Seniority</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2.5 overflow-hidden bg-[#ECEFF1]">
                            <div
                              className="h-full rounded-full bg-[#4CAF4F]"
                              style={{ width: `${expA}%` }}
                            />
                          </div>
                          <span className="font-semibold font-mono w-9 text-right">{expA}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2.5 overflow-hidden bg-[#ECEFF1]">
                            <div
                              className="h-full rounded-full bg-[#2E7D32]"
                              style={{ width: `${expB}%` }}
                            />
                          </div>
                          <span className="font-semibold font-mono w-9 text-right">{expB}%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Verified Strengths */}
                    <tr className={isGenz ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60"}>
                      <td className="py-3.5 px-4 font-bold opacity-80 align-top">Strengths</td>
                      <td className="py-3.5 px-4 align-top">
                        <ul className="space-y-1">
                          {(screeningA.strengths || []).slice(0, 3).map((str, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <ul className="space-y-1">
                          {(screeningB.strengths || []).slice(0, 3).map((str, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>

                    {/* Matching Skills */}
                    <tr className={isGenz ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60"}>
                      <td className="py-3.5 px-4 font-bold opacity-80 align-top">Matching Skills</td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {(screeningA.matchingSkills || screeningA.matching_skills || []).slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                                isGenz
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {(screeningB.matchingSkills || screeningB.matching_skills || []).slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                                isGenz
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {/* Missing Skills */}
                    <tr className={isGenz ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60"}>
                      <td className="py-3.5 px-4 font-bold opacity-80 align-top">Gaps to Probe</td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {(screeningA.missingSkills || screeningA.missing_skills || []).slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                                isGenz
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                  : "bg-amber-50 border-amber-200 text-amber-800"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {(screeningB.missingSkills || screeningB.missing_skills || []).slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                                isGenz
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                  : "bg-amber-50 border-amber-200 text-amber-800"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* AI Comparison Summary Card */}
              <div className={`p-5 border-t ${isGenz ? "bg-white/[0.02] border-white/[0.08]" : "bg-slate-50 border-slate-200"}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-slate-800">
                  <Scale className="w-3.5 h-3.5 text-slate-700" />
                  Comparative Decision Summary
                </h3>
                <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-300" : "text-slate-700"}`}>
                  {nameA} achieved an overall match of {scoreA}% compared to {nameB}'s {scoreB}%.{" "}
                  {scoreA >= scoreB
                    ? `${nameA} demonstrates slightly higher alignment in core JD requirements.`
                    : `${nameB} demonstrates slightly higher alignment in core JD requirements.`}{" "}
                  Use the contextual Recruvo AI panel on the right to probe specific tradeoffs or request tailored interview rounds.
                </p>
              </div>
            </BentoCard>
          </div>

          {/* Right Side: Contextual Recruvo AI on Comparison */}
          <div className="lg:col-span-5 xl:col-span-4">
            <RecruvoAIChat
              title="Recruvo AI — Comparison"
              candidateId={Number(candidateAId)}
              comparisonCandidateId={Number(candidateBId)}
              candidateName={nameA}
              comparisonCandidateName={nameB}
              initialSuggestions={comparisonSuggestions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
