import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, User, Building, MapPin, RefreshCw, 
  AlertCircle, ArrowRight, Lock, Sparkles,
  Cpu, Terminal, Globe, Key, FileCode, Check
} from "lucide-react";
import { completeUserOnboarding, recordLoginTelemetry } from "../firebase";

interface MandatoryOnboardingModalProps {
  user: any;
  onComplete: (updatedUser: any) => void;
}

const SPECIALIZATIONS = [
  {
    id: "webapp-security",
    title: "Web App Security",
    desc: "OWASP Top 10, SQLi, XSS, SSRF, IDOR & API Pentesting",
    icon: Globe
  },
  {
    id: "red-teaming",
    title: "Offensive Red Teaming",
    desc: "Perimeter breach, lateral movement & Active Directory exploits",
    icon: Terminal
  },
  {
    id: "bug-bounty",
    title: "Bug Bounty & Research",
    desc: "Reconnaissance, logic flaws, zero-days & responsible disclosure",
    icon: Sparkles
  },
  {
    id: "cloud-defense",
    title: "Cloud Infrastructure",
    desc: "AWS/GCP IAM auditing, Kubernetes & microsegmentation",
    icon: Cpu
  },
  {
    id: "cryptography",
    title: "Cryptography & Auth",
    desc: "PKI, token verification, JWT signature cracking & protocol flaws",
    icon: Key
  },
  {
    id: "devsecops",
    title: "DevSecOps & Code Audit",
    desc: "SAST/DAST, automated scanning, secret scanning & CI/CD",
    icon: FileCode
  }
];

const EXPERIENCE_LEVELS = [
  { id: "student", label: "Apprentice / Student", sub: "Building fundamentals" },
  { id: "practitioner", label: "Security Practitioner", sub: "1–3 years active security" },
  { id: "senior", label: "Senior Pentester", sub: "Advanced adversary emulation" },
  { id: "lead", label: "Security Lead / Architect", sub: "Enterprise governance" }
];

const GOALS = [
  { id: "labs", label: "Solve Vulnerability Labs" },
  { id: "authoring", label: "Publish Research Writeups" },
  { id: "certification", label: "WonderCave Certifications" },
  { id: "team", label: "Enterprise Upskilling" }
];

