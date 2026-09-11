import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import {
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Briefcase,
  Users,
  Play,
  ArrowRight,
  Download,
  Trash2,
  FileSpreadsheet,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import RecruvoAIChat from "../components/ai/RecruvoAIChat";
import BentoCard from "../components/ui/BentoCard";
import ScoreIndicator from "../components/ui/ScoreIndicator";
import { exportResultsCSV } from "../api/exports";

export default function Analysis() {
  const navigate = useNavigate();
  const {
    activeJob,
    candidates,
    screenings,
    runBatchScreening,
    runScreening,
    deleteResume,
    theme,
  } = useRecruvo();
  const isGenz = theme === "genz";

  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [deletingCandidateId, setDeletingCandidateId] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // cards | table

  // Map each candidate with its screening result for the active job
  const candidateMatchList = candidates.map((cand, idx) => {
    const c = cand.resume || cand;
    const s = (screenings || []).find((sc) => sc.resume_id === cand.id);
    const scoreVal = s?.score ? Math.round(s.score * 10) : null;

    return {
      index: idx + 1,
      id: cand.id,
      name: c.name || `Candidate #${cand.id}`,
      role: c.experience?.[0]?.role || "Candidate Profile",
      email: c.email || "",
      score: scoreVal,
      reason: s?.reason || "",
      screeningId: s?.id || null,
      rawCandidate: cand,
      rawScreening: s,
    };
  });

  const handleRunAllScreenings = async () => {
    if (!activeJob?.id) {
      setErrorMessage("Please select or upload an Active Job Description first.");
      return;
    }

    if (candidates.length === 0) {
      setErrorMessage("No candidate resumes found. Please upload resumes first.");
      return;
    }

    setIsBatchRunning(true);
    setErrorMessage(null);

    try {
      await runBatchScreening(candidates, (progress) => {
        setScreeningProgress(progress);
      });
      setSuccessToast(`Screening analysis completed for ${candidates.length} candidate(s)!`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Screening process encountered an issue.");
    } finally {
      setIsBatchRunning(false);
      setScreeningProgress(null);
    }
  };

  const handleSingleScreening = async (candidateId) => {
    if (!activeJob?.id) {
      setErrorMessage("Please select an Active Job Description first.");
      return;
    }
    try {
      await runScreening(candidateId, activeJob.id);
      setSuccessToast("Candidate fit evaluated successfully!");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to screen candidate");
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await deleteResume(candidateId);
      setDeletingCandidateId(null);
      setSuccessToast("Candidate deleted from database.");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete candidate");
    }
  };

  const topCandidate = candidateMatchList[0]?.name || "Candidates";
  const chatSuggestions = [
    `Why is ${topCandidate} a good match?`,
    "What are the primary missing skills across candidates?",
    "Suggest top interview questions for this requisition",
    "Compare the top matching candidates",
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header & Quick Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Fit Analysis</h1>
          <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Multi-dimensional screening evaluating technical depth, experience seniority, education, and project relevance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeJob && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                isGenz
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 opacity-60" />
              <span>Target: {activeJob.job_description?.title || "Active Job"}</span>
            </div>
          )}

          {candidateMatchList.length > 0 && (
            <button
              onClick={() => exportResultsCSV({ candidates, screenings, job: activeJob })}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isGenz
                  ? "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/10"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={handleRunAllScreenings}
            disabled={isBatchRunning || candidates.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 shadow-sm ${
              isGenz
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]"
                : "bg-slate-900 text-white hover:bg-black"
            }`}
          >
            {isBatchRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Screening...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run AI Screening ({candidates.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Batch Processing Progress Bar */}
      {isBatchRunning && screeningProgress && (
        <BentoCard className="p-4">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className={isGenz ? "text-indigo-300" : "text-slate-800"}>
              Evaluating candidate {screeningProgress.current} of {screeningProgress.total}:{" "}
              {screeningProgress.candidate?.name || "Candidate"}
            </span>
            <span className="font-mono">
              {Math.round((screeningProgress.current / screeningProgress.total) * 100)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isGenz ? "bg-white/10" : "bg-slate-100"}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isGenz ? "bg-gradient-to-r from-indigo-500 to-emerald-400" : "bg-slate-900"
              }`}
              style={{
                width: `${(screeningProgress.current / screeningProgress.total) * 100}%`,
              }}
            />
          </div>
        </BentoCard>
      )}

      {/* Notifications */}
      {errorMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            isGenz
              ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successToast && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            isGenz
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Candidates List on Left (8 cols) + Contextual AI Chat on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidates Fit Roster */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 opacity-70">
              <Users className="w-4 h-4 text-indigo-500" />
              Evaluated Candidates ({candidateMatchList.length})
            </h2>
            <span className={`text-[11px] ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
              Scores reflect JD criteria alignment
            </span>
          </div>

          {candidateMatchList.length === 0 ? (
            <BentoCard className="p-12 text-center">
              <Users className="w-10 h-10 opacity-30 mx-auto mb-2" />
              <p className="font-bold text-sm">No candidate resumes available</p>
              <p className={`text-xs mt-1 max-w-sm mx-auto ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                Upload candidate resumes on the Upload Resumes page to evaluate compatibility.
              </p>
              <NavLink
                to="/upload-resumes"
                className={`inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl text-xs font-bold ${
                  isGenz
                    ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-500"
                    : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                Upload Resumes
              </NavLink>
            </BentoCard>
          ) : (
            <div className="space-y-3.5">
              {candidateMatchList.map((item) => {
                const s = item.rawScreening;
                const c = item.rawCandidate?.resume || item.rawCandidate;
                const matchingSkills = s?.matching_skills || s?.matchingSkills || [];
                const missingSkills = s?.missing_skills || s?.missingSkills || [];

                return (
                  <BentoCard key={item.id} className="p-5 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Candidate Identity */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                            isGenz
                              ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                              : "bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold tracking-tight">{item.name}</h3>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                isGenz ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"
                              }`}
                            >
                              #{item.id}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isGenz ? "text-indigo-300" : "text-slate-600"}`}>
                            {item.role}
                          </p>
                        </div>
                      </div>

                      {/* Score Indicator or Evaluate Button */}
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        {item.score !== null ? (
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span
                                className={`text-xl font-black font-mono leading-none block ${
                                  item.score >= 80
                                    ? "text-emerald-400"
                                    : item.score >= 60
                                    ? "text-indigo-400"
                                    : "text-amber-400"
                                }`}
                              >
                                {item.score}%
                              </span>
                              <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
                                JD Match
                              </span>
                            </div>
                            <ScoreIndicator score={item.score} size="md" showRing={true} label="" />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSingleScreening(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              isGenz
                                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                                : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                            }`}
                          >
                            Evaluate Fit
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Skills & Summary Preview */}
                    {s && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                        {s.reason && (
                          <p className={`text-xs leading-relaxed line-clamp-2 ${isGenz ? "text-slate-300" : "text-slate-600"}`}>
                            {s.reason}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {matchingSkills.slice(0, 4).map((sk, skIdx) => (
                            <span
                              key={skIdx}
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                                isGenz
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
                              }`}
                            >
                              ✓ {sk}
                            </span>
                          ))}
                          {missingSkills.slice(0, 2).map((sk, skIdx) => (
                            <span
                              key={skIdx}
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${
                                isGenz
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                  : "bg-amber-50 border-amber-200 text-amber-800"
                              }`}
                            >
                              Gap: {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <button
                        onClick={() => setDeletingCandidateId(item.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isGenz ? "text-slate-400 hover:text-rose-400" : "text-slate-400 hover:text-rose-600"
                        }`}
                        title="Delete candidate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <NavLink
                          to={`/analysis/${item.id}`}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isGenz
                              ? "bg-white/[0.05] hover:bg-white/10 text-slate-200 border border-white/10"
                              : "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Analysis</span>
                        </NavLink>
                      </div>
                    </div>
                  </BentoCard>
                );
              })}
            </div>
          )}

          {/* Quick Comparison Bar Link */}
          {candidateMatchList.length >= 2 && (
            <div className="pt-2 flex items-center justify-between text-xs font-semibold opacity-80">
              <span>Looking to choose between top candidates?</span>
              <NavLink
                to="/compare"
                className={`font-bold flex items-center gap-1 hover:underline ${
                  isGenz ? "text-indigo-400" : "text-slate-900"
                }`}
              >
                <span>Compare Two Candidates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          )}
        </div>

        {/* Right Contextual AI Chat Panel (Matching Paper Prototype Wireframe 5) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <RecruvoAIChat
            title="Recruvo AI"
            candidateName={topCandidate}
            initialSuggestions={chatSuggestions}
          />
        </div>
      </div>

      {/* DELETE CANDIDATE CONFIRMATION MODAL */}
      {deletingCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl space-y-4 ${
              isGenz ? "bg-[#141726] border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Delete Candidate Profile</h3>
              <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                Are you sure you want to delete candidate #{deletingCandidateId}? All associated screening scores will also be removed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingCandidateId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-semibold hover:opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCandidate(deletingCandidateId)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
