import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Layers,
  HelpCircle,
  Download,
  Share2,
  Users,
  Calendar,
  Zap,
  RefreshCw,
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import RecruvoAIChat from "../components/ai/RecruvoAIChat";
import BentoCard from "../components/ui/BentoCard";
import ScoreIndicator from "../components/ui/ScoreIndicator";
import { exportSingleCandidatePDF } from "../api/exports";
import { SkeletonCandidateDetails } from "../components/ui/Skeleton";

export default function CandidateAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidates, screenings, activeJob, runScreening, theme, isLoading, isVibe } = useRecruvo();
  const isGenz = isVibe;

  const [activeTab, setActiveTab] = useState("overview"); // overview | skills | experience | education | recommendations
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Find candidate by route param id
  const candidateRecord = candidates.find((c) => String(c.id) === String(id));
  const candidate = candidateRecord?.resume || candidateRecord || null;

  // Find associated screening for this candidate
  const screening = (screenings || []).find((s) => String(s.resume_id) === String(id));

  const scorePct = screening?.score !== undefined && screening?.score !== null
    ? Math.round(screening.score * 10)
    : null;

  const techScorePct = screening?.technicalScore
    ? Math.round(screening.technicalScore * 10)
    : scorePct;
  const expScorePct = screening?.experienceScore
    ? Math.round(screening.experienceScore * 10)
    : scorePct;
  const eduScorePct = screening?.educationScore
    ? Math.round(screening.educationScore * 10)
    : scorePct;
  const projScorePct = screening?.projectScore
    ? Math.round(screening.projectScore * 10)
    : scorePct;

  const handleEvaluate = async () => {
    if (!activeJob?.id || !id) return;
    setIsEvaluating(true);
    try {
      await runScreening(Number(id), activeJob.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const tabs = [
    { key: "overview", label: "Executive Overview" },
    { key: "skills", label: "Skills Matrix" },
    { key: "experience", label: "Work Experience" },
    { key: "education", label: "Education & Projects" },
    { key: "recommendations", label: "Recommendations & Prep" },
  ];

  // If data is still loading from backend, show full skeleton loader
  if (isLoading || (!candidateRecord && isLoading)) {
    return <SkeletonCandidateDetails />;
  }

  if (!candidateRecord) {
    return (
      <BentoCard className="p-12 text-center max-w-lg mx-auto mt-12">
        <h2 className="text-base font-bold mb-2">Candidate Not Found</h2>
        <p className={`text-xs mb-4 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
          The requested candidate profile ID #{id} was not found in the database.
        </p>
        <button
          type="button"
          onClick={() => navigate("/analysis")}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
            isGenz ? "bg-indigo-600 hover:bg-indigo-500 shadow-xs" : "bg-slate-900 hover:bg-black"
          }`}
        >
          Return to Analysis Results
        </button>
      </BentoCard>
    );
  }

  const name = candidate.name || `Candidate #${id}`;
  const role = candidate.experience?.[0]?.role || "Candidate Profile";
  const email = candidate.email || "No email provided";
  const phone = candidate.phone || "No phone provided";
  const location = candidate.location || "Location not specified";
  const matchingSkills = screening?.matching_skills || screening?.matchingSkills || candidate.skills || [];
  const missingSkills = screening?.missing_skills || screening?.missingSkills || [];
  const strengths = screening?.strengths || [];
  const weaknesses = screening?.weaknesses || [];

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Nav & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/analysis")}
          className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
            isGenz
              ? "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/10"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Analysis Results</span>
        </button>

        <div className="flex items-center gap-2">
          {screening && activeJob && (
            <button
              onClick={() =>
                exportSingleCandidatePDF({
                  candidate: candidateRecord,
                  screening,
                  job: activeJob,
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isGenz
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                  : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export PDF Report</span>
            </button>
          )}

          <NavLink
            to="/compare"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all bg-[#4CAF4F] text-white hover:bg-[#43A047] shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Compare Candidate</span>
          </NavLink>
        </div>
      </div>

      {/* Candidate Profile Hero Card */}
      <BentoCard
        highlight={isGenz}
        className={`p-6 md:p-8 relative overflow-hidden ${
          isGenz
            ? "bg-gradient-to-br from-[#121528] via-[#14172B] to-[#0F111F] border-indigo-500/30"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shrink-0 bg-[#4CAF4F] text-white shadow-xs">
              {name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#263238]">{name}</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]">
                  ID #{id}
                </span>
              </div>

              <p className="text-xs md:text-sm font-semibold text-[#4D5E80]">
                {role}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#717171]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#4CAF4F]" />
                  {email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#4CAF4F]" />
                  {phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#4CAF4F]" />
                  {location}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Match Score Gauge */}
          <div className="flex items-center gap-6 self-end lg:self-center">
            {scorePct !== null ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span
                    className={`text-3xl font-black font-mono leading-none block ${
                      scorePct >= 80
                        ? "text-[#2E7D32]"
                        : scorePct >= 60
                        ? "text-[#4CAF4F]"
                        : "text-amber-500"
                    }`}
                  >
                    {scorePct}%
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
                    Overall Fit Score
                  </span>
                </div>
                <ScoreIndicator score={scorePct} size="xl" showRing={true} label="" />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-white shadow-xs bg-[#4CAF4F] hover:bg-[#43A047] transition-all cursor-pointer"
              >
                {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>Run Candidate Evaluation</span>
              </button>
            )}
          </div>
        </div>
      </BentoCard>

      {/* Category Pillar Metrics Grid */}
      {scorePct !== null && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <BentoCard className="p-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider opacity-60 block mb-1">
              Technical Fit
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black font-mono">{techScorePct || scorePct}%</span>
              <span className="text-xs text-emerald-400 font-bold">Verified</span>
            </div>
            <ScoreIndicator score={techScorePct || scorePct} size="sm" showRing={false} label="" />
          </BentoCard>

          <BentoCard className="p-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider opacity-60 block mb-1">
              Experience Seniority
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black font-mono">{expScorePct || scorePct}%</span>
              <span className="text-xs text-indigo-400 font-bold">Requisite</span>
            </div>
            <ScoreIndicator score={expScorePct || scorePct} size="sm" showRing={false} label="" />
          </BentoCard>

          <BentoCard className="p-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider opacity-60 block mb-1">
              Education & Academia
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black font-mono">{eduScorePct || scorePct}%</span>
              <span className="text-xs text-purple-400 font-bold">Academic</span>
            </div>
            <ScoreIndicator score={eduScorePct || scorePct} size="sm" showRing={false} label="" />
          </BentoCard>

          <BentoCard className="p-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider opacity-60 block mb-1">
              Project Track Record
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black font-mono">{projScorePct || scorePct}%</span>
              <span className="text-xs text-cyan-400 font-bold">Hands-on</span>
            </div>
            <ScoreIndicator score={projScorePct || scorePct} size="sm" showRing={false} label="" />
          </BentoCard>
        </div>
      )}

      {/* Main 2-Column Grid: 5-Tab Detailed Analysis on Left (8 cols) + Contextual AI Chat on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 5-Tab Deep Dive Container */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto no-scrollbar bg-white border-[#ECEFF1]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-[#4CAF4F] text-white shadow-xs font-bold"
                    : "text-[#717171] hover:text-[#263238] hover:bg-[#E8F5E9]/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Candidate Summary Card */}
              <BentoCard className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2 text-slate-800">
                  <Award className="w-4 h-4 text-slate-700" />
                  Executive Screening Summary
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-slate-700">
                  {screening?.summary ||
                    screening?.reason ||
                    candidate.summary ||
                    "Candidate demonstrates relevant experience matching key technical criteria for this role."}
                </p>
              </BentoCard>

              {/* Strengths & Weaknesses 2-Column Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <BentoCard className="p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Strengths
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {strengths.length > 0 ? (
                      strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))
                    ) : (
                      matchingSkills.slice(0, 4).map((sk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>Demonstrated hands-on experience in {sk}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </BentoCard>

                {/* Gaps to Probe */}
                <BentoCard className="p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    Identified Gaps to Probe
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((sk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{sk} (Stated in JD requirements, not explicitly verified on resume)</span>
                        </li>
                      ))
                    ) : (
                      <li className="opacity-60 italic">No critical technical gaps flagged against the active JD.</li>
                    )}
                  </ul>
                </BentoCard>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS MATRIX */}
          {activeTab === "skills" && (
            <div className="space-y-4 animate-fadeIn">
              <BentoCard className="p-6 space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    Matching Skills with Active JD ({matchingSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                          isGenz
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        }`}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {missingSkills.length > 0 && (
                  <div className="pt-4 border-t border-white/[0.06]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      Missing JD Skills / Gap Areas ({missingSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                            isGenz
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          ⚠ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.06]">
                  <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-3">
                    All Extracted Candidate Skills ({(candidate.skills || []).length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(candidate.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          isGenz
                            ? "bg-white/[0.04] border-white/10 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </BentoCard>
            </div>
          )}

          {/* TAB 3: WORK EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-4 animate-fadeIn">
              <BentoCard className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Chronological Career Experience
                </h3>

                <div className="space-y-4">
                  {(candidate.experience || []).length === 0 ? (
                    <p className="text-xs opacity-60">No work experience entries recorded on resume.</p>
                  ) : (
                    (candidate.experience || []).map((exp, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          isGenz ? "bg-white/[0.02] border-white/[0.08]" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="text-sm font-bold">{exp.role || "Role"}</h4>
                          <span className="text-[11px] font-mono opacity-60 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {exp.start_date || exp.duration || "Duration"} {exp.end_date ? `– ${exp.end_date}` : ""}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold mb-2 ${isGenz ? "text-indigo-300" : "text-slate-600"}`}>
                          {exp.company || "Company"}
                        </p>
                        {exp.description && (
                          <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-300" : "text-slate-600"}`}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </BentoCard>
            </div>
          )}

          {/* TAB 4: EDUCATION & PROJECTS */}
          {activeTab === "education" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Education */}
              <BentoCard className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 text-purple-400">
                  <GraduationCap className="w-4 h-4" />
                  Educational Credentials
                </h3>
                <div className="space-y-3">
                  {(candidate.education || []).map((edu, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs ${
                        isGenz ? "bg-white/[0.02] border-white/[0.08]" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{edu.degree || edu.field || "Degree"}</span>
                        <span className="font-mono opacity-60">{edu.year || edu.start_year || ""}</span>
                      </div>
                      <p className="opacity-70 mt-0.5">{edu.institution || "Institution"}</p>
                    </div>
                  ))}
                </div>
              </BentoCard>

              {/* Projects */}
              <BentoCard className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 text-cyan-400">
                  <Award className="w-4 h-4" />
                  Key Projects & Portfolios
                </h3>
                <div className="space-y-3">
                  {(candidate.projects || []).length === 0 ? (
                    <p className="text-xs opacity-60">No specific project records extracted.</p>
                  ) : (
                    (candidate.projects || []).map((proj, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs ${
                          isGenz ? "bg-white/[0.02] border-white/[0.08]" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <h4 className="font-bold">{proj.name || "Project"}</h4>
                        <p className="opacity-80 mt-1 leading-relaxed">{proj.description}</p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.technologies.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                  isGenz ? "bg-white/[0.05] border-white/10" : "bg-slate-100 border-slate-200"
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </BentoCard>
            </div>
          )}

          {/* TAB 5: RECOMMENDATIONS & INTERVIEW QUESTIONS */}
          {activeTab === "recommendations" && (
            <div className="space-y-4 animate-fadeIn">
              <BentoCard className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 text-indigo-400">
                  <HelpCircle className="w-4 h-4" />
                  Tailored Technical & Behavioral Interview Framework
                </h3>
                <p className="text-xs mb-4 text-slate-500">
                  Questions targeted at evaluating {name}'s architecture decisions and validating flagged skill areas.
                </p>

                <div className="space-y-3">
                  {(screening?.interview_questions || screening?.interviewQuestions || []).length > 0 ? (
                    (screening.interview_questions || screening.interviewQuestions).map((q, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed bg-slate-50 border-slate-200"
                      >
                        <span className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5 bg-[#4CAF4F] text-white">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-800">{q}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-800">
                        1. Can you explain your hands-on architecture decisions when developing with {matchingSkills[0] || "your core framework"}?
                      </div>
                      <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-800">
                        2. The role requires experience with {missingSkills[0] || "cloud infrastructure"} — how would you bridge any gaps in this area?
                      </div>
                      <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-800">
                        3. Walk me through a challenging production issue or latency bottleneck you diagnosed and resolved.
                      </div>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>
          )}
        </div>

        {/* Right Side: Candidate Contextual Chat Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <RecruvoAIChat
            title={`Candidate Inquiry — ${name}`}
            candidateId={Number(id)}
            candidateName={name}
            initialSuggestions={[
              "Summarize candidate",
              "Why is this a strong match?",
              "What skills are missing?",
              "Suggest interview questions",
              "What are the biggest concerns?",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
