import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Building, MapPin, Briefcase, DollarSign, Clock, Sparkles, Users, CheckCircle2, AlertCircle, Trash2, Edit, Save, Loader2, AlertTriangle } from 'lucide-react';
import { getJobDescription, updateJobDescription, deleteJobDescription } from '../api/jobs';
import { getResumes } from '../api/candidates';
import { getScreenings, batchScreening, createScreening } from '../api/screenings';
import { CardSkeleton } from '../components/ui/Skeleton';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { useToast } from '../components/ui/ToastContext';

export function JobDetails({ onDataChange }) {
  const { id } = useParams();
  const [jobRecord, setJobRecord] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batching, setBatching] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [singleScreeningLoading, setSingleScreeningLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchJobAndMatches = async () => {
    setLoading(true);
    try {
      const [jobData, candidatesData, screeningsData] = await Promise.all([
        getJobDescription(id),
        getResumes(),
        getScreenings({ jdId: id }),
      ]);
      setJobRecord(jobData);
      setCandidates(candidatesData || []);
      setScreenings(screeningsData || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch job description details', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndMatches();
  }, [id]);

  const handleScreenAll = async () => {
    if (candidates.length === 0) {
      addToast('No candidates available to screen. Please upload resumes first.', 'info', 'No Candidates');
      return;
    }

    setBatching(true);
    setBatchProgress({ current: 0, total: candidates.length });

    try {
      const candidateIds = candidates.map((c) => c.id);
      const res = await batchScreening(id, candidateIds, (prog) => setBatchProgress(prog));
      addToast(`Batch screened ${res.count} candidate(s) for this job role.`, 'success', 'Screening Complete');
      const updatedScreenings = await getScreenings({ jdId: id });
      setScreenings(updatedScreenings || []);
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Batch screening failed', 'error', 'Error');
    } finally {
      setBatching(false);
      setBatchProgress(null);
    }
  };

  const handleScreenSingle = async (candidateId) => {
    setSingleScreeningLoading(true);
    try {
      const newScreening = await createScreening(candidateId, id);
      addToast('Candidate screened successfully with Hirely AI', 'success', 'Screening Created');
      setScreenings((prev) => [newScreening, ...prev.filter((s) => s.resume_id !== candidateId)]);
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Failed to screen candidate', 'error', 'Error');
    } finally {
      setSingleScreeningLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this job role?')) return;
    try {
      await deleteJobDescription(id);
      addToast('Job description deleted', 'success', 'Deleted');
      if (onDataChange) onDataChange();
      navigate('/jobs');
    } catch (err) {
      addToast(err.message || 'Failed to delete job description', 'error', 'Error');
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

  if (!jobRecord) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">Job Role Not Found</h3>
        <button
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition cursor-pointer"
        >
          Back to Job Roles
        </button>
      </div>
    );
  }

  const j = jobRecord.job_description || {};

  // Map screening evaluations to candidate list
  const candidateMatchesMap = new Map();
  screenings.forEach((scr) => {
    candidateMatchesMap.set(scr.resume_id, scr);
  });

  const candidateListWithScores = candidates.map((cand) => {
    const scr = candidateMatchesMap.get(cand.id);
    return {
      candidate: cand,
      screening: scr,
      score: scr ? scr.score : -1,
    };
  });

  // Sort candidates by score descending
  candidateListWithScores.sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Loading Overlay when running single screening or batch screening */}
      <LoadingOverlay
        isVisible={singleScreeningLoading}
        message="✦ Hirely AI is evaluating candidate..."
        subtext="Analyzing candidate skills, experience, and education against this job description."
      />

      <LoadingOverlay
        isVisible={batching}
        message={`✦ Batch Screening in progress... (${batchProgress?.current || 0}/${batchProgress?.total || 0})`}
        subtext="Hirely AI is sequentially evaluating all candidate resumes against job role requirements."
      />

      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Roles</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScreenAll}
            disabled={batching || candidates.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {batching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{batching ? `Screening (${batchProgress?.current}/${batchProgress?.total})...` : 'Screen All Candidates'}</span>
          </button>
          <button
            onClick={handleDeleteJob}
            className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
            title="Delete Job Role"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Overview Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">
                {j.title || 'Untitled Job Role'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-600">
                ID #{jobRecord.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-slate-500">
              {j.company && (
                <div className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{j.company}</span>
                </div>
              )}
              {j.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{j.location}</span>
                </div>
              )}
              {j.employment_type && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{j.employment_type}</span>
                </div>
              )}
              {j.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>{j.salary}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900">{screenings.length}</span>
              <span className="text-xs text-slate-400 block font-medium">/ {candidates.length} Screened</span>
            </div>
          </div>
        </div>

        {j.summary && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed">{j.summary}</p>
          </div>
        )}
      </div>

      {/* Grid: Job Requirements & Candidate Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Requirements (1 col) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Required Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(j.required_skills || []).map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100"
                >
                  {sk}
                </span>
              ))}
              {(!j.required_skills || j.required_skills.length === 0) && (
                <span className="text-xs text-slate-400">None listed</span>
              )}
            </div>
          </div>

          {j.preferred_skills && j.preferred_skills.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Preferred Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {j.preferred_skills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {j.responsibilities && j.responsibilities.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Responsibilities
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {j.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">&bull;</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Candidate Matches (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Candidate Matches</h3>
              <p className="text-xs text-slate-500">Ranked by Hirely AI evaluation scores</p>
            </div>
            <button
              onClick={handleScreenAll}
              disabled={batching || candidates.length === 0}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer disabled:opacity-50"
            >
              Run Batch Screening
            </button>
          </div>

          {candidateListWithScores.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700">No candidates in pool</h4>
              <p className="text-xs text-slate-500">
                Upload resumes to evaluate candidates against this job role.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidateListWithScores.map(({ candidate, screening, score }) => {
                const c = candidate.resume || {};
                const name = c.name || 'Candidate';
                const hasScreening = !!screening;

                const scoreColor =
                  score >= 8
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : score >= 5
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : score >= 1
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200';

                const matchLabel =
                  score >= 8
                    ? 'STRONG MATCH'
                    : score >= 5
                    ? 'POTENTIAL MATCH'
                    : score >= 1
                    ? 'WEAK MATCH'
                    : 'NOT SCREENED';

                return (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:shadow-xs transition space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {name[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">ID #{candidate.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasScreening ? (
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor}`}>
                              {score} / 10 &bull; {matchLabel}
                            </span>
                            <button
                              onClick={() => navigate(`/screenings/${screening.id}`)}
                              className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition cursor-pointer"
                            >
                              View Analysis
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleScreenSingle(candidate.id)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Screen Candidate</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {hasScreening && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 line-clamp-2">
                        <span className="font-semibold text-indigo-600 mr-1">✦ Hirely AI Reasoning:</span>
                        {screening.reason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
