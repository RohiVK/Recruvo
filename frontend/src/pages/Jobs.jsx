import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Briefcase, Plus, Search, Sparkles, Building, MapPin, Trash2, ArrowRight, X, Loader2 } from 'lucide-react';
import { getJobDescriptions, createJobDescription, deleteJobDescription } from '../api/jobs';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/ToastContext';

export function Jobs({ refreshTrigger, onDataChange }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobText, setJobText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobDescriptions();
      setJobs(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch job roles', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [refreshTrigger]);

  const handleCreateJob = async () => {
    if (!jobText.trim()) return;

    setAnalyzing(true);
    try {
      const created = await createJobDescription(jobText);
      addToast('Job role created and parsed with Hirely AI', 'success', 'Role Created');
      setJobs((prev) => [created, ...prev]);
      setJobText('');
      setIsModalOpen(false);
      if (onDataChange) onDataChange();
      navigate(`/jobs/${created.id}`);
    } catch (err) {
      addToast(err.message || 'Failed to analyze job description', 'error', 'AI Extraction Error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete job role ${title || `#${id}`}?`)) return;
    setDeletingId(id);
    try {
      await deleteJobDescription(id);
      addToast(`Deleted job role #${id}`, 'success', 'Job Deleted');
      setJobs((prev) => prev.filter((j) => j.id !== id));
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Failed to delete job role', 'error', 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = jobs.filter((item) => {
    const j = item.job_description || {};
    const text = `${j.title || ''} ${j.company || ''} ${j.summary || ''} ${(j.required_skills || []).join(' ')}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Job Roles</h2>
          <p className="text-xs text-slate-500">Define roles and discover your strongest candidates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Job Role</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search job title, company, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-xs font-medium border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center p-6 space-y-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="p-3 rounded-full bg-slate-100 text-slate-400 inline-flex">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No job roles yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first job role and start finding the right candidate matches.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job Role</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const j = item.job_description || {};
            const title = j.title || 'Untitled Role';
            const company = j.company || 'Company';
            const location = j.location || 'Location';
            const skills = j.required_skills || [];

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/jobs/${item.id}`)}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        ID #{item.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, item.id, title)}
                      disabled={deletingId === item.id}
                      className="text-slate-300 hover:text-rose-600 p-1 transition"
                      title="Delete Job Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{company}</span>
                    </div>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {j.summary || 'No summary provided.'}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {skills.slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]"
                      >
                        {sk}
                      </span>
                    ))}
                    {skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>View Details & Matches</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Job Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="fixed inset-0" onClick={() => !analyzing && setIsModalOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-900 text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create a Job Role</h3>
                  <p className="text-xs text-slate-500">Paste job description for AI extraction</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={analyzing}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Job Description Text
                </label>
                <textarea
                  rows={8}
                  disabled={analyzing}
                  placeholder="Paste the complete job description text here (e.g. title, requirements, responsibilities, skills, qualifications)..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition disabled:opacity-50"
                />
              </div>

              {analyzing && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3 text-indigo-700 text-xs font-medium animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>✦ Hirely AI is analyzing this job description...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={analyzing}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                disabled={!jobText.trim() || analyzing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs hover:bg-indigo-600 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
