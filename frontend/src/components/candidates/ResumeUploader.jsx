import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { uploadResumes } from '../../api/candidates';
import { useToast } from '../ui/ToastContext';

export function ResumeUploader({ isOpen, onClose, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState('idle'); // idle | uploading | extracting | structuring | complete | error
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(
      (file) => file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.txt')
    );

    if (validFiles.length < fileList.length) {
      addToast('Some files were ignored because only PDF and TXT documents are supported.', 'info', 'Unsupported Format');
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setStage('uploading');
    setResults(null);

    // Live stage transition simulation linked to backend upload call
    const stageTimer1 = setTimeout(() => setStage('extracting'), 600);
    const stageTimer2 = setTimeout(() => setStage('structuring'), 1800);

    try {
      const response = await uploadResumes(selectedFiles);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setStage('complete');
      setResults(response.resumes || []);

      const successfulCount = (response.resumes || []).filter((r) => !r.ignored && !r.error).length;
      if (successfulCount > 0) {
        addToast(`Successfully processed ${successfulCount} candidate resume(s).`, 'success', 'Resumes Uploaded');
        if (onUploadSuccess) onUploadSuccess();
      } else {
        addToast('No resumes were successfully extracted.', 'error', 'Processing Warning');
      }
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setStage('error');
      addToast(err.message || 'Failed to upload resumes.', 'error', 'Upload Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setStage('idle');
    setResults(null);
  };

  const handleClose = () => {
    if (!isProcessing) {
      handleReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Resumes</h3>
              <p className="text-xs text-slate-500">Extract candidate profiles using Hirely AI</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {stage === 'idle' && (
            <>
              {/* Drag & Drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.txt,application/pdf,text/plain"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Drag & drop resumes here, or <span className="text-indigo-600 underline">browse</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: PDF (.pdf), Text (.txt) up to 20 files at once
                </p>
              </div>

              {/* Selected Files list */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span className="font-medium truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Processing / Stages */}
          {isProcessing && (
            <div className="py-8 space-y-6 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  ✦ Hirely AI is processing resumes...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Extracting candidate experiences, skills, and qualifications.
                </p>
              </div>

              {/* Stage Stepper */}
              <div className="grid grid-cols-4 gap-2 px-4 pt-2">
                {[
                  { key: 'uploading', label: 'Uploading' },
                  { key: 'extracting', label: 'Extracting Text' },
                  { key: 'structuring', label: 'Structuring AI' },
                  { key: 'complete', label: 'Complete' },
                ].map((st, i) => {
                  const stagesOrder = ['uploading', 'extracting', 'structuring', 'complete'];
                  const currentIndex = stagesOrder.indexOf(stage);
                  const isCurrent = st.key === stage;
                  const isDone = currentIndex > i;

                  return (
                    <div key={st.key} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`h-2 w-full rounded-full transition-all ${
                          isDone
                            ? 'bg-emerald-500'
                            : isCurrent
                            ? 'bg-indigo-600 animate-pulse'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-semibold ${
                          isCurrent
                            ? 'text-indigo-600'
                            : isDone
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Summary */}
          {stage === 'complete' && results && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Processing Finished</h4>
                  <p className="text-xs text-emerald-700">
                    Finished processing {results.length} document(s).
                  </p>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2">
                {results.map((res, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      res.ignored || res.error
                        ? 'border-amber-200 bg-amber-50/60'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {res.filename}
                      </span>
                    </div>
                    {res.ignored ? (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                        Ignored: {res.reason}
                      </span>
                    ) : res.error ? (
                      <span className="text-[11px] font-medium text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md shrink-0">
                        {res.error}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                        Extracted ({res.resume?.name || 'Candidate'})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 'error' && (
            <div className="py-6 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-rose-50 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Upload Encountered an Error</h4>
              <p className="text-xs text-slate-500">
                Please verify that the backend server is running and try again.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          {stage === 'idle' ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs hover:bg-indigo-600 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Process with AI ({selectedFiles.length})</span>
              </button>
            </>
          ) : (
            <div className="ml-auto">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
