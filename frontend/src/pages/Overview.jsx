import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Users, Briefcase, Sparkles, TrendingUp, Upload, Plus, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { getResumes } from '../api/candidates';
import { getJobDescriptions } from '../api/jobs';
import { getScreenings } from '../api/screenings';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/ToastContext';

export function Overview({ refreshTrigger, onOpenUploader }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cData, jData, sData] = await Promise.all([
          getResumes(),
          getJobDescriptions(),
          getScreenings(),
        ]);
        if (isMounted) {
          setCandidates(cData || []);
          setJobs(jData || []);
          setScreenings(sData || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard metrics');
          addToast(err.message || 'Backend connection error', 'error', 'Connection Error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, addToast]);

  // Compute real statistics strictly from backend data
  const totalCandidates = candidates.length;
  const totalJobs = jobs.length;
  const totalScreenings = screenings.length;

  const validScores = screenings
    .map((s) => s.score)
    .filter((sc) => typeof sc === 'number' && sc >= 1 && sc <= 10);

  const avgScore =
    validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
      : null;

  // Get greeting time of day
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Hiring Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {timeGreeting}, Recruiter.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome back to Hirely. Your hiring workspace is ready with AI-assisted resume screening and candidate intelligence.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenUploader}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md hover:bg-slate-100 transition"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload Resume</span>
            </button>
            <button
              onClick={() => navigate('/jobs?action=create')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Job Role</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Backend Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 flex items-center justify-between text-xs font-medium">
          <span>Backend connection warning: {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Candidates Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Candidates
                </span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalCandidates}</span>
                <span className="text-xs text-slate-500 font-medium">in pool</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 truncate">Parsed with Hirely AI</p>
            </div>

            {/* Job Roles Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Job Roles
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalJobs}</span>
                <span className="text-xs text-slate-500 font-medium">active roles</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 truncate">Structured job criteria</p>
            </div>

            {/* Screenings Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Screenings
                </span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalScreenings}</span>
                <span className="text-xs text-slate-500 font-medium">evaluations</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 truncate">AI match scoring completed</p>
            </div>

            {/* Avg Match Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Average Match
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {avgScore ? `${avgScore}` : '—'}
                </span>
                <span className="text-xs text-slate-500 font-medium">{avgScore ? '/ 10' : 'No data'}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 truncate">Across screened candidates</p>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: Recent Screenings & Active Job Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Screenings (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Screenings</h3>
              <p className="text-xs text-slate-500">Latest AI match evaluations</p>
            </div>
            <Link
              to="/screenings"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {screenings.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700">No screenings yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create a job role and screen candidate resumes to see AI match evaluations here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Resume ID</th>
                    <th className="py-3 px-2">Job ID</th>
                    <th className="py-3 px-2">Score</th>
                    <th className="py-3 px-2">Reason Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {screenings.slice(0, 5).map((scr) => {
                    const score = scr.score;
                    const badgeColor =
                      score >= 8
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : score >= 5
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200';

                    return (
                      <tr key={scr.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-2 font-mono font-semibold text-slate-900">
                          #{scr.id}
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-600">
                          #{scr.resume_id}
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-600">
                          #{scr.jd_id}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold ${badgeColor}`}
                          >
                            {score} / 10
                          </span>
                        </td>
                        <td className="py-3 px-2 max-w-xs truncate text-slate-500">
                          {scr.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Job Roles (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Job Roles</h3>
              <p className="text-xs text-slate-500">Open openings & criteria</p>
            </div>
            <Link
              to="/jobs"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 space-y-2">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700">No job roles yet</h4>
              <p className="text-xs text-slate-500">
                Create your first job role to begin finding matching candidates.
              </p>
              <button
                onClick={() => navigate('/jobs?action=create')}
                className="inline-flex items-center gap-1.5 mt-2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Role</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 4).map((job) => {
                const jobTitle = job.job_description?.title || `Job Role #${job.id}`;
                const company = job.job_description?.company || 'Organization';
                const location = job.job_description?.location || 'Remote/Hybrid';

                return (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs hover:border-slate-300 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{jobTitle}</h4>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        #{job.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{company}</span>
                      <span>&bull;</span>
                      <span>{location}</span>
                    </div>
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

export default Overview;
