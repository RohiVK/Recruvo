import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Users, Briefcase, Sparkles, Upload, Plus, ArrowRight, X } from 'lucide-react';

export function CommandPalette({ isOpen, onClose, onOpenUploader }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'candidates',
      title: 'Candidates Workspace',
      subtitle: 'View, search, and manage candidate resumes',
      icon: Users,
      action: () => { navigate('/candidates'); onClose(); }
    },
    {
      id: 'upload',
      title: 'Upload Resumes',
      subtitle: 'Drag & drop PDFs or text resumes into Hirely',
      icon: Upload,
      action: () => { onClose(); if (onOpenUploader) onOpenUploader(); }
    },
    {
      id: 'jobs',
      title: 'Job Roles',
      subtitle: 'Explore job requirements and candidate matches',
      icon: Briefcase,
      action: () => { navigate('/jobs'); onClose(); }
    },
    {
      id: 'create-job',
      title: 'Create Job Role',
      subtitle: 'Parse a new job description with Hirely AI',
      icon: Plus,
      action: () => { navigate('/jobs?action=create'); onClose(); }
    },
    {
      id: 'screenings',
      title: 'Screening Workspace',
      subtitle: 'Analyze AI candidate match scores and reasoning',
      icon: Sparkles,
      action: () => { navigate('/screenings'); onClose(); }
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        <div className="flex items-center px-4 border-b border-slate-100 py-3">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none"
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="ml-2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 font-medium">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition group-hover:translate-x-0.5" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Hirely Command Palette</span>
          <div className="flex items-center gap-2">
            <span>Navigation Shortcuts</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white rounded border border-slate-200 text-slate-600">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
