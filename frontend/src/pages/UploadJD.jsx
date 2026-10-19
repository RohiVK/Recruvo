import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Briefcase,
  MapPin,
  Clock,
  Layers,
  Edit3,
  Trash2,
  X,
  ArrowRight,
  Plus,
  Zap,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";

export default function UploadJD() {
  const navigate = useNavigate();
  const { uploadJobText, uploadJobFile, activeJob, jobs, setActiveJob, updateJob, deleteJob, theme, isVibe } = useRecruvo();
  const isGenz = isVibe;

  const [inputMode, setInputMode] = useState("upload"); // upload | paste
  const [jdText, setJdText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Edit JD Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editReqSkills, setEditReqSkills] = useState("");
  const [editPrefSkills, setEditPrefSkills] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete JD Modal State
  const [deletingJobId, setDeletingJobId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleProcess = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsProcessing(true);

    try {
      let createdJob = null;
      if (inputMode === "paste") {
        if (!jdText.trim()) {
          throw new Error("Please paste Job Description text first.");
        }
        createdJob = await uploadJobText(jdText);
      } else {
        if (!selectedFile) {
          throw new Error("Please choose or drop a Job Description file (PDF, DOCX, TXT).");
        }
        createdJob = await uploadJobFile(selectedFile);
      }

      setSuccessMessage(`Job Description successfully parsed and activated!`);
      setSelectedFile(null);
      setJdText("");
    } catch (err) {
      setErrorMessage(err.message || "Failed to process Job Description");
    } finally {
      setIsProcessing(false);
    }
  };

  const openEditModal = (job) => {
    const jd = job.job_description || {};
    setEditingJob(job);
    setEditTitle(jd.title || "");
    setEditCompany(jd.company || "");
    setEditLocation(jd.location || "");
    setEditExperience(jd.experience_required || "");
    setEditReqSkills(Array.isArray(jd.required_skills) ? jd.required_skills.join(", ") : "");
    setEditPrefSkills(Array.isArray(jd.preferred_skills) ? jd.preferred_skills.join(", ") : "");
    setEditSummary(jd.summary || "");
  };

  const handleSaveEdit = async () => {
    if (!editingJob) return;
    setIsUpdating(true);
    try {
      const updatedJd = {
        title: editTitle.trim(),
        company: editCompany.trim(),
        location: editLocation.trim(),
        experience_required: editExperience.trim(),
        required_skills: editReqSkills.split(",").map((s) => s.trim()).filter(Boolean),
        preferred_skills: editPrefSkills.split(",").map((s) => s.trim()).filter(Boolean),
        summary: editSummary.trim(),
        responsibilities: editingJob.job_description?.responsibilities || [],
      };
      await updateJob(editingJob.id, updatedJd);
      setEditingJob(null);
      setSuccessMessage("Job requisition updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update job description");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      setDeletingJobId(null);
      setSuccessMessage("Job requisition and related screenings deleted.");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete job requisition");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Requisition Management</h1>
          <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Upload or paste job requisitions. Recruvo AI extracts technical skills, experience requirements, and responsibilities.
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
            <span>Active: {activeJob.job_description?.title || "Job #" + activeJob.id}</span>
          </div>
        )}
      </div>

      {/* Input Mode Tabs & Dropzone Card */}
      <BentoCard className="p-6 md:p-8">
        {/* Toggle Mode Segment */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInputMode("upload");
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === "upload"
                  ? isGenz
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs"
                    : "bg-slate-900 text-white"
                  : isGenz
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Upload JD File (PDF, DOCX, TXT)
            </button>

            <button
              onClick={() => {
                setInputMode("paste");
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === "paste"
                  ? isGenz
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs"
                    : "bg-slate-900 text-white"
                  : isGenz
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Paste Requisition Text
            </button>
          </div>

          <span className={`text-[11px] font-mono hidden sm:inline ${isGenz ? "text-slate-400" : "text-slate-400"}`}>
            Supports PDF, DOCX, TXT
          </span>
        </div>

        {/* Upload Mode Area */}
        {inputMode === "upload" ? (
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
              id="jd-file-input"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="jd-file-input" className="cursor-pointer block">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
                  isGenz
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
                    : "bg-slate-100 text-slate-800 border border-slate-200"
                }`}
              >
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold mb-1">
                {selectedFile ? selectedFile.name : "Drag & drop Job Description file"}
              </h3>
              <p className={`text-xs max-w-sm mx-auto mb-4 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB • Ready to extract`
                  : "Click to browse or drop PDF, DOCX, TXT requisitions"}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isGenz
                    ? "bg-white/[0.05] border-white/10 text-slate-200 hover:bg-white/10"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Choose File
              </span>
            </label>
          </div>
        ) : (
          /* Paste Mode Area */
          <div className="space-y-3">
            <label
              className={`block text-xs font-bold uppercase tracking-wider ${
                isGenz ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Paste Job Description Text
            </label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job title, required technical skills, experience requirements, and responsibilities here..."
              rows={8}
              className={`w-full text-xs rounded-xl p-4 focus:outline-none transition-all resize-y border font-mono ${
                isGenz
                  ? "bg-[#141724] border-white/10 text-slate-100 placeholder-slate-500 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              }`}
            />
          </div>
        )}

        {/* Error / Success Banners */}
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

        {successMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              isGenz
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => navigate("/upload-resumes")}
              className="font-bold underline text-xs ml-2 hover:opacity-80 flex items-center gap-1"
            >
              <span>Next: Upload Resumes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Process Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleProcess}
            disabled={isProcessing || (inputMode === "upload" && !selectedFile) || (inputMode === "paste" && !jdText.trim())}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-40 shadow-sm ${
              isGenz
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]"
                : "bg-slate-900 text-white hover:bg-black"
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting Structured JD...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Parse Job Description</span>
              </>
            )}
          </button>
        </div>
      </BentoCard>

      {/* Requisitions Roster & Active JD Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            Stored Job Descriptions ({jobs.length})
          </h2>
          <span className={`text-xs ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
            Select active requisition to ground screening
          </span>
        </div>

        {jobs.length === 0 ? (
          <BentoCard className="p-8 text-center">
            <FileText className="w-8 h-8 opacity-40 mx-auto mb-2" />
            <p className="font-bold text-sm">No Job Descriptions stored yet</p>
            <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
              Upload or paste a JD above to begin candidate matching.
            </p>
          </BentoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((j) => {
              const jd = j.job_description || {};
              const isActive = activeJob?.id === j.id;

              return (
                <BentoCard
                  key={j.id}
                  highlight={isActive}
                  className={`p-5 flex flex-col justify-between transition-all ${
                    isActive
                      ? isGenz
                        ? "border-indigo-500/60 shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)]"
                        : "border-slate-900 shadow-sm"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black"
                              : isGenz
                              ? "bg-white/[0.04] text-slate-400 border-white/10"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {isActive ? "ACTIVE REQUISITION" : `JD #${j.id}`}
                        </span>
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(j)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isGenz
                              ? "text-slate-400 hover:text-indigo-300 hover:bg-white/[0.06]"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                          title="Edit Requisition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingJobId(j.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isGenz
                              ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                              : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                          title="Delete Requisition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold tracking-tight">{jd.title || "Job Description"}</h3>
                    <p className={`text-xs mt-0.5 ${isGenz ? "text-indigo-300" : "text-slate-600"}`}>
                      {jd.company || "Company"} • {jd.location || "Remote"}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className={isGenz ? "text-slate-400" : "text-slate-500"}>Experience:</span>
                        <span className="font-semibold">{jd.experience_required || "5+ years"}</span>
                      </div>
                    </div>

                    {/* Required Skills Pills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(jd.required_skills || []).slice(0, 5).map((sk, idx) => (
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

                    {jd.summary && (
                      <p className={`mt-3 text-xs leading-relaxed line-clamp-2 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                        {jd.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    {!isActive ? (
                      <button
                        onClick={() => setActiveJob(j)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition-all ${
                          isGenz
                            ? "bg-white/[0.04] border-white/10 text-slate-200 hover:border-indigo-500/40 hover:bg-indigo-600/20 hover:text-white"
                            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        Set as Active Requisition
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active in Workspace
                      </span>
                    )}

                    <NavLink
                      to="/analysis"
                      className={`text-xs font-bold flex items-center gap-1 hover:underline ${
                        isGenz ? "text-indigo-400" : "text-slate-900"
                      }`}
                    >
                      <span>Analyze Candidates</span>
                      <ArrowRight className="w-3 h-3" />
                    </NavLink>
                  </div>
                </BentoCard>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT JOB DESCRIPTION MODAL */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
              isGenz ? "bg-[#141726] border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold">Edit Job Requisition #{editingJob.id}</h3>
              </div>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1 rounded-lg hover:opacity-60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1 opacity-80">Job Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full rounded-xl p-2.5 border ${
                    isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 opacity-80">Company</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className={`w-full rounded-xl p-2.5 border ${
                      isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className={`w-full rounded-xl p-2.5 border ${
                      isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Experience Required</label>
                <input
                  type="text"
                  value={editExperience}
                  onChange={(e) => setEditExperience(e.target.value)}
                  className={`w-full rounded-xl p-2.5 border ${
                    isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={editReqSkills}
                  onChange={(e) => setEditReqSkills(e.target.value)}
                  className={`w-full rounded-xl p-2.5 border ${
                    isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Preferred Skills (Optional)</label>
                <input
                  type="text"
                  value={editPrefSkills}
                  onChange={(e) => setEditPrefSkills(e.target.value)}
                  className={`w-full rounded-xl p-2.5 border ${
                    isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-80">Summary</label>
                <textarea
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl p-2.5 border resize-none ${
                    isGenz ? "bg-[#1A1D2F] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setEditingJob(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 hover:opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                  isGenz ? "bg-indigo-600 hover:bg-indigo-500 shadow-xs" : "bg-slate-900 hover:bg-black"
                }`}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE JOB CONFIRMATION MODAL */}
      {deletingJobId && (
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
              <h3 className="text-sm font-bold">Delete Job Requisition</h3>
              <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                Are you sure you want to delete JD #{deletingJobId}? All associated screening analyses will also be removed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-semibold hover:opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deletingJobId)}
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
