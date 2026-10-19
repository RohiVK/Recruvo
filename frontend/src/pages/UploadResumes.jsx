import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import {
  UploadCloud,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  Briefcase,
  X,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";

export default function UploadResumes() {
  const navigate = useNavigate();
  const { uploadResumesBatch, candidates, deleteResume, activeJob, theme, isVibe } = useRecruvo();
  const isGenz = isVibe;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deletingCandidateId, setDeletingCandidateId] = useState(null);

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      setErrorMessage(null);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select at least one resume file.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessToast(null);

    try {
      const results = await uploadResumesBatch(selectedFiles, (progress) => {
        setUploadProgress(progress);
      });

      const successCount = results.filter((r) => !r.ignored && !r.error).length;
      setSuccessToast(`Successfully parsed and loaded ${successCount} candidate profile(s)!`);
      setSelectedFiles([]);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to process resumes.");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await deleteResume(id);
      setDeletingCandidateId(null);
      setSuccessToast(`Candidate #${id} deleted.`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete candidate");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Resume Processing</h1>
          <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Batch upload candidate resumes (PDF, DOCX, TXT). AI automatically extracts contact details, skills, work experience, and educational background.
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
            <span>Target Requisition: {activeJob.job_description?.title || "Active JD"}</span>
          </div>
        )}
      </div>

      {/* Upload Zone Card */}
      <BentoCard className="p-6 md:p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
            isDragOver
              ? isGenz
                ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_25px_rgba(99,102,241,0.3)]"
                : "border-slate-900 bg-slate-50"
              : isGenz
              ? "border-white/10 hover:border-indigo-500/40 bg-white/[0.02]"
              : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            id="multi-resume-input"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelection}
            className="hidden"
          />
          <label htmlFor="multi-resume-input" className="cursor-pointer block">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
                isGenz
                  ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}
            >
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold mb-1">
              Drag and drop candidate resumes
            </h3>
            <p className={`text-xs max-w-sm mx-auto mb-4 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
              Multi-file batch processing supported. Select multiple PDF, DOCX, or TXT documents.
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isGenz
                  ? "bg-white/[0.05] border-white/10 text-slate-200 hover:bg-white/10"
                  : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
              }`}
            >
              Select Resume Files
            </span>
          </label>
        </div>

        {/* Selected Staged Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={isGenz ? "text-slate-300" : "text-slate-700"}>
                Staged for Extraction ({selectedFiles.length} files)
              </span>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-rose-500 hover:underline text-[11px]"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    isGenz
                      ? "bg-[#161828] border-white/10 text-slate-200"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate font-medium">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeSelectedFile(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && uploadProgress && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className={isGenz ? "text-indigo-300" : "text-slate-700"}>
                Processing {uploadProgress.current} of {uploadProgress.total}: {uploadProgress.filename}
              </span>
              <span className="font-mono">
                {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isGenz ? "bg-white/10" : "bg-slate-100"}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isGenz ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-slate-900"
                }`}
                style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Error / Success Toast */}
        {errorMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
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
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              isGenz
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => navigate("/analysis")}
              className="font-bold underline text-xs ml-2 flex items-center gap-1 hover:opacity-80"
            >
              <span>View Fit & Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUploadAll}
            disabled={isUploading || selectedFiles.length === 0}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-40 shadow-sm ${
              isGenz
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]"
                : "bg-slate-900 text-white hover:bg-black"
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Resumes...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Parse {selectedFiles.length} Resume(s)</span>
              </>
            )}
          </button>
        </div>
      </BentoCard>

      {/* Uploaded Candidate Profiles Roster */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Uploaded Candidates Roster ({candidates.length})
          </h2>
          <span className={`text-xs ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Loaded in PostgreSQL persistence
          </span>
        </div>

        {candidates.length === 0 ? (
          <BentoCard className="p-8 text-center">
            <Users className="w-8 h-8 opacity-40 mx-auto mb-2" />
            <p className="font-bold text-sm">No candidate resumes uploaded yet</p>
            <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
              Drop resumes in the box above to extract profiles and run fit evaluations.
            </p>
          </BentoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((cand) => {
              const c = cand.resume || cand;
              const name = c.name || `Candidate #${cand.id}`;
              const role = c.experience?.[0]?.role || "Candidate Profile";
              const skills = c.skills || [];

              return (
                <BentoCard key={cand.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                          isGenz
                            ? "bg-white/[0.04] text-indigo-300 border-white/10"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        #{cand.id}
                      </span>
                      <button
                        onClick={() => setDeletingCandidateId(cand.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isGenz
                            ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                            : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        title="Delete Candidate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold tracking-tight">{name}</h3>
                    <p className={`text-xs mt-0.5 ${isGenz ? "text-indigo-300" : "text-slate-600"}`}>
                      {role}
                    </p>

                    {c.email && (
                      <p className={`text-[11px] mt-1 font-mono opacity-70`}>{c.email}</p>
                    )}

                    {/* Skill Pills preview */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {skills.slice(0, 4).map((sk, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            isGenz
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                              : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          {sk}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="text-[10px] opacity-60 self-center">
                          +{skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <NavLink
                      to={`/analysis/${cand.id}`}
                      className={`text-xs font-bold flex items-center gap-1 hover:underline ${
                        isGenz ? "text-indigo-400" : "text-slate-900"
                      }`}
                    >
                      <span>Full Analysis</span>
                      <ArrowRight className="w-3 h-3" />
                    </NavLink>

                    <button
                      onClick={() => navigate(`/analysis/${cand.id}`)}
                      className={`text-xs font-bold py-1 px-3 rounded-lg border transition-all ${
                        isGenz
                          ? "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/10"
                          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      Inspect Profile
                    </button>
                  </div>
                </BentoCard>
              );
            })}
          </div>
        )}
      </div>

      {/* DELETE CANDIDATE MODAL */}
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
