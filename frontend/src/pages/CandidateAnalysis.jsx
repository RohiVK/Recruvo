import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import RecruvoAIChat from "../components/ai/RecruvoAIChat";
import { exportSingleCandidatePDF } from "../api/exports";

export default function CandidateAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidates, screenings, activeJob, runScreening } = useRecruvo();

  const [activeTab, setActiveTab] = useState("overview"); // overview | skills | experience | education | recommendations
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Find candidate by route param id
  const candidateRecord = candidates.find((c) => String(c.id) === String(id));
  const candidate = candidateRecord?.resume || candidateRecord || null;

  // Find associated screening for this candidate
  const screening = (screenings || []).find((s) => String(s.resume_id) === String(id));

  const scorePct = screening?.score ? Math.round(screening.score * 10) : null;
  const techScorePct = screening?.technicalScore ? Math.round(screening.technicalScore * 10) : scorePct;
  const expScorePct = screening?.experienceScore ? Math.round(screening.experienceScore * 10) : scorePct;
  const eduScorePct = screening?.educationScore ? Math.round(screening.educationScore * 10) : scorePct;
  const projScorePct = screening?.projectScore ? Math.round(screening.projectScore * 10) : scorePct;

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
    { key: "overview", label: "Overview" },
    { key: "skills", label: "Skills" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "recommendations", label: "Recommendations" },
  ];

  if (!candidateRecord) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto mt-12 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 mb-2">Candidate Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">
          The requested candidate profile ID #{id} was not found in the database.
        </p>
        <button
          onClick={() => navigate("/analysis")}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
        >
          Return to Analysis Results
        </button>
      </div>
    );
  }

  const name = candidate.name || `Candidate #${id}`;
  const role = candidate.experience?.[0]?.role || "Candidate Profile";
  const email = candidate.email || "No email provided";
  const phone = candidate.phone || "No phone provided";
  const location = candidate.location || "Location not specified";

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Back Button & Actions Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/analysis")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-1.5 rounded-lg shadow-2xs hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Results</span>
        </button>

        <div className="flex items-center gap-2">
          {screening && (
            <button
              onClick={() =>
                exportSingleCandidatePDF({
                  candidate: candidateRecord,
                  screening,
                  job: activeJob,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          )}

          <NavLink
            to="/compare"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Compare with Another</span>
          </NavLink>
        </div>
      </div>

      {/* Candidate Profile Header Card (Matching Wireframe 3) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Candidate Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300 text-gray-800 font-bold text-2xl flex items-center justify-center shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{name}</h1>
              <p className="text-xs font-semibold text-gray-600 mt-0.5">{role}</p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {phone}
                </span>
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall Match Score Card (Matching Wireframe 3) */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 min-w-[200px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Overall Match
              </span>
              {scorePct !== null && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {scorePct >= 80 ? "High Match" : scorePct >= 60 ? "Moderate Match" : "Low Match"}
                </span>
              )}
            </div>

            {scorePct !== null ? (
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{scorePct}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      scorePct >= 80 ? "bg-emerald-600" : scorePct >= 60 ? "bg-gray-900" : "bg-amber-600"
                    }`}
                    style={{ width: `${Math.min(scorePct, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !activeJob}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors w-full"
                >
                  {isEvaluating ? "Evaluating..." : "Run AI Analysis"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Tabs Content on Left (8 cols) + Contextual Recruvo AI on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 5 Tabs and Breakdown */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Tabs Navigation Header (Matching Wireframe 3) */}
          <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2 pt-2 gap-1 overflow-x-auto no-scrollbar shadow-2xs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2.5 px-4 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-gray-900 text-gray-900 bg-gray-50/80"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW (Matching Wireframe 3) */}
          {activeTab === "overview" && (
            <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl p-6 shadow-xs space-y-6">
              {/* AI Summary Card */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gray-700" />
                    AI Summary
                  </h3>
                  <span className="text-[10px] text-gray-400">Recruvo Grounded Evaluation</span>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {screening?.summary || screening?.reason || candidate.summary || (
                    <span className="text-gray-400 italic">
                      No AI summary generated yet. Click 'Run AI Analysis' to evaluate this candidate.
                    </span>
                  )}
                </div>
              </div>

              {/* Key Skills Chips (Matching Wireframe 3) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(candidate.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 border border-gray-300 text-gray-800 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!candidate.skills || candidate.skills.length === 0) && (
                    <span className="text-xs text-gray-400 italic">No specific skills listed.</span>
                  )}
                </div>
              </div>

              {/* Experience & Education Quick Badges (Matching Wireframe 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0 shadow-2xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Experience</span>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {candidate.experience?.[0]
                        ? `${candidate.experience.length} recorded position(s)`
                        : "Experience details on profile"}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {candidate.experience?.[0]
                        ? `${candidate.experience[0].role} at ${candidate.experience[0].company}`
                        : "Software development tenure"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0 shadow-2xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Education</span>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {candidate.education?.[0]?.degree || "Bachelor of Technology / Science"}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {candidate.education?.[0]?.field || candidate.education?.[0]?.institution || "Computer Science"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matching & Missing Skills (Color-coded) */}
              {screening && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Matching Skills */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Matching Skills ({screening.matchingSkills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(screening.matchingSkills || []).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {(!screening.matchingSkills || screening.matchingSkills.length === 0) && (
                        <span className="text-xs text-gray-400 italic">None specifically matched</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-amber-700" />
                      Missing Skills ({screening.missingSkills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(screening.missingSkills || []).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 text-[11px] font-medium border border-amber-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {(!screening.missingSkills || screening.missingSkills.length === 0) && (
                        <span className="text-xs text-gray-400 italic">No missing requirements</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              {screening && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Key Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {(screening.strengths || []).map((str, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Areas to Probe / Weaknesses
                    </h4>
                    <ul className="space-y-1.5">
                      {(screening.weaknesses || []).map((w, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* JD Alignment Section */}
              {screening?.reason && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    JD Alignment & Score Explanation
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{screening.reason}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === "skills" && (
            <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  All Profile Skills ({candidate.skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(candidate.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {screening && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    JD Requirements Comparison
                  </h3>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">Technical Skills Match</span>
                      <span className="font-bold text-gray-900">{techScorePct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${techScorePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Work History Timeline
              </h3>

              {(!candidate.experience || candidate.experience.length === 0) ? (
                <p className="text-xs text-gray-400 italic">No formal experience records extracted.</p>
              ) : (
                <div className="space-y-4">
                  {candidate.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{exp.role}</h4>
                          <p className="text-xs font-semibold text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-[11px] font-mono text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">
                          {exp.start_date || "Start"} — {exp.end_date || "Present"}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-gray-700 leading-relaxed pt-1 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDUCATION & PROJECTS */}
          {activeTab === "education" && (
            <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Academic Credentials
                </h3>
                {(!candidate.education || candidate.education.length === 0) ? (
                  <p className="text-xs text-gray-400 italic">No education records extracted.</p>
                ) : (
                  <div className="space-y-3">
                    {candidate.education.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{edu.degree}</h4>
                            <p className="text-xs text-gray-600">{edu.institution}</p>
                            <p className="text-[11px] text-gray-500">{edu.field}</p>
                          </div>
                          <span className="text-[11px] font-mono text-gray-400">
                            {edu.start_year || ""} — {edu.end_year || ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects */}
              {Array.isArray(candidate.projects) && candidate.projects.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Key Projects ({candidate.projects.length})
                  </h3>
                  <div className="space-y-3">
                    {candidate.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                        <h4 className="text-xs font-bold text-gray-900">{proj.name}</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">{proj.description}</p>
                        {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.technologies.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-1.5 py-0.5 rounded bg-white text-[10px] text-gray-600 border border-gray-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RECOMMENDATIONS & INTERVIEW QUESTIONS */}
          {activeTab === "recommendations" && (
            <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Tailored Interview Questions for {name}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  AI-generated questions based on candidate profile gaps, stated skills, and role criteria.
                </p>

                {screening?.interviewQuestions && screening.interviewQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {screening.interviewQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-gray-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{q}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800">
                      1. Can you walk us through how you applied your technical skills in your most recent project?
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800">
                      2. How have you addressed skill requirements like {(screening?.missingSkills || ["cloud architecture"])[0]} in past positions?
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800">
                      3. Describe a time you collaborated across departments to deliver software on time.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Contextual Recruvo AI Assistant Panel (Matching Wireframe 3) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <RecruvoAIChat
            title="Recruvo AI"
            candidateId={Number(id)}
            candidateName={name}
            initialSuggestions={[
              "Summarize this candidate",
              "Suggest interview questions",
              `Why is ${name} a good match?`,
              "What skills are missing?",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
