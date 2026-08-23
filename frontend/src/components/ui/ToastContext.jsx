import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all transform translate-y-0 duration-300 ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-slate-800'
                : toast.type === 'error'
                ? 'bg-white border-rose-200 text-slate-800'
                : 'bg-white border-indigo-200 text-slate-800'
            }`}
          >
            {toast.type === 'success' && (
              <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="rounded-lg bg-rose-50 p-1.5 text-rose-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 shrink-0">
                <Info className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0 pt-0.5">
              {toast.title && <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{toast.title}</h4>}
              <p className="text-sm font-medium text-slate-800 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
