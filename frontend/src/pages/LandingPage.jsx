import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Users,
  FileText,
  Briefcase,
  X,
  ChevronRight,
  Building,
  GraduationCap,
  Award,
  Layers,
  Search,
  Check,
  Send,
  Zap,
} from "lucide-react";

// =========================================================================
// CLEAN FLAT VECTOR ILLUSTRATIONS (Nexcent Style)
// =========================================================================

function HeroRecruiterIllustration() {
  return (
    <svg
      viewBox="0 0 540 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-lg mx-auto select-none"
    >
      {/* Base shadow & floor */}
      <ellipse cx="270" cy="390" rx="230" ry="20" fill="#E8F5E9" opacity="0.8" />
      <ellipse cx="270" cy="390" rx="160" ry="12" fill="#C8E6C9" opacity="0.5" />

      {/* Monitor Stand */}
      <path d="M220 340 L240 370 H270 L250 340 Z" fill="#90A4AE" />
      <path d="M200 370 H290 V378 H200 Z" fill="#78909C" rx="4" />

      {/* Monitor Frame */}
      <rect x="110" y="100" width="270" height="230" rx="14" fill="#263238" />
      <rect x="120" y="112" width="250" height="196" rx="8" fill="#FFFFFF" />

      {/* Monitor Header Bar */}
      <rect x="120" y="112" width="250" height="24" rx="8" fill="#F5F7FA" />
      <circle cx="132" cy="124" r="3.5" fill="#EF5350" />
      <circle cx="143" cy="124" r="3.5" fill="#FFCA28" />
      <circle cx="154" cy="124" r="3.5" fill="#66BB6A" />

      {/* Dashboard Screen Content - Flowchart & Candidate Pipeline */}
      <rect x="130" y="146" width="60" height="24" rx="4" fill="#E8F5E9" />
      <rect x="136" y="153" width="30" height="4" rx="2" fill="#4CAF4F" />
      <rect x="136" y="160" width="45" height="3" rx="1.5" fill="#81C784" />

      {/* Flowchart Arrow 1 */}
      <path d="M190 158 H210" stroke="#81C784" strokeWidth="2" strokeDasharray="3 2" />

      <rect x="210" y="146" width="65" height="24" rx="4" fill="#E8F5E9" />
      <rect x="216" y="153" width="36" height="4" rx="2" fill="#388E3C" />
      <rect x="216" y="160" width="48" height="3" rx="1.5" fill="#81C784" />

      {/* Flowchart Arrow 2 */}
      <path d="M242 170 V190" stroke="#81C784" strokeWidth="2" strokeDasharray="3 2" />

      <rect x="210" y="190" width="65" height="24" rx="4" fill="#4CAF4F" />
      <rect x="216" y="198" width="42" height="4" rx="2" fill="#FFFFFF" />
      <rect x="216" y="205" width="30" height="3" rx="1.5" fill="#E8F5E9" />

      {/* Left sidebar on screen */}
      <rect x="130" y="180" width="60" height="116" rx="4" fill="#F5F7FA" />
      <circle cx="142" cy="195" r="5" fill="#4CAF4F" />
      <rect x="152" y="193" width="30" height="4" rx="2" fill="#78909C" />

      <circle cx="142" cy="215" r="5" fill="#81C784" />
      <rect x="152" y="213" width="26" height="4" rx="2" fill="#78909C" />

      <circle cx="142" cy="235" r="5" fill="#81C784" />
      <rect x="152" y="233" width="32" height="4" rx="2" fill="#78909C" />

      {/* Candidate Score Card on screen */}
      <rect x="200" y="226" width="160" height="70" rx="6" fill="#F1F8E9" stroke="#C8E6C9" strokeWidth="1.5" />
      <circle cx="225" cy="256" r="16" fill="#4CAF4F" />
      <text x="225" y="261" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">88%</text>
      <rect x="250" y="244" width="70" height="6" rx="3" fill="#263238" />
      <rect x="250" y="255" width="95" height="4" rx="2" fill="#78909C" />
      <rect x="250" y="264" width="50" height="12" rx="3" fill="#C8E6C9" />
      <text x="275" y="273" fill="#2E7D32" fontSize="8" fontWeight="bold" textAnchor="middle">VERIFIED</text>

      {/* Code bracket pill on left */}
      <g transform="translate(85, 230)">
        <rect width="36" height="36" rx="10" fill="#4CAF4F" />
        <path d="M16 13 L11 18 L16 23" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 13 L25 18 L20 23" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating Gear Accent */}
      <circle cx="280" cy="355" r="14" fill="#E0E0E0" />
      <circle cx="280" cy="355" r="7" fill="#FFFFFF" />

      {/* Human Recruiter Character (Right) */}
      <g transform="translate(330, 140)">
        {/* Head & Hair */}
        <ellipse cx="60" cy="35" rx="16" ry="18" fill="#FFCCBC" />
        <path d="M46 30 C46 16, 74 16, 74 30 C72 20, 52 20, 46 30 Z" fill="#263238" />
        <path d="M46 26 C44 34, 48 38, 52 38" stroke="#263238" strokeWidth="2" strokeLinecap="round" />

        {/* Torso & Green Shirt */}
        <path d="M42 55 L78 55 L84 135 L36 135 Z" fill="#4CAF4F" rx="6" />
        {/* Collar */}
        <path d="M54 55 L60 66 L66 55 Z" fill="#E8F5E9" />

        {/* Trousers */}
        <path d="M38 135 H82 V220 H62 V165 H58 V220 H38 Z" fill="#37474F" />

        {/* Shoes */}
        <rect x="34" y="215" width="26" height="10" rx="4" fill="#263238" />
        <rect x="60" y="215" width="26" height="10" rx="4" fill="#263238" />

        {/* Left Arm holding laptop */}
        <path d="M44 65 L15 95 L30 115 L52 85" fill="#43A047" />
        <circle cx="15" cy="100" r="6" fill="#FFCCBC" />

        {/* Right Arm supporting laptop */}
        <path d="M76 65 L40 100" stroke="#388E3C" strokeWidth="10" strokeLinecap="round" />
        <circle cx="38" cy="102" r="6" fill="#FFCCBC" />

        {/* Laptop/Tablet in Hands */}
        <rect x="8" y="90" width="46" height="28" rx="4" fill="#ECEFF1" transform="rotate(-15 8 90)" />
        <rect x="12" y="94" width="38" height="20" rx="2" fill="#81C784" transform="rotate(-15 8 90)" />
      </g>

      {/* Floating Checkmark Pill (Top Right) */}
      <g transform="translate(380, 95)">
        <rect width="28" height="28" rx="8" fill="#4CAF4F" />
        <path d="M8 14 L12 18 L20 10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function FeatureReviewIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md mx-auto select-none"
    >
      {/* Floor ellipse */}
      <ellipse cx="240" cy="320" rx="180" ry="16" fill="#E8F5E9" />

      {/* Large Candidate Clipboard Sheet */}
      <rect x="160" y="60" width="190" height="240" rx="12" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
      <rect x="220" y="50" width="70" height="18" rx="5" fill="#90A4AE" />
      <circle cx="255" cy="56" r="3" fill="#FFFFFF" />

      {/* Clipboard Candidate Content */}
      <rect x="180" y="86" width="36" height="36" rx="8" fill="#4CAF4F" />
      <text x="198" y="108" fill="#FFFFFF" fontSize="15" fontWeight="bold" textAnchor="middle">✓</text>
      <rect x="225" y="90" width="85" height="8" rx="4" fill="#263238" />
      <rect x="225" y="104" width="60" height="5" rx="2.5" fill="#90A4AE" />

      {/* Divider */}
      <line x1="180" y1="135" x2="330" y2="135" stroke="#ECEFF1" strokeWidth="1.5" />

      {/* Check rows */}
      <rect x="180" y="150" width="14" height="14" rx="4" fill="#E8F5E9" stroke="#4CAF4F" strokeWidth="1.5" />
      <path d="M183 157 L186 160 L191 154" stroke="#4CAF4F" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="202" y="154" width="95" height="6" rx="3" fill="#546E7A" />

      <rect x="180" y="175" width="14" height="14" rx="4" fill="#E8F5E9" stroke="#4CAF4F" strokeWidth="1.5" />
      <path d="M183 182 L186 185 L191 179" stroke="#4CAF4F" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="202" y="179" width="110" height="6" rx="3" fill="#546E7A" />

      <rect x="180" y="200" width="14" height="14" rx="4" fill="#E8F5E9" stroke="#4CAF4F" strokeWidth="1.5" />
      <path d="M183 207 L186 210 L191 204" stroke="#4CAF4F" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="202" y="204" width="80" height="6" rx="3" fill="#546E7A" />

      {/* Green Action Bar */}
      <rect x="180" y="235" width="150" height="32" rx="6" fill="#4CAF4F" />
      <text x="255" y="255" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Shortlist Candidate</text>

      {/* Human Character holding phone */}
      <g transform="translate(80, 110)">
        <ellipse cx="40" cy="30" rx="14" ry="16" fill="#FFCCBC" />
        <path d="M28 24 C28 12, 52 12, 52 24 C50 16, 34 16, 28 24 Z" fill="#263238" />
        <path d="M26 48 L54 48 L58 120 L22 120 Z" fill="#388E3C" rx="5" />
        <path d="M24 120 H56 V190 H44 V145 H38 V190 H24 Z" fill="#37474F" />
        {/* Arm holding stylus */}
        <path d="M48 55 L75 80" stroke="#2E7D32" strokeWidth="8" strokeLinecap="round" />
        <circle cx="78" cy="83" r="5" fill="#FFCCBC" />
        <line x1="75" y1="80" x2="88" y2="70" stroke="#4CAF4F" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function FeatureMobileIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md mx-auto select-none"
    >
      <ellipse cx="240" cy="320" rx="180" ry="16" fill="#E8F5E9" />

      {/* Giant Smartphone Mockup */}
      <rect x="170" y="45" width="160" height="270" rx="24" fill="#263238" />
      <rect x="178" y="55" width="144" height="250" rx="18" fill="#FFFFFF" />

      {/* Speaker notch */}
      <rect x="220" y="62" width="60" height="4" rx="2" fill="#ECEFF1" />

      {/* App Header */}
      <rect x="188" y="76" width="24" height="24" rx="6" fill="#4CAF4F" />
      <text x="200" y="92" fill="#FFFFFF" fontSize="12" fontWeight="black" textAnchor="middle">R</text>
      <rect x="220" y="82" width="60" height="6" rx="3" fill="#263238" />
      <rect x="220" y="91" width="40" height="4" rx="2" fill="#90A4AE" />

      {/* Candidate Card 1 */}
      <rect x="188" y="115" width="124" height="54" rx="8" fill="#F5F7FA" stroke="#CFD8DC" />
      <circle cx="206" cy="142" r="10" fill="#4CAF4F" />
      <text x="206" y="146" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">92</text>
      <rect x="224" y="132" width="65" height="5" rx="2.5" fill="#263238" />
      <rect x="224" y="141" width="45" height="4" rx="2" fill="#90A4AE" />
      <rect x="224" y="150" width="30" height="8" rx="2" fill="#C8E6C9" />

      {/* Candidate Card 2 */}
      <rect x="188" y="178" width="124" height="54" rx="8" fill="#F5F7FA" stroke="#CFD8DC" />
      <circle cx="206" cy="205" r="10" fill="#81C784" />
      <text x="206" y="209" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">85</text>
      <rect x="224" y="195" width="60" height="5" rx="2.5" fill="#263238" />
      <rect x="224" y="204" width="50" height="4" rx="2" fill="#90A4AE" />
      <rect x="224" y="213" width="35" height="8" rx="2" fill="#C8E6C9" />

      {/* Compare Button */}
      <rect x="188" y="244" width="124" height="26" rx="6" fill="#4CAF4F" />
      <text x="250" y="260" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Compare Contenders →</text>

      {/* Recruiter Girl with Tablet */}
      <g transform="translate(60, 110)">
        <ellipse cx="40" cy="30" rx="14" ry="16" fill="#FFCCBC" />
        <path d="M26 22 C26 10, 54 10, 54 22 C52 14, 32 14, 26 22 Z" fill="#263238" />
        <path d="M26 48 L54 48 L58 120 L22 120 Z" fill="#4CAF4F" rx="5" />
        <path d="M24 120 H56 V190 H44 V145 H38 V190 H24 Z" fill="#37474F" />
        <path d="M50 60 L78 90" stroke="#388E3C" strokeWidth="8" strokeLinecap="round" />
        <circle cx="80" cy="92" r="5" fill="#FFCCBC" />
      </g>
    </svg>
  );
}

