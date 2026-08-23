import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, Upload, Search, Filter, ArrowUpDown, FileText, Trash2, Eye, MapPin, Mail, Phone, Sparkles } from 'lucide-react';
import { getResumes, deleteResume } from '../api/candidates';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/ToastContext';

export function Candidates({ refreshTrigger, onOpenUploader, onDataChange }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await getResumes();
      setCandidates(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch candidate resumes', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [refreshTrigger]);

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete candidate ${name || `#${id}`}?`)) return;
    setDeletingId(id);
    try {
      await deleteResume(id);
      addToast(`Deleted candidate #${id}`, 'success', 'Candidate Removed');
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      if (onDataChange) onDataChange();
    } catch (err) {
      addToast(err.message || 'Failed to delete candidate', 'error', 'Deletion Error');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Sort
  const filtered = candidates.filter((item) => {
    const c = item.resume || {};
    const text = `${c.name || ''} ${c.email || ''} ${c.summary || ''} ${(c.skills || []).join(' ')}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    const nameA = (a.resume?.name || '').toLowerCase();
    const nameB = (b.resume?.name || '').toLowerCase();
    if (sortBy === 'name') return nameA.localeCompare(nameB);
    if (sortBy === 'id') return b.id - a.id;
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Candidates</h2>
          <p className="text-xs text-slate-500">Manage, analyze and screen your talent pool</p>
        </div>
        <button
          onClick={onOpenUploader}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resumes</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, skill, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-xs font-medium border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="name">Name (A-Z)</option>
              <option value="id">Latest Added</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {sorted.length} candidates
          </span>
        </div>
      </div>

      {/* Candidate Table / List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <table className="w-full text-left">
              <tbody>
                <TableRowSkeleton cols={6} />
                <TableRowSkeleton cols={6} />
                <TableRowSkeleton cols={6} />
              </tbody>
            </table>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 text-center p-6 space-y-3">
            <div className="p-3 rounded-full bg-slate-100 text-slate-400 inline-flex">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No candidates yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload candidate resumes to build your talent pool and run AI evaluations.
            </p>
            <button
              onClick={onOpenUploader}
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resumes</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-6">Contact & Location</th>
                  <th className="py-3.5 px-6">Top Skills</th>
                  <th className="py-3.5 px-6">Experience</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((item) => {
                  const c = item.resume || {};
                  const skills = c.skills || [];
                  const experience = c.experience || [];
                  const lastExp = experience[0] ? `${experience[0].role} at ${experience[0].company}` : 'N/A';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/candidates/${item.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {(c.name || 'C')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">
                              {c.name || 'Unnamed Candidate'}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400">ID #{item.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 space-y-0.5">
                        {c.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </div>
                        )}
                        {c.location && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{c.location}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px]"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 4 && (
                            <span className="text-[10px] text-slate-400 font-medium self-center">
                              +{skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                        {lastExp}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/candidates/${item.id}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, item.id, c.name)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Candidate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidates;
