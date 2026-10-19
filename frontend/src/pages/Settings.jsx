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
import BentoCard from "../components/ui/BentoCard";
import { fetchApi } from "../api/client";

export default function Settings() {
  const { backendStatus, refreshData, clearCache, candidates, jobs, screenings } = useRecruvo();

  const [activeTab, setActiveTab] = useState("general"); // general | analysis | privacy | about
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
      setErrorMessage(err.message || "Failed to update Gemini API key");
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleSavePreferences = () => {
    setToastMessage("Preferences updated successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearSession = () => {
    clearCache();
    setIsResetConfirmOpen(false);
    setToastMessage("Workspace cache, active JD selection, and session history cleared successfully!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const tabs = [
    { key: "general", label: "General & API", icon: SettingsIcon },
    { key: "analysis", label: "Analysis Preferences", icon: Sliders },
    { key: "privacy", label: "Data & Privacy", icon: Shield },
    { key: "about", label: "About Recruvo", icon: Info },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
        <p className="text-xs md:text-sm mt-0.5 text-slate-500">
          Configure Google Gemini API connections, evaluation scoring thresholds, and workspace privacy.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-fadeIn bg-emerald-50 border-emerald-200 text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl border text-xs flex items-center justify-between animate-fadeIn bg-rose-50 border-rose-200 text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Card Container */}
      <BentoCard className="overflow-hidden border border-slate-200/80 bg-white">
        {/* Navigation Tabs Bar */}
        <div className="flex border-b p-1.5 gap-1 overflow-x-auto no-scrollbar bg-slate-50/80 border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 md:p-8">
          {/* TAB: GENERAL & GEMINI API KEY */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Gemini API Key Box */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900">Google Gemini API Key</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
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

                <p className="text-xs leading-relaxed text-slate-600">
                  Enter your Google Gemini API key to enable candidate parsing, structured evaluation, and deep contextual inquiry.
                  {maskedKey && (
                    <span className="block mt-1 font-mono font-bold text-slate-800">
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
                    className="flex-1 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none border bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!apiKeyInput.trim() || isSavingKey}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 shrink-0 bg-slate-900 hover:bg-slate-800"
                  >
                    {isSavingKey ? "Verifying..." : "Save & Verify Key"}
                  </button>
                </form>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-900 font-semibold pt-1"
                >
                  <span>Get an API Key from Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Server Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Backend Server Connectivity</h3>
                  <p className="text-xs mt-0.5 text-slate-500">
                    Live connection status to Node.js & local database.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      backendStatus === "online"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        backendStatus === "online" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {backendStatus === "online" ? "Connected (Port 3000)" : "Offline / Degraded"}
                  </span>
                  <button
                    onClick={refreshData}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    title="Refresh connection"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stored Records Summary */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Workspace Records</h3>
                  <p className="text-xs mt-0.5 text-slate-500">
                    Total stored candidate resumes, job descriptions, and evaluations.
                  </p>
                </div>
                <div className="text-xs font-semibold space-x-2">
                  <span className="px-2.5 py-1 rounded-md border bg-slate-50 border-slate-200 text-slate-700">
                    {jobs.length} JDs
                  </span>
                  <span className="px-2.5 py-1 rounded-md border bg-slate-50 border-slate-200 text-slate-700">
                    {candidates.length} Resumes
                  </span>
                  <span className="px-2.5 py-1 rounded-md border bg-slate-50 border-slate-200 text-slate-700">
                    {screenings.length} Screenings
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Recruiter Display Profile</h3>
                <p className="text-xs mb-3 text-slate-500">
                  Default reviewer name stamped on PDF exports and evaluation summaries.
                </p>
                <input
                  type="text"
                  defaultValue="Rohith — Lead Technical Recruiter"
                  className="w-full max-w-md text-xs rounded-xl px-3 py-2.5 border bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all bg-slate-900 hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB: ANALYSIS PREFERENCES */}
          {activeTab === "analysis" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-900">
                    High Match Threshold ({minMatchThreshold}%)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-700">
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
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <p className="text-xs mt-1 text-slate-500">
                  Candidates meeting or exceeding this match percentage will receive prioritized high-tier badges.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Strict Non-Hallucination Guardrails</h3>
                  <p className="text-xs mt-0.5 max-w-lg text-slate-500">
                    Constrain candidate evaluations strictly to verified statements found inside uploaded resumes and JD text.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableStrictEvaluation}
                  onChange={(e) => setEnableStrictEvaluation(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all bg-slate-900 hover:bg-slate-800"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* TAB: DATA & PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800">
                  <Shield className="w-3.5 h-3.5 text-slate-700" />
                  Data Processing & Privacy Standard
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Recruvo processes candidate documents securely. Sensitive candidate personally identifiable information (PII) is kept private and persisted strictly in your local recruitment database.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-rose-600">Clear Recruitment Workspace Cache</h3>
                  <p className="text-xs mt-0.5 max-w-lg text-slate-500">
                    Reset active job selections, cached inquiry conversations, and local session activity history.
                  </p>
                </div>
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Cache</span>
                </button>
              </div>

              {isResetConfirmOpen && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-fadeIn">
                  <p className="text-xs font-bold text-rose-900">
                    Are you sure you want to reset your local session data?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearSession}
                      className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="px-3.5 py-1.5 border border-slate-300 bg-white text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white bg-slate-900">
                  R
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recruvo v1.0.0</h2>
                  <p className="text-xs text-slate-500">
                    Smarter Hiring. Brighter Teams.
                  </p>
                </div>
              </div>

              <div className="text-xs leading-relaxed space-y-2 pt-2 text-slate-600">
                <p>
                  Recruvo is a candidate screening and decision support platform.
                  It extracts structured candidate profiles, compares them against job descriptions,
                  and provides grounded intelligence for talent acquisition teams.
                </p>
                <p className="font-semibold text-slate-800">
                  Workflow: Upload JD → Upload Resumes → Analyze → View Results → Open Candidate → Compare → Export
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>© {new Date().getFullYear()} Recruvo Recruitment Platform.</span>
                <span>Powered by Node.js, PGlite, and Google Gemini</span>
              </div>
            </div>
          )}
        </div>
      </BentoCard>
    </div>
  );
}
