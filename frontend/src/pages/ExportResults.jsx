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
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";
import {
  exportSingleCandidatePDF,
  exportComparisonPDF,
  exportResultsCSV,
} from "../api/exports";

export default function ExportResults() {
  const { candidates, screenings, activeJob, theme, isVibe } = useRecruvo();
  const isGenz = isVibe;

  // 1. Single Candidate State
  const [selectedSingleId, setSelectedSingleId] = useState(
    candidates.length > 0 ? String(candidates[0].id) : ""
  );

  // 2. Comparison Candidates State
  const [selectedCompAId, setSelectedCompAId] = useState(
    candidates.length > 0 ? String(candidates[0].id) : ""
  );
  const [selectedCompBId, setSelectedCompBId] = useState(
    candidates.length > 1
      ? String(candidates[1].id)
      : candidates.length > 0
      ? String(candidates[0].id)
      : ""
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
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Export Recruitment Reports</h1>
          <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Download candidate evaluations in PDF reports and CSV datasets for offline recruiter review.
          </p>
        </div>

        {activeJob && (
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
              isGenz
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 opacity-60" />
            <span>Target: {activeJob.job_description?.title || "Active Job"}</span>
          </div>
        )}
      </div>

      {successToast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
            isGenz
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 3 Export Cards */}
      <div className="space-y-4">
        {/* CARD 1: Single Candidate Report (PDF) */}
        <BentoCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#263238]">Single Candidate Dossier (PDF)</h2>
              <p className="text-xs mt-1 leading-relaxed max-w-xl text-[#717171]">
                Complete candidate assessment including overall match score, 5-pillar scores, matching skills, flagged gaps, executive summary, and tailored interview questions.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="w-56">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#717171] mb-1">
                Select Candidate
              </label>
              <select
                value={selectedSingleId}
                onChange={(e) => setSelectedSingleId(e.target.value)}
                disabled={candidates.length === 0}
                className="w-full rounded-md px-3 py-2 text-xs font-semibold focus:outline-none border bg-white border-[#CFD8DC] text-[#263238] focus:border-[#4CAF4F]"
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 sm:self-end bg-[#4CAF4F] hover:bg-[#43A047] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </BentoCard>

        {/* CARD 2: Comparison Report (PDF) */}
        <BentoCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#263238]">Comparison Evaluation Matrix (PDF)</h2>
              <p className="text-xs mt-1 leading-relaxed max-w-xl text-[#717171]">
                Side-by-side comparison report for two selected candidates formatted with side-by-side metrics, trade-offs, and hiring recommendations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedCompAId}
                onChange={(e) => setSelectedCompAId(e.target.value)}
                disabled={candidates.length === 0}
                className="w-36 rounded-md px-2.5 py-2 text-xs font-semibold focus:outline-none border bg-white border-[#CFD8DC] text-[#263238] focus:border-[#4CAF4F]"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.resume?.name || `Candidate #${c.id}`}
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold text-[#717171]">vs</span>

              <select
                value={selectedCompBId}
                onChange={(e) => setSelectedCompBId(e.target.value)}
                disabled={candidates.length < 2}
                className="w-36 rounded-md px-2.5 py-2 text-xs font-semibold focus:outline-none border bg-white border-[#CFD8DC] text-[#263238] focus:border-[#4CAF4F]"
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 bg-[#4CAF4F] hover:bg-[#43A047] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </BentoCard>

        {/* CARD 3: All Results (CSV) */}
        <BentoCard className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#263238]">Complete Candidate Dataset (CSV)</h2>
              <p className="text-xs mt-1 leading-relaxed max-w-xl text-[#717171]">
                Export all candidates in CSV format including match percentages, category scores, verified skills, and summary feedback.
              </p>

              {/* Radio Export Options */}
              <div className="mt-4 space-y-2 text-xs text-[#263238]">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="csvOption"
                    checked={csvOption === "all"}
                    onChange={() => setCsvOption("all")}
                    className="accent-[#4CAF4F]"
                  />
                  <span>All Candidates ({candidates.length})</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="csvOption"
                      checked={csvOption === "top"}
                      onChange={() => setCsvOption("top")}
                      className="accent-[#4CAF4F]"
                    />
                    <span>Top N Candidates</span>
                  </label>
                  {csvOption === "top" && (
                    <select
                      value={topNCount}
                      onChange={(e) => setTopNCount(Number(e.target.value))}
                      className="rounded-md px-2 py-0.5 text-xs font-semibold border bg-white border-[#CFD8DC] text-[#263238]"
                    >
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  )}
                </div>

                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="csvOption"
                    checked={csvOption === "custom"}
                    onChange={() => setCsvOption("custom")}
                    className="accent-[#4CAF4F]"
                  />
                  <span>Custom Selection</span>
                </label>

                {csvOption === "custom" && (
                  <div className="mt-2 p-3 rounded-lg border space-y-1.5 max-h-36 overflow-y-auto bg-white border-[#ECEFF1]">
                    {candidates.map((cand) => (
                      <label
                        key={cand.id}
                        className="flex items-center gap-2 text-xs cursor-pointer text-[#4D5E80]"
                      >
                        <input
                          type="checkbox"
                          checked={customSelectedIds.includes(cand.id)}
                          onChange={() => handleToggleCustomId(cand.id)}
                          className="accent-[#4CAF4F] rounded"
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 bg-[#4CAF4F] hover:bg-[#43A047] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </BentoCard>
      </div>

      {/* Info Callout */}
      <div
        className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
          isGenz ? "bg-white/[0.02] border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>Reports include AI-generated insights, key skill analysis, gap breakdowns, and tailored interview questions.</span>
      </div>
    </div>
  );
}