// =========================================================================
// MAIN LANDING PAGE COMPONENT (NEXCENT STYLE)
// =========================================================================

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("recruiter@recruvo.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "who-we-help", label: "Who We Help" },
    { id: "pipeline", label: "Features" },
    { id: "metrics", label: "Impact" },
  ];

  // Scroll spy to highlight current active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 72;
      const top = element.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsLoginOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFakeLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      try {
        localStorage.setItem("recruvo_authenticated", "true");
        localStorage.setItem(
          "recruvo_user",
          JSON.stringify({
            name: email.split("@")[0] || "Recruiter",
            email: email || "recruiter@recruvo.com",
            role: "Lead Talent Specialist",
          })
        );
      } catch (err) {
        // ignore
      }
      setIsLoading(false);
      navigate("/dashboard");
    }, 400);
  };

  const handleQuickAccess = () => {
    setEmail("recruiter@recruvo.com");
    setPassword("demo-access");
    handleFakeLogin();
  };

  return (
    <div className="min-h-screen bg-white text-[#263238] font-sans selection:bg-[#E8F5E9] selection:text-[#2E7D32]">
      {/* ===================================================================== */}
      {/* 1. TOP NAVBAR (NEXCENT STYLE) */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#ECEFF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-[#4CAF4F] text-white flex items-center justify-center font-black text-base shadow-xs">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-[#263238]">
              Recruvo
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`transition-all duration-150 relative py-1 cursor-pointer ${
                    isActive
                      ? "text-[#4CAF4F] font-bold"
                      : "text-[#4D5E80] hover:text-[#263238] font-medium"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4CAF4F] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="text-sm font-semibold text-[#4CAF4F] hover:text-[#388E3C] px-3.5 py-2 transition cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#4CAF4F] hover:bg-[#43A047] text-white text-sm font-semibold px-5 py-2.5 rounded-md shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. HERO SECTION (NEXCENT CLEAN SPLIT) */}
      {/* ===================================================================== */}
      <section id="home" className="bg-[#F5F7FA] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#263238] leading-[1.15]">
                Candidate screening and hiring{" "}
                <span className="text-[#4CAF4F] block">made simple and fast</span>
              </h1>

              <p className="text-base text-[#717171] max-w-xl leading-relaxed">
                Where talent acquisition meets precision: screen resumes against job requirements, verify candidate skills, compare finalists side-by-side, and make confident shortlisting decisions.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#4CAF4F] hover:bg-[#43A047] text-white font-semibold text-sm px-7 py-3.5 rounded-md shadow-sm transition cursor-pointer"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={handleQuickAccess}
                  className="bg-white hover:bg-slate-50 text-[#263238] border border-[#CFD8DC] font-semibold text-sm px-6 py-3.5 rounded-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>Quick Demo Login</span>
                  <ArrowRight className="w-4 h-4 text-[#4CAF4F]" />
                </button>
              </div>

              {/* Carousel Dot Indicators (Nexcent Touch) */}
              <div className="flex items-center gap-2 pt-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF4F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8E6C9]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8E6C9]" />
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <HeroRecruiterIllustration />
            </div>
          </div>
        </div>
      </section>



      {/* ===================================================================== */}
      {/* 4. MANAGE YOUR ENTIRE HIRING IN A SINGLE SYSTEM (3 CARDS) */}
      {/* ===================================================================== */}
      <section id="who-we-help" className="py-20 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] max-w-lg mx-auto leading-tight">
            Manage your entire recruitment in a single system
          </h2>
          <p className="text-sm text-[#717171] mt-2">
            Who is Recruvo suitable for?
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-8 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center mb-4">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#263238]">Talent Acquisition</h3>
              <p className="text-xs text-[#717171] mt-3 leading-relaxed">
                Automate high-volume resume parsing, extract verified competencies, and eliminate screening bottlenecks without manual spreadsheet fatigue.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-8 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#263238]">Hiring Managers</h3>
              <p className="text-xs text-[#717171] mt-3 leading-relaxed">
                Directly compare top shortlisted finalists side-by-side across technical skills, seniority tenure, and tailored interview questions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-8 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#263238]">Placement Cells</h3>
              <p className="text-xs text-[#717171] mt-3 leading-relaxed">
                Organize university placement drives, benchmark candidate skill matrices, and export formal PDF dossiers for company selection panels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. FEATURE ROW 1 (ILLUSTRATION LEFT, TEXT RIGHT) */}
      {/* ===================================================================== */}
      <section id="pipeline" className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <FeatureReviewIllustration />
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] leading-tight">
                The unseen friction of spending hours on manual resume screening
              </h2>
              <p className="text-sm text-[#717171] leading-relaxed">
                Recruiters evaluate over 150 unstructured resumes per job requisition, suffering from severe split-attention fatigue between job descriptions and documents. Recruvo deconstructs raw resumes into a structured 5-pillar profile: Executive Overview, Skills Matrix, Experience Timeline, Education, and Tailored Interview Questions.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#4CAF4F] hover:bg-[#43A047] text-white font-semibold text-sm px-6 py-3 rounded-md transition cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. STATS & METRICS ROW (NEXCENT STYLE COUNTER) */}
      {/* ===================================================================== */}
      <section id="metrics" className="py-16 bg-white border-y border-[#ECEFF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Title */}
            <div className="lg:col-span-5 text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] leading-tight">
                Helping hiring teams{" "}
                <span className="text-[#4CAF4F] block">reinvent screening speed</span>
              </h2>
              <p className="text-sm text-[#717171] mt-2">
                Evaluated through rigorous usability benchmarking and user testing
              </p>
            </div>

            {/* Right 2x2 Stats Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-8 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#263238]">2,245+</p>
                  <p className="text-xs text-[#717171]">Resumes Processed</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#263238]">46+</p>
                  <p className="text-xs text-[#717171]">Job Requisitions</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#263238]">86.5</p>
                  <p className="text-xs text-[#717171]">System Usability Score</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8F5E9] text-[#4CAF4F] flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#263238]">72%</p>
                  <p className="text-xs text-[#717171]">Screening Time Saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. FEATURE ROW 2 (TEXT LEFT, ILLUSTRATION RIGHT) */}
      {/* ===================================================================== */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Text */}
            <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] leading-tight">
                How to evaluate candidate trade-offs and prepare interview rounds
              </h2>
              <p className="text-sm text-[#717171] leading-relaxed">
                When two finalists possess differing strengths, Recruvo delivers side-by-side parity: compare Candidate A vs Candidate B on verified technical depth, project scope, and qualification matches. Download formal PDF dossiers and structured CSV spreadsheets with a single click.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#4CAF4F] hover:bg-[#43A047] text-white font-semibold text-sm px-6 py-3 rounded-md transition cursor-pointer"
                >
                  Explore Platform
                </button>
              </div>
            </div>

            {/* Right Graphic */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <FeatureMobileIllustration />
            </div>
          </div>
        </div>
      </section>



      {/* ===================================================================== */}
      {/* 9. BOTTOM CALL TO ACTION BANNER */}
      {/* ===================================================================== */}
      <section className="py-16 bg-[#F5F7FA] text-center border-t border-[#ECEFF1]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#263238] leading-tight">
            Ready to streamline your candidate screening?
          </h2>
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#4CAF4F] hover:bg-[#43A047] text-white font-semibold text-sm px-8 py-3.5 rounded-md shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>Get a Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 10. CLEAN DARK CORPORATE FOOTER (NEXCENT STYLE) */}
      {/* ===================================================================== */}
      <footer className="bg-[#263238] text-[#ECEFF1] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            {/* Col 1: Brand */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#4CAF4F] text-white flex items-center justify-center font-black text-sm">
                  R
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Recruvo
                </span>
              </div>
              <p className="text-xs text-[#B0BEC5] max-w-sm leading-relaxed">
                Copyright © 2026 Recruvo Platform Ltd.<br />
                All rights reserved. CSE4012 UI/UX Capstone Project Evaluation.
              </p>
            </div>

            {/* Col 2: Company */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-sm font-semibold text-white">Company</p>
              <ul className="space-y-2 text-xs text-[#B0BEC5]">
                <li><a href="#home" className="hover:text-white transition">About us</a></li>
                <li><a href="#pipeline" className="hover:text-white transition">Features</a></li>
                <li><a href="#metrics" className="hover:text-white transition">Impact</a></li>
                <li><a href="#who-we-help" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>

            {/* Col 3: Support & Quick Auth */}
            <div className="md:col-span-4 space-y-3">
              <p className="text-sm font-semibold text-white">Evaluation Access</p>
              <p className="text-xs text-[#B0BEC5]">
                Click below to launch the candidate screening workspace.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#4CAF4F] hover:bg-[#43A047] text-white text-xs font-bold px-4 py-2.5 rounded-md transition cursor-pointer"
                >
                  Sign In to Workspace →
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* 11. CLEAN CORPORATE LOGIN MODAL (NEXCENT STYLE) */}
      {/* ===================================================================== */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263238]/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#CFD8DC]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-[#78909C] hover:text-[#263238] hover:bg-[#F5F7FA] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brand Title */}
            <div className="flex items-center gap-2.5 mb-1 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#4CAF4F] text-white flex items-center justify-center font-bold text-sm">
                R
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#263238]">Sign in to Recruvo</h3>
                <p className="text-xs text-[#717171]">Recruiter Workspace Access</p>
              </div>
            </div>

            {/* Demo Notice Banner */}
            <div className="my-4 p-3 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs text-left">
              <p className="font-semibold">Demo Evaluation Mode</p>
              <p className="text-[11px] mt-0.5 text-[#388E3C]">
                Click <strong>Sign In</strong> with any email or password to enter the application.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFakeLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#37474F] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#90A4AE] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CFD8DC] text-xs text-[#263238] focus:outline-none focus:border-[#4CAF4F] focus:ring-1 focus:ring-[#4CAF4F] transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#37474F] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#90A4AE] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CFD8DC] text-xs text-[#263238] focus:outline-none focus:border-[#4CAF4F] focus:ring-1 focus:ring-[#4CAF4F] transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-md bg-[#4CAF4F] hover:bg-[#43A047] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 pt-3 border-t border-[#ECEFF1] text-center">
              <button
                type="button"
                onClick={handleQuickAccess}
                disabled={isLoading}
                className="w-full py-2 rounded-md bg-[#F5F7FA] hover:bg-[#ECEFF1] text-[#263238] text-xs font-semibold transition cursor-pointer"
              >
                Instant 1-Click Demo Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
