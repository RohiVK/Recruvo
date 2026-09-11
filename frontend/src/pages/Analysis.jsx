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
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import RecruvoAIChat from "../components/ai/RecruvoAIChat";
import { exportResultsCSV, exportSingleCandidatePDF } from "../api/exports";

export default function Analysis() {
  const navigate = useNavigate();
  const { activeJob, candidates, screenings, runBatchScreening, runScreening, deleteResume } = useRecruvo();

  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [deletingCandidateId, setDeletingCandidateId] = useState(null);

  // Map each candidate with its screening result for the active job
  const candidateMatchList = candidates.map((cand, idx) => {
    const c = cand.resume || cand;
    const s = (screenings || []).find((sc) => sc.resume_id === cand.id);
    const scoreVal = s?.score ? Math.round(s.score * 10) : null;

    return {
      index: idx + 1,
      id: cand.id,
      name: c.name || `Candidate #${cand.id}`,
      role: c.experience?.[0]?.role || "Software Engineer",
      email: c.email || "",
      score: scoreVal,
      reason: s?.reason || "",
      screeningId: s?.id || null,
      rawCandidate: cand,
      rawScreening: s,
    };
  });

  // Sort by score descending if available, or keep original order
  const sortedMatches = [...candidateMatchList].sort((a, b) => (b.score || 0) - (a.score || 0));

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
      setSuccessToast("Candidate resume deleted successfully.");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete candidate resume");
    }
  };

  const handleQuickCSVExport = () => {
    if (candidates.length === 0) {
      setErrorMessage("No candidates to export.");
      return;
    }
    exportResultsCSV({
      candidates,
      screenings,
      job: activeJob,
      filterType: "all",
    });
    setSuccessToast("Downloaded candidates analysis CSV!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const topCandidate = sortedMatches[0]?.name;
  const secondCandidate = sortedMatches[1]?.name;

  const chatSuggestions = [
    topCandidate ? `Why is ${topCandidate} a good match?` : "Why is Rahul a good match?",
    topCandidate && secondCandidate
      ? `Compare ${topCandidate} and ${secondCandidate}`
      : "Compare top matching candidates",
    "Suggest interview questions for this role",
    "What are the most common skill gaps among candidates?",
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analysis Results</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here are the best matching candidates for your job description.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeJob ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs">
              <Briefcase className="w-3.5 h-3.5 text-gray-500" />
              <span>Job: {activeJob.job_description?.title || "Active Role"}</span>
            </div>
          ) : (
            <NavLink
              to="/upload-jd"
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              + Select / Upload Job Description
            </NavLink>
          )}

          {candidates.length > 0 && (
            <button
              onClick={handleQuickCSVExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
              title="Download results as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={handleRunAllScreenings}
            disabled={isBatchRunning || candidates.length === 0 || !activeJob}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all shadow-xs disabled:opacity-40"
          >
            {isBatchRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Screening ({screeningProgress ? `${screeningProgress.current}/${screeningProgress.total}` : "..."})</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run AI Screening ({candidates.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Progress State Banner when screening is running */}
      {isBatchRunning && screeningProgress && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-2">
            <span>
              Screening candidate: {screeningProgress.candidate?.resume?.name || "Candidate"} (
              {screeningProgress.current} of {screeningProgress.total})
            </span>
            <span className="text-gray-500">
              {Math.round((screeningProgress.current / screeningProgress.total) * 100)}%
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-3">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(screeningProgress.current / screeningProgress.total) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resume uploaded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profile extracted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-gray-900 animate-spin" />
              <span>Matching with JD</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span>Generating candidate insights</span>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-red-700 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Table on Left + Contextual Recruvo AI on Right (Matching Wireframe 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Analysis Results Table (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 bg-gray-50/60 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-900" />
                Evaluated Candidates ({sortedMatches.length})
              </h2>
              <span className="text-[11px] text-gray-400">Scores reflect JD alignment</span>
            </div>

            {sortedMatches.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-gray-600">No candidates available</p>
                <p className="mt-1">Upload candidate resumes to see screening match scores.</p>
                <NavLink
                  to="/upload-resumes"
                  className="mt-3 inline-block font-bold text-gray-900 underline"
                >
                  Upload Resumes Now →
                </NavLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/40">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4 w-44">Match Score</th>
                      <th className="py-3 px-4 w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                    {sortedMatches.map((item) => {
                      const hasScore = item.score !== null;
                      const scoreColor =
                        item.score >= 80
                          ? "bg-emerald-600"
                          : item.score >= 60
                          ? "bg-gray-800"
                          : "bg-amber-600";

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/analysis/${item.id}`)}
                        >
                          {/* Number */}
                          <td className="py-3.5 px-4 font-mono text-gray-400 text-center text-[11px]">
                            {item.index}
                          </td>

                          {/* Candidate Avatar & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs flex items-center justify-center shrink-0">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 group-hover:text-black transition-colors truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate">{item.role}</p>
                              </div>
                            </div>
                          </td>

                          {/* Match Score Progress Bar */}
                          <td className="py-3.5 px-4">
                            {hasScore ? (
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200/60">
                                  <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${scoreColor}`}
                                    style={{ width: `${Math.min(item.score, 100)}%` }}
                                  />
                                </div>
                                <span className="font-bold text-xs text-gray-900 w-9 text-right">
                                  {item.score}%
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSingleScreening(item.id);
                                }}
                                className="text-[11px] text-gray-500 hover:text-gray-900 font-semibold bg-gray-100 px-2 py-0.5 rounded border border-gray-200"
                              >
                                Evaluate Fit
                              </button>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/analysis/${item.id}`);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-semibold text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-2xs"
                              >
                                View
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingCandidateId(item.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Candidate Resume"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>Click any candidate row to view detailed breakdown & recommendations.</span>
            <div className="flex items-center gap-3">
              <NavLink
                to="/export"
                className="font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF/CSV</span>
              </NavLink>
              <span>•</span>
              <NavLink
                to="/compare"
                className="font-bold text-gray-800 hover:underline flex items-center gap-1"
              >
                <span>Compare Two Candidates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Side: Contextual Recruvo AI Assistant (Matching Wireframe 5) */}
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Delete Candidate</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete candidate #{deletingCandidateId}? All associated screening scores will also be removed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCandidateId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCandidate(deletingCandidateId)}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
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
