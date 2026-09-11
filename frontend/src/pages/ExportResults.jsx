import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Layers,
  Info,
  Table,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import {
  exportSingleCandidatePDF,
  exportComparisonPDF,
  exportResultsCSV,
} from "../api/exports";

export default function ExportResults() {
  const { candidates, screenings, activeJob } = useRecruvo();

  // 1. Single Candidate State
  const [selectedSingleId, setSelectedSingleId] = useState(
    candidates.length > 0 ? String(candidates[0].id) : ""
  );

  // 2. Comparison Candidates State
  const [selectedCompAId, setSelectedCompAId] = useState(
    candidates.length > 0 ? String(candidates[0].id) : ""
  );
  const [selectedCompBId, setSelectedCompBId] = useState(
    candidates.length > 1 ? String(candidates[1].id) : (candidates.length > 0 ? String(candidates[0].id) : "")
  );

  // 3. CSV Options State
  const [csvOption, setCsvOption] = useState("all"); // "all" | "top" | "custom"
  const [topNCount, setTopNCount] = useState(10);
  const [customSelectedIds, setCustomSelectedIds] = useState([]);
  const [successToast, setSuccessToast] = useState(null);

  // Handle Single PDF Export
  const handleSinglePDF = () => {
    const cand = candidates.find((c) => String(c.id) === String(selectedSingleId));
    if (!cand) return;
    const sc = (screenings || []).find((s) => String(s.resume_id) === String(cand.id)) || {};
    exportSingleCandidatePDF({
      candidate: cand,
      screening: sc,
      job: activeJob,
    });
    setSuccessToast(`Downloaded single candidate PDF for ${cand.resume?.name || "Candidate"}`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Handle Comparison PDF Export
  const handleComparisonPDF = () => {
    const candA = candidates.find((c) => String(c.id) === String(selectedCompAId));
    const candB = candidates.find((c) => String(c.id) === String(selectedCompBId));
    if (!candA || !candB) return;
    const scA = (screenings || []).find((s) => String(s.resume_id) === String(candA.id)) || {};
    const scB = (screenings || []).find((s) => String(s.resume_id) === String(candB.id)) || {};

    exportComparisonPDF({
      candidateA: candA,
      screeningA: scA,
      candidateB: candB,
      screeningB: scB,
      job: activeJob,
    });
    setSuccessToast(`Downloaded comparison PDF report`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Handle CSV Export
  const handleCSVExport = () => {
    exportResultsCSV({
      candidates,
      screenings,
      job: activeJob,
      filterType: csvOption,
      topN: topNCount,
      selectedIds: customSelectedIds,
    });
    setSuccessToast(`Downloaded analysis results CSV`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleToggleCustomId = (id) => {
    setCustomSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header (Matching Wireframe 2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Export Results</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Download reports for individual candidates or comparisons.
          </p>
        </div>

        {activeJob && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span>Target: {activeJob.job_description?.title || "Active Job"}</span>
          </div>
        )}
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 3 Export Cards (Matching Wireframe 2) */}
      <div className="space-y-5">
        {/* CARD 1: Single Candidate Report (PDF) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-300 transition-all">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Single Candidate Report (PDF)
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xl">
                Detailed analysis of a single candidate including skills, match score, experience, strengths,
                weaknesses, and recommendations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="w-56">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Select Candidate
              </label>
              <select
                value={selectedSingleId}
                onChange={(e) => setSelectedSingleId(e.target.value)}
                disabled={candidates.length === 0}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSinglePDF}
              disabled={candidates.length === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-colors disabled:opacity-40 sm:self-end"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Comparison Report (PDF) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-300 transition-all">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Comparison Report (PDF)
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xl">
                Side-by-side comparison of selected candidates with detailed insights, match scores, and
                recommendations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedCompAId}
                onChange={(e) => setSelectedCompAId(e.target.value)}
                disabled={candidates.length === 0}
                className="w-36 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`}
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold text-gray-400">vs</span>

              <select
                value={selectedCompBId}
                onChange={(e) => setSelectedCompBId(e.target.value)}
                disabled={candidates.length < 2}
                className="w-36 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleComparisonPDF}
              disabled={candidates.length < 2}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* CARD 3: All Results (CSV) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-gray-300 transition-all">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 shrink-0">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                All Results (CSV)
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xl">
                Export all analysis results in CSV format for further use (includes match scores, key skills,
                strengths, weaknesses, and recommendations).
              </p>

              {/* Radio Export Options */}
              <div className="mt-4 space-y-2 text-xs">
                <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="csvOption"
                    checked={csvOption === "all"}
                    onChange={() => setCsvOption("all")}
                    className="accent-gray-900"
                  />
                  <span>All Candidates ({candidates.length})</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="csvOption"
                      checked={csvOption === "top"}
                      onChange={() => setCsvOption("top")}
                      className="accent-gray-900"
                    />
                    <span>Top N Candidates</span>
                  </label>
                  {csvOption === "top" && (
                    <select
                      value={topNCount}
                      onChange={(e) => setTopNCount(Number(e.target.value))}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-800"
                    >
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  )}
                </div>

                <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="csvOption"
                    checked={csvOption === "custom"}
                    onChange={() => setCsvOption("custom")}
                    className="accent-gray-900"
                  />
                  <span>Custom Selection</span>
                </label>

                {csvOption === "custom" && (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
                    {candidates.map((cand) => (
                      <label
                        key={cand.id}
                        className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={customSelectedIds.includes(cand.id)}
                          onChange={() => handleToggleCustomId(cand.id)}
                          className="accent-gray-900 rounded"
                        />
                        <span className="truncate">{cand.resume?.name || `Candidate #${cand.id}`}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 self-end md:self-center">
            <button
              onClick={handleCSVExport}
              disabled={candidates.length === 0}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Callout Box (Matching Wireframe 2) */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3 text-xs text-gray-600">
        <Info className="w-4 h-4 text-gray-500 shrink-0" />
        <span>Reports include AI-generated insights, key skill analysis, and hiring recommendations.</span>
      </div>
    </div>
  );
}
