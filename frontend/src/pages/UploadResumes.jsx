import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Users,
  Briefcase,
  Layers,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";

export default function UploadResumes() {
  const navigate = useNavigate();
  const { uploadResumesBatch, deleteResume, candidates, activeJob } = useRecruvo();

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [generalError, setGeneralError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [deletingCandidateId, setDeletingCandidateId] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        rawFile: file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        status: "pending", // pending | success | error
        error: null,
      }));
      setFilesToUpload((prev) => [...prev, ...newFiles]);
      setGeneralError(null);
    }
  };

  const handleRemoveFile = (fileId) => {
    setFilesToUpload((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleUploadBatch = async () => {
    if (filesToUpload.length === 0 || isUploading) return;

    setIsUploading(true);
    setGeneralError(null);

    const rawFiles = filesToUpload.map((f) => f.rawFile);

    try {
      const results = await uploadResumesBatch(rawFiles);
      setUploadResults(results);

      // Update individual file status based on API results
      setFilesToUpload((prev) =>
        prev.map((item) => {
          const matched = results.find((r) => r.filename === item.name);
          if (!matched) return item;
          if (matched.ignored || matched.error) {
            return {
              ...item,
              status: "error",
              error: matched.reason || matched.error || "Document rejected by parser",
            };
          }
          return {
            ...item,
            status: "success",
            candidateName: matched.resume?.name || "Extracted Profile",
          };
        })
      );
      setSuccessToast(`Successfully parsed and saved ${rawFiles.length} candidate resume(s)!`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setGeneralError(err.message || "Failed to process resume batch.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCandidate = async (candId) => {
    try {
      await deleteResume(candId);
      setDeletingCandidateId(null);
      setSuccessToast("Candidate resume deleted successfully.");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setGeneralError(err.message || "Failed to delete candidate resume.");
    }
  };

  const allSuccessCount = filesToUpload.filter((f) => f.status === "success").length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Upload Candidate Resumes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Upload candidate resumes to extract structured profile information and run AI matching against your active JD.
          </p>
        </div>

        {activeJob && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 shrink-0">
            <Briefcase className="w-3.5 h-3.5 text-gray-600" />
            <span>Target JD: {activeJob.job_description?.title || "Active Job"}</span>
          </div>
        )}
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Drag & Drop Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xs">
        <div className="border-2 border-dashed border-gray-300 hover:border-gray-900/60 rounded-xl p-10 text-center transition-all bg-gray-50/50">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center mx-auto mb-4 text-gray-800">
            <Upload className="w-7 h-7 text-gray-800" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Drag and drop resume files here</h3>
          <p className="text-xs text-gray-500 mb-5">
            Supported formats: PDF, DOCX, TXT. You can upload multiple candidate resumes at once.
          </p>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black cursor-pointer shadow-xs transition-colors">
            <FileText className="w-4 h-4" />
            <span>Select Resume Files</span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Selected Files List */}
        {filesToUpload.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Selected Files Queue ({filesToUpload.length})
              </h4>
              <button
                onClick={() => setFilesToUpload([])}
                disabled={isUploading}
                className="text-xs text-gray-400 hover:text-gray-600 font-medium"
              >
                Clear Queue
              </button>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {filesToUpload.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400">{item.size}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-3">
                    {item.status === "pending" && (
                      <span className="text-[11px] text-gray-400 font-medium">Ready</span>
                    )}

                    {item.status === "success" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Parsed ({item.candidateName})
                      </span>
                    )}

                    {item.status === "error" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        <AlertCircle className="w-3 h-3" />
                        {item.error || "Failed"}
                      </span>
                    )}

                    {!isUploading && item.status !== "success" && (
                      <button
                        onClick={() => handleRemoveFile(item.id)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                {allSuccessCount > 0
                  ? `✓ ${allSuccessCount} candidate(s) successfully parsed with Gemini.`
                  : "Click extract to process all files."}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUploadBatch}
                  disabled={filesToUpload.length === 0 || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-semibold shadow-xs transition-all disabled:opacity-40"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Extracting Profiles with Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Extract Profiles
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/analysis")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-all"
                >
                  <span>Analyze Resumes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {generalError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Already Uploaded Candidates in DB */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-700" />
              Existing Candidate Database ({candidates.length})
            </h3>
            <p className="text-xs text-gray-400">
              Profiles stored and ready for matching against any Job Description
            </p>
          </div>

          {candidates.length > 0 && (
            <button
              onClick={() => navigate("/analysis")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
            >
              <span>Go to Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No candidates uploaded yet. Upload resumes above to populate candidate profiles.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {candidates.map((cand) => {
              const c = cand.resume || cand;
              return (
                <div
                  key={cand.id}
                  className="p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl hover:bg-white hover:border-gray-300 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 overflow-hidden flex-1">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {(c.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{c.name || "Unnamed Candidate"}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {c.experience?.[0]?.role || "Candidate Profile"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(c.skills || []).slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-600 truncate max-w-[90px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingCandidateId(cand.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 opacity-80 group-hover:opacity-100"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DELETE CANDIDATE CONFIRMATION MODAL */}
      {deletingCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Delete Candidate Resume</h3>
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
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
