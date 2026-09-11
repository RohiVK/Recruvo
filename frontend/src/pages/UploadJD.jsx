import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Briefcase,
  Layers,
  GraduationCap,
  Award,
  Edit3,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";

export default function UploadJD() {
  const navigate = useNavigate();
  const { uploadJobText, uploadJobFile, updateJob, deleteJob, activeJob, setActiveJob, jobs } = useRecruvo();

  const [activeTab, setActiveTab] = useState("paste"); // "paste" | "upload"
  const [jdText, setJdText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [extractedJob, setExtractedJob] = useState(activeJob || null);

  // Edit JD Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    company: "",
    location: "",
    experience_required: "",
    summary: "",
    required_skills: "",
    preferred_skills: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Confirm State
  const [deletingJobId, setDeletingJobId] = useState(null);

  const sampleJd = `Senior Full Stack Engineer
Company: CloudScale Dynamics
Location: Remote / San Francisco, CA
Employment Type: Full-time

About the Role:
We are seeking a seasoned Senior Full Stack Engineer to spearhead our cloud platform development. You will architect scalable backend microservices, design responsive modern interfaces, and collaborate with cross-functional product teams.

Key Responsibilities:
- Design and develop robust RESTful APIs and asynchronous event-driven microservices.
- Build clean, performant, and responsive frontends using React and modern CSS.
- Maintain PostgreSQL database schemas, query optimizations, and data migrations.
- Implement CI/CD deployment pipelines using Docker, Kubernetes, and AWS services.
- Lead architectural code reviews and mentor junior engineering team members.

Required Skills & Qualifications:
- 5+ years of professional full stack software development experience.
- Strong proficiency in Python, JavaScript / TypeScript, Node.js, and React.
- Solid hands-on experience with PostgreSQL, relational modeling, and query tuning.
- Demonstrated cloud infrastructure experience with AWS (ECS, Lambda, S3, RDS).
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.

Preferred Skills:
- Experience with Kubernetes and container orchestration.
- Familiarity with GraphQL, Redis caching, and WebSocket real-time systems.
- Experience in high-growth B2B SaaS environments.`;

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!jdText.trim() || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const job = await uploadJobText(jdText);
      setExtractedJob(job);
      setSuccessToast("Job description successfully parsed and saved!");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to process job description. Please ensure text is valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const job = await uploadJobFile(selectedFile);
      setExtractedJob(job);
      setSuccessToast(`Job description "${selectedFile.name}" successfully parsed and saved!`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to parse job description file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (jobToEdit = extractedJob) => {
    if (!jobToEdit) return;
    const details = jobToEdit.job_description || jobToEdit;
    setEditingJobId(jobToEdit.id);
    setEditFormData({
      title: details.title || "",
      company: details.company || "",
      location: details.location || "",
      experience_required: details.experience_required || "",
      summary: details.summary || "",
      required_skills: Array.isArray(details.required_skills)
        ? details.required_skills.join(", ")
        : details.required_skills || "",
      preferred_skills: Array.isArray(details.preferred_skills)
        ? details.preferred_skills.join(", ")
        : details.preferred_skills || "",
    });
    setIsEditModalOpen(true);
  };

  // Save JD Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingJobId || isSavingEdit) return;

    setIsSavingEdit(true);
    setErrorMessage(null);

    try {
      const target = jobs.find((j) => String(j.id) === String(editingJobId)) || extractedJob;
      const baseDetails = target?.job_description || target || {};

      const reqSkills = editFormData.required_skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const prefSkills = editFormData.preferred_skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedJobPayload = {
        ...baseDetails,
        title: editFormData.title.trim(),
        company: editFormData.company.trim(),
        location: editFormData.location.trim(),
        experience_required: editFormData.experience_required.trim(),
        summary: editFormData.summary.trim(),
        required_skills: reqSkills,
        preferred_skills: prefSkills,
      };

      const updated = await updateJob(editingJobId, updatedJobPayload);
      setExtractedJob(updated);
      setIsEditModalOpen(false);
      setSuccessToast("Job description updated successfully!");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update job description.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete JD
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      if (extractedJob && String(extractedJob.id) === String(jobId)) {
        const remaining = jobs.filter((j) => String(j.id) !== String(jobId));
        setExtractedJob(remaining.length > 0 ? remaining[0] : null);
      }
      setDeletingJobId(null);
      setSuccessToast("Job description deleted successfully.");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete job description.");
    }
  };

  const jobDetails = extractedJob?.job_description || extractedJob || null;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Upload Job Description</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Paste the job description text or upload a document (PDF, DOCX, TXT) to establish the hiring baseline.
          </p>
        </div>

        {activeJob && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 shrink-0">
            <Briefcase className="w-3.5 h-3.5 text-gray-600" />
            <span>Active JD: {activeJob.job_description?.title || "Job #" + activeJob.id}</span>
          </div>
        )}
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 bg-gray-50/70 p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("paste")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === "paste"
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === "upload"
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
            </div>

            {/* Paste Text Tab */}
            {activeTab === "paste" && (
              <form onSubmit={handlePasteSubmit} className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Job Description Text</label>
                  <button
                    type="button"
                    onClick={() => setJdText(sampleJd)}
                    className="text-[11px] text-gray-600 hover:text-gray-900 font-medium underline"
                  >
                    Load Sample JD
                  </button>
                </div>

                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste complete job description, requirements, responsibilities, and required qualifications here..."
                  rows={14}
                  required
                  className="w-full text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:bg-white transition-all font-mono leading-relaxed resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400">
                    {jdText.length} characters
                  </span>
                  <button
                    type="submit"
                    disabled={!jdText.trim() || isProcessing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-semibold shadow-xs transition-all disabled:opacity-40"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Extracting with Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Extract Criteria
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Upload File Tab */}
            {activeTab === "upload" && (
              <form onSubmit={handleFileUploadSubmit} className="p-5 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center mx-auto mb-3 text-gray-800">
                    <Upload className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mb-1">
                    Select or drag & drop Job Description file
                  </p>
                  <p className="text-[11px] text-gray-400 mb-4">
                    Supports PDF, DOCX, DOC, TXT (up to 15MB)
                  </p>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-xs">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-gray-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-800 truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!selectedFile || isProcessing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-semibold shadow-xs transition-all disabled:opacity-40"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Extracting file with Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Parse Document
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Stored JDs list with Edit and Delete options */}
          {jobs.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Saved Job Descriptions ({jobs.length})
                </h3>
                <span className="text-[10px] text-gray-400">Select, Edit or Delete</span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {jobs.map((j) => {
                  const isSelected = extractedJob?.id === j.id;
                  const jTitle = j.job_description?.title || `Job #${j.id}`;
                  const jCompany = j.job_description?.company || "Company";

                  return (
                    <div
                      key={j.id}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                        isSelected
                          ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                          : "bg-gray-50 text-gray-800 border-gray-200/80 hover:bg-gray-100"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setActiveJob(j);
                          setExtractedJob(j);
                        }}
                        className="text-left flex-1 min-w-0 pr-2"
                      >
                        <p className="font-semibold truncate">{jTitle}</p>
                        <p className={`text-[10px] truncate ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                          {jCompany} • ID #{j.id}
                        </p>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(j);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSelected
                              ? "hover:bg-gray-800 text-gray-200"
                              : "hover:bg-gray-200 text-gray-600"
                          }`}
                          title="Edit Job Description"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingJobId(j.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSelected
                              ? "hover:bg-red-900/60 text-red-300"
                              : "hover:bg-red-50 text-red-600"
                          }`}
                          title="Delete Job Description"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Extracted JD View & Actions */}
        <div className="lg:col-span-6">
          {jobDetails ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
              {/* Header Details */}
              <div className="pb-4 border-b border-gray-200 flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mb-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Structured Job Profile Extracted
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{jobDetails.title || "Untitled Role"}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {jobDetails.company || "Company"} • {jobDetails.location || "Remote"} •{" "}
                    {jobDetails.employment_type || "Full-time"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(extractedJob)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                    title="Edit this Job Description"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingJobId(extractedJob.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors shadow-2xs"
                    title="Delete this Job Description"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveJob(extractedJob)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors shadow-2xs ${
                      activeJob?.id === extractedJob?.id
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {activeJob?.id === extractedJob?.id ? "Active JD ✓" : "Set Active"}
                  </button>
                </div>
              </div>

              {/* Role Summary */}
              {jobDetails.summary && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Summary</h4>
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {jobDetails.summary}
                  </p>
                </div>
              )}

              {/* Requirements & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Experience</span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {jobDetails.experience_required || "Not specified"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Education</span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {Array.isArray(jobDetails.education) && jobDetails.education.length > 0
                      ? jobDetails.education.join(", ")
                      : "Bachelor's Degree or Equivalent"}
                  </p>
                </div>
              </div>

              {/* Required Skills */}
              {Array.isArray(jobDetails.required_skills) && jobDetails.required_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Required Skills ({jobDetails.required_skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobDetails.required_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-900 text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Skills */}
              {Array.isArray(jobDetails.preferred_skills) && jobDetails.preferred_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Preferred Skills ({jobDetails.preferred_skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobDetails.preferred_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {Array.isArray(jobDetails.responsibilities) && jobDetails.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-1.5">
                    {jobDetails.responsibilities.slice(0, 5).map((resp, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Step CTA */}
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    setActiveJob(extractedJob);
                    navigate("/upload-resumes");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-sm transition-all"
                >
                  <span>Next: Upload Resumes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">No Job Description Extracted Yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Paste text or upload a job specification document on the left to extract structured hiring
                criteria using Recruvo's AI engine.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* EDIT JOB DESCRIPTION MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-gray-900" />
                <h3 className="text-base font-bold text-gray-900">Edit Job Description</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location / Mode</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Experience Required</label>
                  <input
                    type="text"
                    value={editFormData.experience_required}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, experience_required: e.target.value })
                    }
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editFormData.required_skills}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, required_skills: e.target.value })
                  }
                  placeholder="Python, React, AWS, SQL"
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Preferred Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editFormData.preferred_skills}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, preferred_skills: e.target.value })
                  }
                  placeholder="Docker, Kubernetes, Redis"
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Role Summary</label>
                <textarea
                  rows={4}
                  value={editFormData.summary}
                  onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Delete Job Description</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this Job Description (ID #{deletingJobId})? Associated candidate screenings for this job will also be cleaned up.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deletingJobId)}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
