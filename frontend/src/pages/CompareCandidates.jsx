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
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import RecruvoAIChat from "../components/ai/RecruvoAIChat";
import { exportComparisonPDF } from "../api/exports";

export default function CompareCandidates() {
  const { candidates, screenings, activeJob } = useRecruvo();

  const [candidateAId, setCandidateAId] = useState(
    candidates.length > 0 ? String(candidates[0].id) : ""
  );
  const [candidateBId, setCandidateBId] = useState(
    candidates.length > 1 ? String(candidates[1].id) : (candidates.length > 0 ? String(candidates[0].id) : "")
  );

  // Sync state if candidates load after initial render
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Compare Candidates</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Select two candidates to compare their skills, experience, match scores, and key tradeoffs.
          </p>
        </div>

        {activeJob && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span>Target Role: {activeJob.job_description?.title || "Active Job"}</span>
          </div>
        )}
      </div>

      {/* Candidate Selectors Card (Matching Wireframe 4) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-11 items-center gap-3">
            {/* Candidate A Selector */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Candidate A
              </label>
              <select
                value={candidateAId}
                onChange={(e) => setCandidateAId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`} ({c.resume?.experience?.[0]?.role || "Candidate"})
                  </option>
                ))}
              </select>
            </div>

            {/* VS Divider */}
            <div className="sm:col-span-1 text-center font-bold text-xs text-gray-400">
              VS
            </div>

            {/* Candidate B Selector */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Candidate B
              </label>
              <select
                value={candidateBId}
                onChange={(e) => setCandidateBId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`} ({c.resume?.experience?.[0]?.role || "Candidate"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-center">
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {candidates.length < 2 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-xs">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-gray-700 text-sm">Need at least 2 candidates to compare</p>
          <p className="text-xs text-gray-400 mt-1">
            Please upload more resumes on the Upload Resumes page.
          </p>
        </div>
      ) : (
        /* Main Grid: Comparison Table on Left (8 cols) + Contextual Recruvo AI on Right (4 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Side-by-Side Comparison Matrix (Matching Wireframe 4) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-900" />
                Side-by-Side Evaluation Matrix
              </h2>
              <span className="text-[11px] text-gray-400">Direct JD Alignment Comparison</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold bg-gray-50/40">
                    <th className="py-3 px-4 w-40 text-gray-400 uppercase text-[11px]">Criteria</th>
                    <th className="py-3 px-4 text-gray-900">{nameA}</th>
                    <th className="py-3 px-4 text-gray-900">{nameB}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                  {/* Overall Match */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700">Overall Match</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-900 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${scoreA}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-gray-900 w-9 text-right">
                          {scoreA}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-900 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${scoreB}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-gray-900 w-9 text-right">
                          {scoreB}%
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Technical Skills */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700">Technical Skills</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-700 h-2.5 rounded-full"
                            style={{ width: `${techA}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-gray-800 w-9 text-right">
                          {techA}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-700 h-2.5 rounded-full"
                            style={{ width: `${techB}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-gray-800 w-9 text-right">
                          {techB}%
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Experience */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700">Experience</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-700 h-2.5 rounded-full"
                            style={{ width: `${expA}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-gray-800 w-9 text-right">
                          {expA}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-700 h-2.5 rounded-full"
                            style={{ width: `${expB}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-gray-800 w-9 text-right">
                          {expB}%
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Education */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700">Education</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-700 h-2.5 rounded-full"
                            style={{ width: `${eduA}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-gray-800 w-9 text-right">
                          {eduA}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gray-700 h-2.5 rounded-full"
                            style={{ width: `${eduB}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-gray-800 w-9 text-right">
                          {eduB}%
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Key Strengths (Matching Wireframe 4) */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700 align-top">Key Strengths</td>
                    <td className="py-3.5 px-4 align-top">
                      <ul className="space-y-1 text-gray-700">
                        {(screeningA.strengths || []).slice(0, 3).map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                        {(!screeningA.strengths || screeningA.strengths.length === 0) && (
                          <li className="text-gray-400 italic">Strong technical background</li>
                        )}
                      </ul>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <ul className="space-y-1 text-gray-700">
                        {(screeningB.strengths || []).slice(0, 3).map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                        {(!screeningB.strengths || screeningB.strengths.length === 0) && (
                          <li className="text-gray-400 italic">Solid experience record</li>
                        )}
                      </ul>
                    </td>
                  </tr>

                  {/* Matching Skills */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700 align-top">Matching Skills</td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {(screeningA.matchingSkills || []).slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {(screeningB.matchingSkills || []).slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* Missing Skills */}
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-700 align-top">Missing Skills</td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {(screeningA.missingSkills || []).slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {(screeningB.missingSkills || []).slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200"
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
            <div className="p-5 bg-gray-50 border-t border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gray-900" />
                AI Comparison Summary & Trade-offs
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {nameA} achieved an overall match of {scoreA}% compared to {nameB}'s {scoreB}%.{" "}
                {scoreA >= scoreB
                  ? `${nameA} exhibits higher alignment in core technical requirements and relevant projects.`
                  : `${nameB} exhibits higher alignment in core technical requirements and relevant projects.`}{" "}
                Use the contextual Recruvo AI chat on the right to probe specific tradeoffs or request tailored interview questions for both candidates.
              </p>
            </div>
          </div>

          {/* Right Side: Contextual Recruvo AI on Comparison (Matching Wireframe 4) */}
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
