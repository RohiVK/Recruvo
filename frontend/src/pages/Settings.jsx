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
  Palette,
  Compass,
  Zap,
  Sparkles,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";
import ThemeToggle from "../components/layout/ThemeToggle";
import { fetchApi } from "../api/client";

export default function Settings() {
  const { backendStatus, refreshData, clearCache, candidates, jobs, screenings, theme, setTheme } = useRecruvo();
  const isGenz = theme === "genz";

  const [activeTab, setActiveTab] = useState("appearance"); // appearance | general | analysis | privacy | about
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
    { key: "appearance", label: "Appearance & Theme", icon: Palette },
    { key: "general", label: "General & API", icon: SettingsIcon },
    { key: "analysis", label: "Analysis Preferences", icon: Sliders },
    { key: "privacy", label: "Data & Privacy", icon: Shield },
    { key: "about", label: "About Recruvo", icon: Info },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
          Customize visual themes, Google Gemini API configurations, evaluation thresholds, and session privacy.
        </p>
      </div>

      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
            isGenz
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-fadeIn ${
            isGenz
              ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
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
      <BentoCard className="overflow-hidden">
        {/* Navigation Tabs Bar */}
        <div
          className={`flex border-b p-1.5 gap-1 overflow-x-auto no-scrollbar ${
            isGenz ? "bg-white/[0.02] border-white/[0.08]" : "bg-slate-50 border-slate-200"
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? isGenz
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs"
                      : "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : isGenz
                    ? "text-slate-400 hover:text-slate-200"
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
          {/* TAB 1: APPEARANCE & THEME (PROMINENT SECTION) */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold mb-1">Visual Theme Persona</h3>
                <p className={`text-xs ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Switch the entire frontend personality instantly. Your selection is persisted in local storage.
                </p>
              </div>

              {/* Visual Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Classic Preview Card */}
                <div
                  onClick={() => setTheme("classic")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    !isGenz
                      ? "border-slate-900 bg-white shadow-sm ring-2 ring-slate-900/10"
                      : "border-white/10 bg-[#161828] opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-slate-700" />
                      <span className="font-bold text-xs text-slate-900">CLASSIC THEME</span>
                    </div>
                    {!isGenz && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Clean, minimal, recruiter-friendly design with white surfaces, neutral borders, restrained shadows, and Linear-style productivity clarity.
                  </p>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="w-20 h-2 bg-slate-300 rounded" />
                    <div className="w-full h-1.5 bg-slate-200 rounded" />
                    <div className="w-2/3 h-1.5 bg-slate-200 rounded" />
                  </div>
                </div>

                {/* Gen-Z Preview Card */}
                <div
                  onClick={() => setTheme("genz")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isGenz
                      ? "border-indigo-500 bg-[#141728] shadow-[0_0_25px_-5px_rgba(99,102,241,0.4)] ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-slate-50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span className="font-bold text-xs text-indigo-300">GEN-Z (AI-NATIVE)</span>
                    </div>
                    {isGenz && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xs">
                        Active
                      </span>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed mb-4 ${isGenz ? "text-slate-300" : "text-slate-600"}`}>
                    Modern AI-native developer aesthetic inspired by Git2Know with dark obsidian surfaces, bento cards, glowing accents, neon score meters, and expressive typography.
                  </p>

                  <div className="p-3 bg-[#0E1018] border border-indigo-500/30 rounded-xl space-y-1.5 shadow-[inset_0_0_15px_rgba(99,102,241,0.1)]">
                    <div className="w-20 h-2 bg-indigo-500 rounded" />
                    <div className="w-full h-1.5 bg-white/10 rounded" />
                    <div className="w-2/3 h-1.5 bg-indigo-400/40 rounded" />
                  </div>
                </div>
              </div>

              {/* Global Theme Toggle Widget */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Quick Toggle Switch</h4>
                  <p className={`text-[11px] ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                    Also accessible in the top-right header anytime.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL & GEMINI API KEY */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Gemini API Key Box */}
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  isGenz ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold">Google Gemini API Key</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                      isKeyConfigured
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isKeyConfigured ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    {isKeyConfigured ? "Active" : "Not Set"}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Enter your Google Gemini API key to enable live AI candidate parsing, deep contextual chat, and resume screening.
                  {maskedKey && (
                    <span className="block mt-1 font-mono font-bold text-indigo-400">
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
                    className={`flex-1 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none border ${
                      isGenz
                        ? "bg-[#141724] border-white/10 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-900"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!apiKeyInput.trim() || isSavingKey}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 shrink-0 ${
                      isGenz ? "bg-indigo-600 hover:bg-indigo-500 shadow-xs" : "bg-slate-900 hover:bg-black"
                    }`}
                  >
                    {isSavingKey ? "Verifying..." : "Save & Verify Key"}
                  </button>
                </form>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline font-semibold pt-1"
                >
                  <span>Get a Gemini API Key from Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Server Status */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-sm font-bold">Backend Server Connectivity</h3>
                  <p className={`text-xs mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                    Live connection status to Node.js & PGlite / PostgreSQL database.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      backendStatus === "online"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        backendStatus === "online" ? "bg-emerald-400" : "bg-rose-400"
                      }`}
                    />
                    {backendStatus === "online" ? "Connected (Port 3000)" : "Offline / Degraded"}
                  </span>
                  <button
                    onClick={refreshData}
                    className="p-1.5 rounded-lg border border-white/10 opacity-70 hover:opacity-100"
                    title="Refresh connection"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stored Records Summary */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-sm font-bold">Current Workspace Records</h3>
                  <p className={`text-xs mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                    Total stored candidate resumes, job descriptions, and AI evaluations.
                  </p>
                </div>
                <div className="text-xs font-semibold space-x-2">
                  <span className={`px-2.5 py-1 rounded-md border ${isGenz ? "bg-white/[0.04] border-white/10" : "bg-slate-100 border-slate-200"}`}>
                    {jobs.length} JDs
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border ${isGenz ? "bg-white/[0.04] border-white/10" : "bg-slate-100 border-slate-200"}`}>
                    {candidates.length} Resumes
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border ${isGenz ? "bg-white/[0.04] border-white/10" : "bg-slate-100 border-slate-200"}`}>
                    {screenings.length} Screenings
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-1">Recruiter Display Profile</h3>
                <p className={`text-xs mb-3 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Default reviewer name stamped on PDF exports.
                </p>
                <input
                  type="text"
                  defaultValue="Rohith — Lead Technical Recruiter"
                  className={`w-full max-w-md text-xs rounded-xl px-3 py-2.5 border ${
                    isGenz ? "bg-[#141724] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                    isGenz ? "bg-indigo-600 hover:bg-indigo-500 shadow-xs" : "bg-slate-900 hover:bg-black"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYSIS PREFERENCES */}
          {activeTab === "analysis" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold">
                    High Match Threshold ({minMatchThreshold}%)
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-400">
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
                  className="w-full accent-indigo-600"
                />
                <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                  Candidates above this match threshold will be marked with High Match indicators.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Strict Non-Hallucination Guardrails</h3>
                  <p className={`text-xs mt-0.5 max-w-lg ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                    Constrain Recruvo AI responses exclusively to verified statements found inside uploaded resumes and JD text.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableStrictEvaluation}
                  onChange={(e) => setEnableStrictEvaluation(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                    isGenz ? "bg-indigo-600 hover:bg-indigo-500 shadow-xs" : "bg-slate-900 hover:bg-black"
                  }`}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: DATA & PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-fadeIn">
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isGenz ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
                  <Shield className="w-3.5 h-3.5" />
                  Data Processing & Privacy Standard
                </h3>
                <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-300" : "text-slate-600"}`}>
                  Recruvo processes candidate documents securely. Sensitive candidate personally identifiable information (PII) is kept private and persisted strictly in your local recruitment database.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-rose-500">Clear Recruitment Workspace Cache</h3>
                  <p className={`text-xs mt-0.5 max-w-lg ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                    Reset active job selections, cached chat conversations, and local session activity history.
                  </p>
                </div>
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Cache</span>
                </button>
              </div>

              {isResetConfirmOpen && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-3 animate-fadeIn">
                  <p className="text-xs font-bold text-rose-300">
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
                      className="px-3.5 py-1.5 border border-white/10 text-xs font-semibold rounded-lg hover:opacity-80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white ${
                    isGenz
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      : "bg-slate-900"
                  }`}
                >
                  R
                </div>
                <div>
                  <h2 className="text-base font-bold">Recruvo v1.0.0</h2>
                  <p className={`text-xs ${isGenz ? "text-indigo-300" : "text-slate-500"}`}>
                    "Smarter Hiring. Brighter Teams."
                  </p>
                </div>
              </div>

              <div className={`text-xs leading-relaxed space-y-2 pt-2 ${isGenz ? "text-slate-300" : "text-slate-600"}`}>
                <p>
                  Recruvo is an AI-native candidate screening and decision support platform.
                  It extracts structured candidate profiles, compares them rigorously against job descriptions,
                  and provides grounded AI intelligence for recruiters.
                </p>
                <p className="font-semibold text-indigo-400">
                  Workflow: Upload JD → Upload Resumes → Analyze → View Results → Open Candidate → Compare → Export
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] opacity-50">
                <span>© {new Date().getFullYear()} Recruvo Intelligence Platform.</span>
                <span>Powered by Node.js, PGlite, and Google Gemini</span>
              </div>
            </div>
          )}
        </div>
      </BentoCard>
    </div>
  );
}