export default function MandatoryOnboardingModal({ user, onComplete }: MandatoryOnboardingModalProps) {
  const [fullName, setFullName] = useState(user.name || "");
  const [organization, setOrganization] = useState(user.organization || "");
  const [country, setCountry] = useState(user.country || "United States");
  const [specialization, setSpecialization] = useState(SPECIALIZATIONS[0].id);
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[1].id);
  const [primaryGoal, setPrimaryGoal] = useState(GOALS[0].id);

  // Dynamic Captcha for First Login
  const [captchaNum1, setCaptchaNum1] = useState(24);
  const [captchaNum2, setCaptchaNum2] = useState(17);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 40) + 12;
    const n2 = Math.floor(Math.random() * 30) + 7;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaAnswer("");
    setCaptchaError("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError("");
    setSubmissionError("");

    // Validate Captcha
    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer.trim(), 10) !== expected) {
      setCaptchaError(`Verification failed: ${captchaNum1} + ${captchaNum2} = ${expected}. Enter the correct sum.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: fullName.trim() || user.name,
        displayName: fullName.trim() || user.name,
        organization: organization.trim() || "Independent Researcher",
        country: country.trim() || "Global",
        specialization,
        experience,
        primaryGoal,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to Firestore if available
      try {
        await completeUserOnboarding(user.id, payload);
      } catch (err) {
        console.warn("Firestore onboarding notice:", err);
      }

      // 2. Save to local backend API
      try {
        await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch {
        // Fallback
      }

      // 3. Record login telemetry
      try {
        await recordLoginTelemetry(user, user.role || "member");
      } catch (err) {
        console.warn("Telemetry record notice:", err);
      }

      // 4. Update session
      const updatedUser = {
        ...user,
        ...payload,
        onboardingCompleted: true
      };
      localStorage.setItem("sc_user", JSON.stringify(updatedUser));
      onComplete(updatedUser);
    } catch (err: any) {
      console.error("Onboarding submission failed:", err);
      setSubmissionError(err.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center min-h-screen py-4 sm:py-8 font-sans">
      <div className="w-full max-w-3xl bg-[#E9ECEF] border-2 border-slate-900 shadow-2xl rounded-none overflow-hidden my-auto">
        
        {/* Modal Header - Mobile Optimized */}
        <div className="bg-[#111A4D] text-white p-4 sm:p-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] mb-1">
                <ShieldCheck size={14} className="shrink-0" />
                <span>Mandatory Security Verification</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                WonderCave Researcher Profile
              </h2>
            </div>
            <span className="inline-block bg-white/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-emerald-300 border border-white/20 shrink-0">
              FIRST LOGIN REQUIREMENT
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Please register your researcher handle and cybersecurity track before accessing WonderCave interactive labs.
          </p>
        </div>

        {/* Modal Body Form - Responsive Padding & Touch-Friendly Sizing */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 space-y-4 sm:space-y-5">
          
          {submissionError && (
            <div className="p-3 sm:p-4 bg-red-100 border border-red-300 text-red-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-white p-3.5 sm:p-5 border border-slate-300 shadow-none space-y-3 sm:space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>1. Researcher Identity & Affiliation</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Full Name / Handle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Organization / University / Lab
                </label>
                <div className="relative">
                  <Building size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. SecLab, Stanford, Independent"
                    className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Region / Operational Country
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Global, United States, Germany, Japan"
                  className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Specialization (Clean Responsive Grid) */}
          <div className="bg-white p-3.5 sm:p-5 border border-slate-300 shadow-none">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                2. Primary Cybersecurity Track
              </h3>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Select 1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
              {SPECIALIZATIONS.map((spec) => {
                const IconComponent = spec.icon;
                const isSelected = specialization === spec.id;
                return (
                  <button
                    type="button"
                    key={spec.id}
                    onClick={() => setSpecialization(spec.id)}
                    className={`text-left p-3 border transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? "border-[#111A4D] bg-[#111A4D]/5 shadow-sm ring-1 ring-[#111A4D]" 
                        : "border-slate-200 bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <IconComponent size={16} className={isSelected ? "text-[#FF5A36]" : "text-slate-600"} />
                        {isSelected && <Check size={13} className="text-[#111A4D] font-bold" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5">{spec.title}</h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug">{spec.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Experience & Objectives */}
          <div className="bg-white p-3.5 sm:p-5 border border-slate-300 shadow-none space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Technical Experience Tier
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXPERIENCE_LEVELS.map((lvl) => {
                  const isSelected = experience === lvl.id;
                  return (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setExperience(lvl.id)}
                      className={`text-left p-2.5 sm:p-3 border transition-colors flex items-center gap-2.5 cursor-pointer ${
                        isSelected 
                          ? "border-[#111A4D] bg-slate-100 ring-1 ring-[#111A4D]" 
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${isSelected ? "border-[#111A4D] bg-[#111A4D]" : "border-slate-400"}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{lvl.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{lvl.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
                4. Primary Objective
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOALS.map((g) => {
                  const isSelected = primaryGoal === g.id;
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setPrimaryGoal(g.id)}
                      className={`text-left px-3 py-2 border text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? "border-[#111A4D] bg-[#111A4D] text-white" 
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      <span className="truncate">{g.label}</span>
                      {isSelected && <Check size={13} className="text-emerald-300 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: First Login Security Captcha (Fully Responsive for Android) */}
          <div className="bg-amber-50/80 border border-amber-300 p-3.5 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-900 mb-1">
              <Lock size={14} className="text-amber-700 shrink-0" />
              <span>5. Anti-Bot Security Verification</span>
            </div>
            <p className="text-xs text-amber-800 mb-3">
              Solve this mathematical challenge to verify human session:
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <div className="bg-slate-900 text-white font-mono font-bold text-sm sm:text-base px-4 py-2 sm:py-2.5 tracking-wider border border-slate-700 flex items-center justify-center gap-2 select-none shrink-0">
                <span className="text-[#FF5A36]">{captchaNum1}</span>
                <span className="text-slate-400">+</span>
                <span className="text-emerald-400">{captchaNum2}</span>
                <span className="text-slate-400">=</span>
                <span className="text-slate-500">?</span>
              </div>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError("");
                  }}
                  placeholder="Enter answer"
                  className="w-full bg-white border border-slate-400 px-3 py-2 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  title="Generate new challenge"
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 border border-slate-300 flex items-center justify-center transition-colors shrink-0 cursor-pointer min-w-[40px]"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {captchaError && (
              <p className="text-xs font-bold text-red-600 mt-2 font-mono flex items-center gap-1.5">
                <AlertCircle size={13} className="shrink-0" />
                <span>{captchaError}</span>
              </p>
            )}
          </div>

          {/* Action Buttons - Fully Responsive */}
          <div className="pt-2 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-slate-300">
            <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 text-center sm:text-left">
              Session & credentials synced to secure audit ledger
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div 
                    className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"
                    style={{ borderRadius: "100%" }}
                  ></div>
                  <span>Verifying & Initializing...</span>
                </>
              ) : (
                <>
                  <span>Complete Verification & Enter WonderCave</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
