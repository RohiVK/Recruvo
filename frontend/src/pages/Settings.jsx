import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Info,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Key,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import { fetchApi } from "../api/client";

export default function Settings() {
  const { backendStatus, refreshData, clearSessionData, candidates, jobs, screenings } = useRecruvo();

  const [activeTab, setActiveTab] = useState("general");
  const [minMatchThreshold, setMinMatchThreshold] = useState(70);
  const [enableStrictEvaluation, setEnableStrictEvaluation] = useState(true);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Gemini API Key management
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);

  useEffect(() => {
    fetchApi("/api/settings")
      .then((data) => {
        setIsKeyConfigured(data.isConfigured);
        setMaskedKey(data.maskedKey || "");
      })
      .catch((e) => console.warn("Could not fetch settings:", e));
  }, []);

  const handleSaveGeminiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim() || isSavingKey) return;

    setIsSavingKey(true);
    setErrorMessage(null);

    try {
      const res = await fetchApi("/api/settings/gemini-key", {
        method: "POST",
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });
      setIsKeyConfigured(true);
      setMaskedKey(res.maskedKey);
      setApiKeyInput("");
      setToastMessage(res.message || "Gemini API Key saved and verified!");
      refreshData();
    } catch (err) {
      setErrorMessage(err.message || "Failed to verify Gemini API Key");
    } finally {
      setIsSavingKey(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleSavePreferences = () => {
    setToastMessage("Preferences saved successfully.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearSession = () => {
    clearCache();
    setIsResetConfirmOpen(false);
    setToastMessage("Workspace cache, active JD selection, and session history cleared successfully!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const tabs = [
    { key: "general", label: "General", icon: SettingsIcon },
    { key: "analysis", label: "Analysis Preferences", icon: Sliders },
    { key: "privacy", label: "Data & Privacy", icon: Shield },
    { key: "about", label: "About", icon: Info },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage system configurations, Google Gemini API Key, and session privacy.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-red-700 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 p-1.5 gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* TAB 1: GENERAL & GEMINI API KEY */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Gemini API Key Box */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-800" />
                    <h3 className="text-sm font-bold text-gray-900">Google Gemini API Key</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                      isKeyConfigured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isKeyConfigured ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {isKeyConfigured ? "Active" : "Not Set"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your Google Gemini API key to enable live AI candidate parsing, deep contextual chat, and resume screening.
                  {maskedKey && (
                    <span className="block mt-1 font-mono text-gray-700 font-medium">
                      Current Key: {maskedKey}
                    </span>
                  )}
                </p>

                <form onSubmit={handleSaveGeminiKey} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter GEMINI_API_KEY (e.g. AIzaSy...)"
                    className="flex-1 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={!apiKeyInput.trim() || isSavingKey}
                    className="px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold transition-colors disabled:opacity-40 shrink-0"
                  >
                    {isSavingKey ? "Verifying..." : "Save & Verify Key"}
                  </button>
                </form>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-900 font-semibold underline pt-1"
                >
                  <span>Get a Gemini API Key from Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Server Status */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Backend Server Connectivity</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live connection status to Node.js & PGlite / PostgreSQL database.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      backendStatus === "online"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        backendStatus === "online" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    {backendStatus === "online" ? "Connected (Port 3000)" : "Offline / Degraded"}
                  </span>
                  <button
                    onClick={refreshData}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    title="Refresh connection"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stored Records Summary */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Current Workspace Records</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Total stored candidate resumes, job descriptions, and AI evaluations.
                  </p>
                </div>
                <div className="text-xs font-semibold text-gray-700 space-x-2">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">{jobs.length} JDs</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                    {candidates.length} Resumes
                  </span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                    {screenings.length} Screenings
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Recruiter Display Profile</h3>
                <p className="text-xs text-gray-500 mb-3">Default reviewer name stamped on PDF exports.</p>
                <input
                  type="text"
                  defaultValue="Rohith — Lead Technical Recruiter"
                  className="w-full max-w-md text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYSIS PREFERENCES */}
          {activeTab === "analysis" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-900">
                    High Match Threshold ({minMatchThreshold}%)
                  </label>
                  <span className="text-xs font-mono font-bold text-gray-700">
                    {minMatchThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={minMatchThreshold}
                  onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                  className="w-full accent-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Candidates above this match threshold will be marked with High Match indicators.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Strict Non-Hallucination Guardrails</h3>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-lg">
                    Constrain Recruvo AI responses exclusively to verified statements found inside uploaded resumes and JD text.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableStrictEvaluation}
                  onChange={(e) => setEnableStrictEvaluation(e.target.checked)}
                  className="w-4 h-4 accent-gray-900 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DATA & PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-900" />
                  Data Processing & Privacy Standard
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Recruvo processes candidate documents securely through Google Gemini API calls.
                  Sensitive candidate personally identifiable information (PII) is kept private and stored in your local recruitment workspace.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-red-600">Clear Recruitment Workspace Cache</h3>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-lg">
                    Reset active job selections, cached chat conversations, and local session activity history.
                  </p>
                </div>
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Cache</span>
                </button>
              </div>

              {isResetConfirmOpen && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                  <p className="text-xs font-bold text-red-900">
                    Are you sure you want to reset your local session data?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearSession}
                      className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="px-3.5 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-bold text-lg flex items-center justify-center">
                  R
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Recruvo v1.0.0</h2>
                  <p className="text-xs text-gray-500">"Smarter Hiring. Brighter Teams."</p>
                </div>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed space-y-2 pt-2">
                <p>
                  Recruvo is an AI-powered resume and profile analysis system built for recruiters.
                  It extracts structured candidate profiles, compares them rigorously against job descriptions,
                  and offers contextual AI decision support.
                </p>
                <p className="font-semibold text-gray-800">
                  Workflow: Upload JD → Upload Resumes → Analyze → View Results → Open Candidate → Compare → Export
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>© {new Date().getFullYear()} Recruvo Intelligence Platform.</span>
                <span>Powered by Node.js, PGlite, and Google Gemini</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
