import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Edit, Save, Trash2, UserCheck, CheckCircle2, AlertTriangle, AlertCircle, Building } from 'lucide-react';
import { getScreening, updateScreening, deleteScreening } from '../api/screenings';
import { getResume } from '../api/candidates';
import { getJobDescription } from '../api/jobs';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/ToastContext';

export function ScreeningDetails({ onDataChange }) {
  const { id } = useParams();
  const [screening, setScreening] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState(1);
  const [editReason, setEditReason] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const scr = await getScreening(id);
        if (isMounted) {
          setScreening(scr);
          setEditScore(scr.score);
          setEditReason(scr.reason);
        }

        if (scr) {
          const [candRes, jobRes] = await Promise.allSettled([
            getResume(scr.resume_id),
            getJobDescription(scr.jd_id),
          ]);

          if (isMounted) {
            if (candRes.status === 'fulfilled') setCandidate(candRes.value);
            if (jobRes.status === 'fulfilled') setJob(jobRes.value);
          }
        }
      } catch (err) {
        if (isMounted) {
          addToast(err.message || 'Failed to fetch screening evaluation', 'error', 'Error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAllDetails();
    return () => {
      isMounted = false;
    };
  }, [id, addToast]);

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateScreening(id, editScore, editReason);
      setScreening(updated);
      setIsEditing(false);
      addToast('Screening evaluation updated', 'success', 'Saved');
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Failed to update evaluation', 'error', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this screening evaluation?')) return;
    try {
      await deleteScreening(id);
      addToast('Screening evaluation deleted', 'success', 'Deleted');
      if (onDataChange) onDataChange();
      navigate('/screenings');
    } catch (err) {
      addToast(err.message || 'Failed to delete screening', 'error', 'Error');
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

  if (!screening) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">Screening Evaluation Not Found</h3>
        <button
          onClick={() => navigate('/screenings')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Back to Screenings
        </button>
      </div>
    );
  }

  const candName = candidate?.resume?.name || `Candidate #${screening.resume_id}`;
  const jobTitle = job?.job_description?.title || `Job Role #${screening.jd_id}`;
  const company = job?.job_description?.company || 'Organization';
  const score = screening.score;

  const scoreBadgeColor =
    score >= 8
      ? 'bg-emerald-500 text-white'
      : score >= 5
      ? 'bg-amber-500 text-white'
      : 'bg-rose-500 text-white';

  const matchLabel =
    score >= 8
      ? 'STRONG MATCH'
      : score >= 5
      ? 'POTENTIAL MATCH'
      : 'WEAK MATCH';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/screenings')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Screenings</span>
        </button>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Evaluation</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                title="Delete Screening"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Score Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 font-mono text-[10px] font-bold text-indigo-700">
              EVALUATION #{screening.id}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">Candidate Match Analysis</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">{candName}</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <Building className="w-3.5 h-3.5 text-indigo-500" />
            <span>Target Role: {jobTitle} ({company})</span>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
          <div className={`h-16 w-16 rounded-2xl ${scoreBadgeColor} font-extrabold text-2xl flex items-center justify-center shadow-md`}>
            {score}
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 block uppercase">
              Match Score
            </span>
            <span className="text-base font-extrabold text-slate-900 block">
              {score} / 10
            </span>
            <span className="text-xs font-bold text-slate-600 block mt-0.5">
              {matchLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Editing Form vs Structured AI Explanation View */}
      {isEditing ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Edit Screening Score & Reason
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Score (1 - 10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={editScore}
              onChange={(e) => setEditScore(Number(e.target.value))}
              className="w-full sm:w-40 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              AI Reasoning Explanation
            </label>
            <textarea
              rows={6}
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">✦ Hirely AI Analysis</h3>
              <p className="text-xs text-slate-500">Comprehensive evaluation reasoning based on job description alignment</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-sm text-slate-800 leading-relaxed space-y-3">
            <p className="whitespace-pre-wrap">{screening.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScreeningDetails;
