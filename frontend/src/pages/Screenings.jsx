import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Sparkles, Search, Filter, Eye, Trash2, ArrowRight, UserCheck, CheckCircle2, AlertTriangle, AlertCircle, Plus, Upload, X, Loader2 } from 'lucide-react';
import { getScreenings, createScreening, deleteScreening } from '../api/screenings';
import { getResumes } from '../api/candidates';
import { getJobDescriptions } from '../api/jobs';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/ToastContext';

export function Screenings({ refreshTrigger, onDataChange, onOpenUploader }) {
  const [screenings, setScreenings] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [candidatesMap, setCandidatesMap] = useState(new Map());
  const [jobsMap, setJobsMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [filterMatch, setFilterMatch] = useState('all'); // all | strong | potential | weak
  const [search, setSearch] = useState('');
  
  // New screening modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJdId, setSelectedJdId] = useState('');
  const [screeningInProgress, setScreeningInProgress] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchScreeningsData = async () => {
    setLoading(true);
    try {
      const [sData, cData, jData] = await Promise.all([
        getScreenings(),
        getResumes(),
        getJobDescriptions(),
      ]);

      const cMap = new Map();
      (cData || []).forEach((c) => cMap.set(c.id, c.resume));

      const jMap = new Map();
      (jData || []).forEach((j) => jMap.set(j.id, j.job_description));

      setScreenings(sData || []);
      setCandidatesList(cData || []);
      setJobsList(jData || []);
      setCandidatesMap(cMap);
      setJobsMap(jMap);

      if (cData && cData.length > 0) setSelectedCandidateId(String(cData[0].id));
      if (jData && jData.length > 0) setSelectedJdId(String(jData[0].id));
    } catch (err) {
      addToast(err.message || 'Failed to fetch screenings', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreeningsData();
  }, [refreshTrigger]);

  const handleOpenNewScreening = () => {
    if (jobsList.length === 0) {
      addToast('No Job Roles found. Please create a Job Role first.', 'error', 'Missing Job Role');
      return;
    }
    if (candidatesList.length === 0) {
      addToast('No Candidates found. Please upload candidate resumes first.', 'error', 'Missing Candidates');
      return;
    }
    setIsModalOpen(true);
  };

  const handleRunScreening = async () => {
    if (!selectedCandidateId || !selectedJdId) return;
    setScreeningInProgress(true);
    try {
      const newScr = await createScreening(selectedCandidateId, selectedJdId);
      addToast('AI Candidate Screening completed successfully!', 'success', 'Screening Created');
      setScreenings((prev) => [newScr, ...prev]);
      setIsModalOpen(false);
      if (onDataChange) onDataChange();
      navigate(`/screenings/${newScr.id}`);
    } catch (err) {
      addToast(err.message || 'Failed to run screening', 'error', 'Screening Error');
    } finally {
      setScreeningInProgress(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete screening #${id}?`)) return;
    try {
      await deleteScreening(id);
      addToast(`Deleted screening evaluation #${id}`, 'success', 'Deleted');
      setScreenings((prev) => prev.filter((s) => s.id !== id));
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Failed to delete screening', 'error', 'Error');
    }
  };

  // Filter logic
  const filtered = screenings.filter((item) => {
    const score = item.score;
    if (filterMatch === 'strong' && score < 8) return false;
    if (filterMatch === 'potential' && (score < 5 || score >= 8)) return false;
    if (filterMatch === 'weak' && score >= 5) return false;

    const cand = candidatesMap.get(item.resume_id) || {};
    const job = jobsMap.get(item.jd_id) || {};

    const text = `${cand.name || ''} ${job.title || ''} ${item.reason || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Screening Workspace</h2>
          <p className="text-xs text-slate-500">AI-powered candidate evaluations and match scoring</p>
        </div>

        <button
          onClick={handleOpenNewScreening}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>New AI Screening</span>
        </button>
      </div>

      {/* Warning Banners for missing pre-requisites */}
      {!loading && (jobsList.length === 0 || candidatesList.length === 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobsList.length === 0 && (
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">No Job Roles Created</span>
                  <p className="text-[11px] text-amber-700">Create a role to run AI screenings.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/jobs?action=create')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition shrink-0"
              >
                Create Role
              </button>
            </div>
          )}

          {candidatesList.length === 0 && (
            <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-900 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold">No Candidate Resumes</span>
                  <p className="text-[11px] text-indigo-700">Upload resumes to build talent pool.</p>
                </div>
              </div>
              <button
                onClick={onOpenUploader}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition shrink-0"
              >
                Upload Resumes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Controls & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {/* Match Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'strong', label: 'Strong Match (8-10)' },
            { id: 'potential', label: 'Potential Match (5-7)' },
            { id: 'weak', label: 'Weak Match (1-4)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMatch(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                filterMatch === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search evaluation reasoning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 text-xs font-medium border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Screenings Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center p-6 space-y-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="p-3 rounded-full bg-slate-100 text-slate-400 inline-flex">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No screenings match this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run a new AI candidate screening or adjust your search filter.
          </p>
          <button
            onClick={handleOpenNewScreening}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>New AI Screening</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const cand = candidatesMap.get(item.resume_id) || {};
            const job = jobsMap.get(item.jd_id) || {};
            const score = item.score;

            const scoreColor =
              score >= 8
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : score >= 5
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200';

            const matchText =
              score >= 8
                ? 'STRONG MATCH'
                : score >= 5
                ? 'POTENTIAL MATCH'
                : 'WEAK MATCH';

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/screenings/${item.id}`)}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md cursor-pointer transition space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        EVALUATION #{item.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {cand.name || `Candidate #${item.resume_id}`}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Role: {job.title || `Job Role #${item.jd_id}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor}`}>
                        {score} / 10 &bull; {matchText}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 transition"
                        title="Delete Screening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-indigo-600 block mb-1">
                      ✦ Hirely AI Reasoning:
                    </span>
                    <p className="line-clamp-3">{item.reason}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>View Detailed AI Analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New AI Screening Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="fixed inset-0" onClick={() => !screeningInProgress && setIsModalOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">New AI Screening</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={screeningInProgress}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Candidate
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  disabled={screeningInProgress}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {candidatesList.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      #{cand.id} — {cand.resume?.name || 'Unnamed Candidate'} ({cand.resume?.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Target Job Role
                </label>
                <select
                  value={selectedJdId}
                  onChange={(e) => setSelectedJdId(e.target.value)}
                  disabled={screeningInProgress}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {jobsList.map((job) => (
                    <option key={job.id} value={job.id}>
                      #{job.id} — {job.job_description?.title || 'Untitled Role'} ({job.job_description?.company || 'Organization'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {screeningInProgress && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5 text-indigo-700 text-xs font-medium animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>✦ Hirely AI is evaluating candidate match...</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={screeningInProgress}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRunScreening}
                disabled={!selectedCandidateId || !selectedJdId || screeningInProgress}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-500 transition disabled:opacity-50"
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

export default Screenings;
