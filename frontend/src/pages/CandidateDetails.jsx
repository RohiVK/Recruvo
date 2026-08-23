import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Edit, Save, Trash2, Mail, Phone, MapPin, Sparkles, Building, GraduationCap, Code, Award, CheckCircle2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { getResume, updateResume, deleteResume } from '../api/candidates';
import { getJobDescriptions } from '../api/jobs';
import { createScreening } from '../api/screenings';
import { CardSkeleton } from '../components/ui/Skeleton';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { useToast } from '../components/ui/ToastContext';

export function CandidateDetails({ onDataChange }) {
  const { id } = useParams();
  const [candidateRecord, setCandidateRecord] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [screenModalOpen, setScreenModalOpen] = useState(false);
  const [selectedJdId, setSelectedJdId] = useState('');
  const [screeningInProgress, setScreeningInProgress] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchCandidateAndJobs = async () => {
      setLoading(true);
      try {
        const [record, jobsData] = await Promise.all([
          getResume(id),
          getJobDescriptions(),
        ]);
        if (isMounted) {
          setCandidateRecord(record);
          setFormData(record?.resume || {});
          setJobs(jobsData || []);
          if (jobsData && jobsData.length > 0) {
            setSelectedJdId(String(jobsData[0].id));
          }
        }
      } catch (err) {
        if (isMounted) {
          addToast(err.message || 'Failed to fetch candidate details', 'error', 'Error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCandidateAndJobs();
    return () => {
      isMounted = false;
    };
  }, [id, addToast]);

  const handleOpenScreenModal = () => {
    if (jobs.length === 0) {
      addToast('No job roles found. Please create a Job Role first before screening candidates.', 'error', 'Missing Job Role');
      return;
    }
    setScreenModalOpen(true);
  };

  const handleRunScreening = async () => {
    if (!selectedJdId) return;
    setScreeningInProgress(true);
    try {
      const screening = await createScreening(id, selectedJdId);
      addToast('Candidate screened successfully with Hirely AI!', 'success', 'Screening Created');
      setScreenModalOpen(false);
      if (onDataChange) onDataChange();
      navigate(`/screenings/${screening.id}`);
    } catch (err) {
      addToast(err.message || 'Failed to screen candidate against selected role', 'error', 'Screening Error');
    } finally {
      setScreeningInProgress(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateResume(id, formData);
      setCandidateRecord(updated);
      setIsEditing(false);
      addToast('Candidate profile updated successfully', 'success', 'Saved');
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Failed to update candidate profile', 'error', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this candidate profile?')) return;
    try {
      await deleteResume(id);
      addToast('Candidate profile deleted', 'success', 'Deleted');
      if (onDataChange) onDataChange();
      navigate('/candidates');
    } catch (err) {
      addToast(err.message || 'Failed to delete candidate', 'error', 'Error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!candidateRecord) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">Candidate Not Found</h3>
        <button
          onClick={() => navigate('/candidates')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  const c = candidateRecord.resume || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Loading Overlay when screening */}
      <LoadingOverlay
        isVisible={screeningInProgress}
        message="✦ Hirely AI is evaluating candidate..."
        subtext="Matching technical skills, experience, and qualifications against target job role."
      />

      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/candidates')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidates</span>
        </button>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleOpenScreenModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Screen Candidate</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                title="Delete Profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Warning banner if no job roles exist */}
      {jobs.length === 0 && (
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">No Job Roles Created Yet</span>
              <p className="text-[11px] text-amber-700">
                You must create a Job Role before you can screen this candidate.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/jobs?action=create')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition shrink-0 cursor-pointer"
          >
            Create Job Role
          </button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {(c.name || 'C')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {c.name || 'Unnamed Candidate'}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                  ID #{candidateRecord.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                {c.summary || 'Structured resume data parsed by Hirely AI.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact info strip */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
          {c.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{c.email}</span>
            </div>
          )}
          {c.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{c.phone}</span>
            </div>
          )}
          {c.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{c.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Editing Mode Form */}
      {isEditing ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Edit Candidate Structured Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Summary</label>
            <textarea
              rows={3}
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      ) : (
        /* Structured View Cards */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600" />
                <span>Technical & Soft Skills</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(c.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
                {(!c.skills || c.skills.length === 0) && (
                  <span className="text-xs text-slate-400">No skills listed</span>
                )}
              </div>
            </div>

            {c.certifications && c.certifications.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Certifications</span>
                </h3>
                <ul className="space-y-2">
                  {c.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building className="w-4.5 h-4.5 text-indigo-600" />
                <span>Work Experience</span>
              </h3>
              {(!c.experience || c.experience.length === 0) ? (
                <p className="text-xs text-slate-400">No work experience listed</p>
              ) : (
                <div className="space-y-4">
                  {c.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-[11px] font-medium text-slate-400">
                          {exp.start_date} - {exp.end_date}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-indigo-600">{exp.company}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="w-4.5 h-4.5 text-blue-600" />
                <span>Education</span>
              </h3>
              {(!c.education || c.education.length === 0) ? (
                <p className="text-xs text-slate-400">No education listed</p>
              ) : (
                <div className="space-y-3">
                  {c.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900">{edu.degree} - {edu.field}</h4>
                        <p className="text-slate-500">{edu.institution}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {edu.start_year} - {edu.end_year}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screen Candidate Select Job Modal */}
      {screenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="fixed inset-0" onClick={() => !screeningInProgress && setScreenModalOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Screen Candidate</h3>
              </div>
              <button
                onClick={() => setScreenModalOpen(false)}
                disabled={screeningInProgress}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Target Job Role
              </label>
              <select
                value={selectedJdId}
                onChange={(e) => setSelectedJdId(e.target.value)}
                disabled={screeningInProgress}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    #{job.id} — {job.job_description?.title || 'Untitled Role'} ({job.job_description?.company || 'Organization'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setScreenModalOpen(false)}
                disabled={screeningInProgress}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRunScreening}
                disabled={!selectedJdId || screeningInProgress}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Screening</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateDetails;
