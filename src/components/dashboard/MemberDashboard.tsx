import React, { useState, useEffect, useRef } from "react";
import { 
  LogOut, Shield, Terminal, Send, Eye, Edit3, 
  Clock, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, 
  FileText, Sparkles, Monitor, Globe, Laptop, ArrowRight,
  Trash2, Image as ImageIcon, Bold, Italic, Heading, Code, 
  List, ListOrdered, Quote, Link2, Copy, Check, Award,
  Key, UserCheck, Activity, Download, Plus, X, Layers
} from "lucide-react";
import Markdown from "react-markdown";
import Seo from "../layout/Seo";
import { 
  submitPostForReviewApi, fetchPostSubmissions, 
  requestPostDeletionApi, requestPostEditApi 
} from "../../services/api";
import { 
  auth, signOut, submitPostForReview, 
  requestPostDeletion, requestPostEdit 
} from "../../firebase";

interface MemberDashboardProps {
  user: any;
  onLogout: () => void;
}

const LABS = [
  {
    id: "sqli",
    title: "SQL Injection Sandbox",
    difficulty: "PRACTITIONER",
    category: "Database Security",
    desc: "Exploit union-based & blind time-delay vulnerabilities against live Postgres backends.",
    status: "Active Lab",
    url: "/topics/sql-injection",
    xp: 100,
    badge: "SQLi Specialist"
  },
  {
    id: "xss",
    title: "Cross-Site Scripting (XSS)",
    difficulty: "APPRENTICE",
    category: "Client-Side Security",
    desc: "Bypass modern Content Security Policies (CSP) and craft DOM-based reflected payloads.",
    status: "Active Lab",
    url: "/topics/cross-site-scripting",
    xp: 100,
    badge: "CSP Bypass Veteran"
  },
  {
    id: "ssrf",
    title: "Server-Side Request Forgery",
    difficulty: "ADVANCED",
    category: "Cloud Metadata",
    desc: "Pivot from front-facing endpoints to query AWS/GCP internal metadata APIs.",
    status: "Active Lab",
    url: "/topics/ssrf",
    xp: 100,
    badge: "SSRF Hunter"
  },
  {
    id: "auth",
    title: "Broken Authentication & JWTs",
    difficulty: "PRACTITIONER",
    category: "Identity & Tokens",
    desc: "Inspect unsigned tokens, algorithm confusion (none/RS256), and secret brute forcing.",
    status: "Active Lab",
    url: "/topics/broken-authentication",
    xp: 100,
    badge: "Cryptanalyst"
  }
];

const PRESET_TECH_IMAGES = [
  {
    label: "Security Operations Center",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    caption: "High-security monitoring operations dashboard."
  },
  {
    label: "Kernel & Exploit Code",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    caption: "Low-level security analysis and assembly inspection."
  },
  {
    label: "Encrypted Cloud Infrastructure",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
    caption: "Distributed data center nodes with zero trust policies."
  },
  {
    label: "Network Traffic Telemetry",
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
    caption: "Fiber-optic edge routing and packet inspection."
  },
  {
    label: "Neural Model Security",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
    caption: "Adversarial prompt injection boundary testing."
  },
  {
    label: "Database Integrity Ledger",
    url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1200",
    caption: "PostgreSQL query optimizer and parameter verification."
  }
];

export default function MemberDashboard({ user, onLogout }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "submit" | "myposts" | "labs" | "profile" | "audit">("overview");
  
  // Post Authoring State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web AppSec");
  const [subtitle, setSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [tags, setTags] = useState("injection, web-security, research");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Edit Mode for existing submission
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null);

  // Deletion Request State
  const [deletionModalSub, setDeletionModalSub] = useState<any | null>(null);
  const [deletionReason, setDeletionReason] = useState("Vulnerability patched and embargoed by vendor.");
  const [customDeletionReason, setCustomDeletionReason] = useState("");
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);

  // Image Ingestion Tool State
  const [imageToolUrl, setImageToolUrl] = useState("");
  const [imageToolCaption, setImageToolCaption] = useState("");
  const [imageToolPreviewError, setImageToolPreviewError] = useState(false);

  // User's Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Challenge / Labs Solved Tracker (saved in localStorage)
  const [completedLabs, setCompletedLabs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`wc_completed_labs_${user.id || user.uid}`);
      return saved ? JSON.parse(saved) : ["sqli"];
    } catch {
      return ["sqli"];
    }
  });

  // Researcher Profile customization
  const [researcherBio, setResearcherBio] = useState(user.bio || "Active vulnerability researcher contributing to WonderCave web security advisories.");
  const [pgpKey, setPgpKey] = useState(user.pgpKey || "F10A 48E2 91D0 53B8 26AC E94B 3821 C0E7 9FA0 11C4");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [apiToken, setApiToken] = useState(() => `wc_live_${(user.id || "res").slice(0, 8)}_${Math.random().toString(36).substring(2, 10)}`);

  // Activity Ledger (Stored in localStorage)
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; action: string; time: string; detail: string }>>(() => {
    try {
      const saved = localStorage.getItem(`wc_activity_${user.id || user.uid}`);
      return saved ? JSON.parse(saved) : [
        { id: "1", action: "Session Initialized", time: new Date().toLocaleTimeString(), detail: "Authenticated via WonderCave OAuth" },
        { id: "2", action: "Lab Accessed", time: new Date(Date.now() - 3600000).toLocaleTimeString(), detail: "SQL Injection Sandbox container deployed" }
      ];
    } catch {
      return [];
    }
  });

  const addActivityLog = (action: string, detail: string) => {
    const entry = {
      id: Date.now().toString(),
      action,
      time: new Date().toLocaleTimeString(),
      detail
    };
    const updated = [entry, ...activityLogs.slice(0, 49)];
    setActivityLogs(updated);
    try {
      localStorage.setItem(`wc_activity_${user.id || user.uid}`, JSON.stringify(updated));
    } catch {}
  };

  // Client Telemetry
  const [clientIp, setClientIp] = useState("Resolving...");
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Fetch user's IP
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setClientIp(data.ip || "127.0.0.1"))
      .catch(() => setClientIp("127.0.0.1"));

    // Update time every 30s
    const timer = setInterval(() => setCurrentTime(new Date().toUTCString()), 30000);
    return () => clearInterval(timer);
  }, []);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const all = await fetchPostSubmissions();
      // Filter submissions created by this user
      const userSubs = all.filter((s: any) => 
        (s.authorEmail && s.authorEmail.toLowerCase() === (user.email || "").toLowerCase()) ||
        (s.authorId && s.authorId === user.id)
      );
      setSubmissions(userSubs);
    } catch (e) {
      console.warn("Failed to load user submissions:", e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [user.email, user.id]);

  // Insert formatting snippet into textarea at current cursor
  const insertFormatting = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setContent(prev => prev + prefix + placeholder + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const replacement = prefix + selected + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  // Submit / Save Post or Edit
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (content.trim().length < 50) {
      setSubmitError("Post body must be at least 50 characters. Provide technical details, proof-of-concept code, or context.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        authorId: user.id || user.uid,
        authorEmail: user.email || "researcher@wondercave.net",
        authorName: user.name || user.displayName || "Community Researcher",
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        tags,
        content: content.trim(),
        heroImage: heroImage.trim() || PRESET_TECH_IMAGES[0].url,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      };

      if (editingSubmissionId) {
        // Request Edit / Revision
        await requestPostEdit(editingSubmissionId, payload);
        await requestPostEditApi(editingSubmissionId, payload);
        setSubmitSuccess("Post revision submitted successfully! AnkoreTech (Admin) will review and approve your changes.");
        addActivityLog("Revision Submitted", `Edit requested for "${title}"`);
        setEditingSubmissionId(null);
      } else {
        // New Submission
        try {
          await submitPostForReview(payload);
        } catch (fbErr) {
          console.warn("Firestore post submission error:", fbErr);
        }
        await submitPostForReviewApi(payload);
        setSubmitSuccess("Post submitted successfully! It is now in the review queue for AnkoreTech (Admin) approval.");
        addActivityLog("Post Submitted", `New research writeup "${title}" sent for editorial review`);
      }

      setTitle("");
      setSubtitle("");
      setHeroImage("");
      setContent("");
      setIsPreview(false);
      await loadSubmissions();
      setActiveTab("myposts");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit post for review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Click from Submissions Tab
  const handleInitiateEdit = (sub: any) => {
    setEditingSubmissionId(sub.id);
    setTitle(sub.title || "");
    setCategory(sub.category || "Web AppSec");
    setSubtitle(sub.subtitle || "");
    setHeroImage(sub.heroImage || "");
    setTags(Array.isArray(sub.tags) ? sub.tags.join(", ") : (sub.tags || ""));
    setContent(sub.content || "");
    setActiveTab("submit");
    setSubmitSuccess(null);
    setSubmitError(null);
  };

  const cancelEdit = () => {
    setEditingSubmissionId(null);
    setTitle("");
    setSubtitle("");
    setHeroImage("");
    setContent("");
    setSubmitSuccess(null);
    setSubmitError(null);
  };

  // Handle Deletion Request
  const handleConfirmDeletionRequest = async () => {
    if (!deletionModalSub) return;
    setIsRequestingDeletion(true);
    const finalReason = customDeletionReason.trim() ? customDeletionReason.trim() : deletionReason;

    try {
      await requestPostDeletion(deletionModalSub.id, finalReason, user.email);
      await requestPostDeletionApi(deletionModalSub.id, finalReason, user.email);
      addActivityLog("Deletion Requested", `Removal requested for "${deletionModalSub.title}". Reason: ${finalReason}`);
      await loadSubmissions();
      setDeletionModalSub(null);
      setCustomDeletionReason("");
    } catch (err: any) {
      alert("Failed to submit deletion request: " + (err.message || "Unknown error"));
    } finally {
      setIsRequestingDeletion(false);
    }
  };

  // Toggle Completed Lab
  const toggleLabCompleted = (labId: string) => {
    const updated = completedLabs.includes(labId)
      ? completedLabs.filter(id => id !== labId)
      : [...completedLabs, labId];
    setCompletedLabs(updated);
    try {
      localStorage.setItem(`wc_completed_labs_${user.id || user.uid}`, JSON.stringify(updated));
    } catch {}
    const lab = LABS.find(l => l.id === labId);
    if (lab) {
      addActivityLog(
        updated.includes(labId) ? "Lab Completed" : "Lab Reset",
        `${lab.title} marked as ${updated.includes(labId) ? "solved (+100 XP)" : "in-progress"}`
      );
    }
  };

  // Insert image directly into editor
  const handleInsertImageIntoPost = (url: string, captionText: string = "Research figure") => {
    if (!url) return;
    const snippet = `\n\n![${captionText}](${url})\n*Figure: ${captionText}*\n\n`;
    setContent(prev => prev + snippet);
    setImageToolUrl("");
    setImageToolCaption("");
    addActivityLog("Media Attached", `Appended image asset to article body`);
  };

  const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const isPendingApproval = user.status === "pending_approval" || user.approved === false;

  const totalXp = completedLabs.length * 100;
  const researcherLevel = totalXp >= 400 ? "Elite Threat Hunter" : totalXp >= 200 ? "Security Penetration Tester" : "Security Apprentice";

  return (
    <div className="min-h-screen bg-[#E9ECEF] font-sans text-slate-900">
      <Seo 
        title={`Researcher Workspace — ${user.name || "WonderCave"}`} 
        description="Comprehensive cybersecurity researcher dashboard, post authoring studio, interactive sandbox labs, and telemetry audit ledger. Managed by Nayem Hasan at wondercave.nayem.net." 
      />

      {/* Top Utility Header */}
      <header className="bg-[#111A4D] text-white border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
                WonderCave
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-xs font-mono text-slate-300">Public Researcher Console</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
              Welcome, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 bg-white/10 text-emerald-300 border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award size={12} className="text-amber-400" />
              <span>{researcherLevel} ({totalXp} XP)</span>
            </span>

            {isPendingApproval ? (
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Pending Approval
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle size={11} /> Verified Researcher
              </span>
            )}

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/20 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Account Hold Notice (if applicable) */}
      {isPendingApproval && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 sm:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle size={16} className="shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wide">Account Held for Administrator Review: </span>
              Your registration is awaiting confirmation by AnkoreTech (Lead Administrator). You can draft research posts, solve labs, and test payloads. Drafts will remain queued until account verification.
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-bar */}
      <div className="bg-white border-b border-slate-300 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "overview" 
                ? "border-[#111A4D] text-[#111A4D]" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === "submit" 
                ? "border-[#111A4D] text-[#111A4D]" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Edit3 size={13} />
            <span>{editingSubmissionId ? "Edit Post Revision" : "Write & Publish"}</span>
          </button>
          <button
            onClick={() => setActiveTab("myposts")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "myposts" 
                ? "border-[#111A4D] text-[#111A4D]" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>My Research Posts</span>
            {submissions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                {submissions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("labs")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "labs" 
                ? "border-[#111A4D] text-[#111A4D]" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Terminal size={13} />
            <span>Interactive Labs ({completedLabs.length}/{LABS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "profile" 
                ? "border-[#111A4D] text-[#111A4D]" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserCheck size={13} />
            <span>Public Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "audit" 
                ? "border-[#111A4D] text-[#111A4D]" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Activity size={13} />
            <span>Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        
        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Session Telemetry Card */}
            <div className="bg-white border border-slate-300 p-5 sm:p-6 shadow-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 mb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
                    <Monitor size={15} />
                    <span>Real-time Logged Session Telemetry</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    Security Footprint & Device Telemetry
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-mono">
                  <CheckCircle size={12} className="text-emerald-600" />
                  <span>Encrypted & Linked to WonderCave Ledger</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-[#E9ECEF] border border-slate-300 p-4 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Client IP Address</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <Globe size={13} className="text-[#111A4D] shrink-0" />
                    {clientIp}
                  </span>
                </div>

                <div className="bg-[#E9ECEF] border border-slate-300 p-4 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Session UTC Clock</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <Clock size={13} className="text-[#111A4D] shrink-0" />
                    {currentTime.split(" ").slice(0, 5).join(" ")}
                  </span>
                </div>

                <div className="bg-[#E9ECEF] border border-slate-300 p-4 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Screen Display Matrix</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <Laptop size={13} className="text-[#111A4D] shrink-0" />
                    {typeof window !== "undefined" ? `${window.screen.width} × ${window.screen.height}` : "1920 × 1080"}
                  </span>
                </div>

                <div className="bg-[#E9ECEF] border border-slate-300 p-4 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Viewport & DPR</span>
                  <span className="text-sm font-bold text-slate-900 truncate block">
                    {typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight} (${window.devicePixelRatio || 1}x)` : "1440×900"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="font-mono text-[11px] text-slate-500 truncate max-w-2xl">
                  UA: {typeof navigator !== "undefined" ? navigator.userAgent : "Browser"}
                </div>
                <div className="font-mono text-[11px] text-slate-500 shrink-0">
                  Role: <span className="font-bold text-slate-800 uppercase">{user.role || "Member"}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Submission Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Author Community Writeup */}
              <div className="bg-white border border-slate-300 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <FileText size={15} className="text-[#FF5A36]" />
                    <span>Research Publishing</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Submit Writeup for Editorial Review
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Draft vulnerability analyses with our built-in HTML/Markdown styler and live preview. AnkoreTech and editor desk review before publishing.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className="inline-flex items-center gap-2 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 transition-colors cursor-pointer"
                  >
                    <span>Open Writeup Editor</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Card 2: Interactive Labs */}
              <div className="bg-white border border-slate-300 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <Terminal size={15} className="text-[#FF5A36]" />
                    <span>Hands-On Training</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Interactive Vulnerability Labs
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Solve real-world security challenges in zero-risk sandbox containers. Track your solved labs and earn verification rank.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setActiveTab("labs")}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider py-2.5 px-5 transition-colors cursor-pointer"
                  >
                    <span>Browse 4 Active Labs</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Card 3: Researcher Public Credentials */}
              <div className="bg-white border border-slate-300 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <UserCheck size={15} className="text-emerald-600" />
                    <span>Public Credentials</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Researcher ID & Verification Card
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Showcase your verified security track, PGP fingerprint, and solved challenges with a public shareable URL.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider py-2.5 px-5 transition-colors cursor-pointer"
                  >
                    <span>View Public Card</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </div>

            {/* Submissions Overview */}
            <div className="bg-white border border-slate-300 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Recent Submissions ({submissions.length})
                </h3>
                <button
                  onClick={loadSubmissions}
                  className="text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} className={loadingSubmissions ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300">
                  <p className="text-xs text-slate-500 mb-3">You haven't submitted any research posts yet.</p>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className="text-xs font-bold text-[#111A4D] hover:underline cursor-pointer"
                  >
                    Draft your first vulnerability writeup &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.slice(0, 3).map((sub) => (
                    <div key={sub.id} className="p-3.5 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{sub.title}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {sub.category} • Submitted {new Date(sub.submittedAt || sub.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.status === "approved" ? (
                          <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                            Approved & Published
                          </span>
                        ) : sub.status === "rejected" ? (
                          <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 font-mono text-[10px] font-bold uppercase">
                            Revision Needed
                          </span>
                        ) : sub.status === "deletion_requested" ? (
                          <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 font-mono text-[10px] font-bold uppercase">
                            Deletion Requested
                          </span>
                        ) : sub.status === "edit_requested" ? (
                          <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 text-blue-800 font-mono text-[10px] font-bold uppercase">
                            Revision in Review
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 font-mono text-[10px] font-bold uppercase">
                            In Admin Review
                          </span>
                        )}

                        <button
                          onClick={() => setActiveTab("myposts")}
                          className="text-[11px] font-mono text-[#111A4D] hover:underline ml-2 cursor-pointer"
                        >
                          Manage &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: WRITE & PUBLISH POST WITH HTML/MARKDOWN STYLER + IMAGE INGESTION */}
        {activeTab === "submit" && (
          <div className="bg-white border border-slate-300 p-5 sm:p-8 max-w-4xl mx-auto">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] block mb-1">
                Post Authoring Studio
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {editingSubmissionId ? "Submit Post Revision / Edit Request" : "Write & Submit a Post for Admin Review"}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {editingSubmissionId 
                  ? "You are preparing a revision for your existing post. When submitted, AnkoreTech (Admin) will review and approve the update."
                  : "Your research advisory will be submitted to AnkoreTech (Lead Administrator). Once verified, it will be published to the WonderCave live feed."}
              </p>
            </div>

            {editingSubmissionId && (
              <div className="mb-5 p-3.5 bg-blue-50 border border-blue-300 text-xs text-blue-900 flex justify-between items-center">
                <span>Editing revision for: <strong>{title || "Selected Post"}</strong></span>
                <button 
                  onClick={cancelEdit}
                  className="px-2 py-1 bg-white border border-blue-300 text-blue-800 font-bold uppercase tracking-wider text-[10px] cursor-pointer hover:bg-blue-100"
                >
                  Cancel Edit
                </button>
              </div>
            )}

            {submitSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-700 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-700 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPost} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Exploiting Time-Based Blind SQLi in Modern API Endpoints"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-slate-800"
                  >
                    <option value="Web AppSec">Web AppSec</option>
                    <option value="Injection Flaws">Injection Flaws</option>
                    <option value="Offensive Red Team">Offensive Red Team</option>
                    <option value="Cloud Defense">Cloud Defense</option>
                    <option value="Zero Trust">Zero Trust</option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="Bug Bounty Writeup">Bug Bounty Writeup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Executive Subtitle / Summary
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Brief 1-2 sentence overview of findings"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Cover Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. sqli, api-security, exploit-development"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* DEDICATED IMAGE URL INGESTION BOX */}
              <div className="p-4 bg-slate-50 border border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    <ImageIcon size={14} className="text-[#FF5A36]" />
                    <span>Image Asset & Ingestion Studio (For News & Posts)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Insert images into post</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      value={imageToolUrl}
                      onChange={(e) => {
                        setImageToolUrl(e.target.value);
                        setImageToolPreviewError(false);
                      }}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={imageToolCaption}
                      onChange={(e) => setImageToolCaption(e.target.value)}
                      placeholder="Caption / Figure label"
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                {/* Image Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={!imageToolUrl}
                    onClick={() => handleInsertImageIntoPost(imageToolUrl, imageToolCaption || "Research figure")}
                    className="px-3 py-1.5 bg-[#111A4D] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-900 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Insert into Post Body</span>
                  </button>

                  <button
                    type="button"
                    disabled={!imageToolUrl}
                    onClick={() => {
                      setHeroImage(imageToolUrl);
                      setImageToolUrl("");
                    }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Set as Cover Image
                  </button>
                </div>

                {/* Verified Presets Gallery */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                    Or select verified cybersecurity tech imagery:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TECH_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setImageToolUrl(preset.url);
                          setImageToolCaption(preset.label);
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-700 transition-colors cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ARTICLE BODY WITH FUNCTIONAL HTML/MARKDOWN STYLER TOOLBAR */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Article Body <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{charCount} chars</span>
                    <span>•</span>
                    <span>~{readTimeMinutes} min read</span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setIsPreview(!isPreview)}
                      className="font-bold text-[#111A4D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isPreview ? <Edit3 size={12} /> : <Eye size={12} />}
                      {isPreview ? "Edit Raw" : "Live Preview"}
                    </button>
                  </div>
                </div>

                {/* Functional Styler Toolbar */}
                {!isPreview && (
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-[#E9ECEF] border border-b-0 border-slate-300 text-xs">
                    <button
                      type="button"
                      onClick={() => insertFormatting("**", "**", "bold text")}
                      title="Bold (**text**)"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold transition-colors cursor-pointer"
                    >
                      <Bold size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("*", "*", "italic text")}
                      title="Italic (*text*)"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    >
                      <Italic size={13} />
                    </button>

                    <span className="w-px h-4 bg-slate-300 mx-1"></span>

                    <button
                      type="button"
                      onClick={() => insertFormatting("## ", "\n", "Heading 2")}
                      title="Heading 2 (## Title)"
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      H2
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("### ", "\n", "Heading 3")}
                      title="Heading 3 (### Subtitle)"
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      H3
                    </button>

                    <span className="w-px h-4 bg-slate-300 mx-1"></span>

                    <button
                      type="button"
                      onClick={() => insertFormatting("`", "`", "code_snippet")}
                      title="Inline Code (`code`)"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    >
                      <Code size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("```bash\n", "\n```\n", "curl -X POST https://api.target.com/v1")}
                      title="Fenced Code Block"
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-mono text-[11px] transition-colors cursor-pointer"
                    >
                      &lt;/&gt; Block
                    </button>

                    <span className="w-px h-4 bg-slate-300 mx-1"></span>

                    <button
                      type="button"
                      onClick={() => insertFormatting("> ", "\n", "Quoted security advisory notes")}
                      title="Blockquote (> Quote)"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    >
                      <Quote size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("- ", "\n", "List item")}
                      title="Unordered List (- item)"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    >
                      <List size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("1. ", "\n", "Numbered step")}
                      title="Ordered List (1. item)"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    >
                      <ListOrdered size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("[", "](https://example.com)", "Link description")}
                      title="Hyperlink"
                      className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    >
                      <Link2 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => insertFormatting("\n| Parameter | Description | Severity |\n| --- | --- | --- |\n| payload | Injected string | High |\n", "\n")}
                      title="Markdown Table"
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      Table
                    </button>
                  </div>
                )}

                {isPreview ? (
                  <div className="min-h-[280px] max-h-[500px] overflow-y-auto p-5 bg-white border border-slate-300 prose prose-slate text-xs max-w-none">
                    <Markdown>{content || "*No content written yet.*"}</Markdown>
                  </div>
                ) : (
                  <textarea
                    ref={contentTextareaRef}
                    rows={12}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your technical writeup using markdown. Use the styling toolbar above for code snippets, headings, blockquotes, lists, and tables..."
                    className="w-full bg-slate-50 border border-slate-300 p-3.5 text-xs sm:text-sm font-mono focus:outline-none focus:border-slate-800 resize-y"
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200">
                <span className="text-[11px] font-mono text-slate-500">
                  Target review queue: AnkoreTech@gmail.com
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {editingSubmissionId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div 
                          className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"
                          style={{ borderRadius: "100%" }}
                        ></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>{editingSubmissionId ? "Submit Edited Revision" : "Submit Post for Admin Review"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: MY SUBMISSIONS WITH EDIT & DELETION REQUESTS */}
        {activeTab === "myposts" && (
          <div className="bg-white border border-slate-300 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] block mb-1">
                  Submission History & Lifecycle
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  My Community Writeups ({submissions.length})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSubmissionId(null);
                    setActiveTab("submit");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111A4D] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>New Post</span>
                </button>
                <button
                  onClick={loadSubmissions}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={loadingSubmissions ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300">
                <FileText size={28} className="mx-auto text-slate-400 mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No submissions on record</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Write your first technical advisory and submit it for admin verification.
                </p>
                <button
                  onClick={() => setActiveTab("submit")}
                  className="bg-[#111A4D] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Create New Writeup
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 border border-slate-200">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-mono font-bold uppercase">
                          {sub.category || "Research"}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{sub.title}</h4>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {sub.status === "approved" ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                            Approved & Published
                          </span>
                        ) : sub.status === "rejected" ? (
                          <span className="px-2.5 py-0.5 bg-red-100 border border-red-300 text-red-800 font-mono text-[10px] font-bold uppercase">
                            Needs Revisions
                          </span>
                        ) : sub.status === "deletion_requested" ? (
                          <span className="px-2.5 py-0.5 bg-red-100 border border-red-300 text-red-800 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                            <Trash2 size={11} /> Deletion Requested
                          </span>
                        ) : sub.status === "edit_requested" ? (
                          <span className="px-2.5 py-0.5 bg-blue-100 border border-blue-300 text-blue-800 font-mono text-[10px] font-bold uppercase">
                            Revision In Review
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 font-mono text-[10px] font-bold uppercase">
                            Pending Admin Review
                          </span>
                        )}
                      </div>
                    </div>

                    {sub.subtitle && (
                      <p className="text-xs text-slate-600 mb-2">{sub.subtitle}</p>
                    )}

                    {sub.status === "deletion_requested" && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-900 my-2">
                        <strong>Deletion Request Pending:</strong> {sub.deletionReason || "Removal requested."}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>Submitted: <strong>{new Date(sub.submittedAt || sub.createdAt || Date.now()).toLocaleDateString()}</strong></span>
                        {sub.slug && <span>Slug: <code>/posts/{sub.slug}</code></span>}
                      </div>

                      {/* Management Actions: Edit Request & Deletion Request */}
                      <div className="flex items-center gap-2">
                        {sub.status !== "deletion_requested" && (
                          <>
                            <button
                              onClick={() => handleInitiateEdit(sub)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="Submit an edited revision for admin approval"
                            >
                              <Edit3 size={11} />
                              <span>Request Edit</span>
                            </button>

                            <button
                              onClick={() => setDeletionModalSub(sub)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="Request removal of this post"
                            >
                              <Trash2 size={11} />
                              <span>Request Deletion</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INTERACTIVE LABS CHALLENGE CHECKLIST */}
        {activeTab === "labs" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-300 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] block mb-1">
                  Practical Cyber Labs
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Interactive Vulnerability Sandboxes
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Deploy containerized sandbox instances to test payloads and verify defensive controls.
                </p>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-[#E9ECEF] border border-slate-300 p-3 min-w-[220px]">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-slate-600 uppercase">Progress:</span>
                  <span className="font-bold text-slate-900">{completedLabs.length} / {LABS.length} Solved</span>
                </div>
                <div className="w-full bg-slate-300 h-2 overflow-hidden mb-1">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-300" 
                    style={{ width: `${(completedLabs.length / LABS.length) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-emerald-800 font-bold">
                  {totalXp} XP Earned • {researcherLevel}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {LABS.map((lab) => {
                const isCompleted = completedLabs.includes(lab.id);
                return (
                  <div key={lab.id} className={`bg-white border p-6 flex flex-col justify-between transition-all ${
                    isCompleted ? "border-emerald-500 shadow-sm" : "border-slate-300"
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-slate-100 border border-slate-300 px-2 py-0.5 text-slate-700">
                          {lab.difficulty}
                        </span>
                        <span className="text-[11px] font-mono font-bold flex items-center gap-1 text-emerald-700">
                          {isCompleted ? <CheckCircle size={13} className="text-emerald-600" /> : null}
                          <span>{isCompleted ? "Solved & Verified" : lab.status}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1">{lab.title}</h3>
                      <span className="text-[11px] font-mono text-[#FF5A36] block mb-2">{lab.category} • +{lab.xp} XP</span>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{lab.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <a
                        href={lab.url}
                        className="inline-flex items-center gap-1.5 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 transition-colors"
                      >
                        <span>Launch Lab</span>
                        <ExternalLink size={12} />
                      </a>

                      <button
                        type="button"
                        onClick={() => toggleLabCompleted(lab.id)}
                        className={`px-3 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isCompleted 
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100" 
                            : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isCompleted ? <Check size={12} /> : null}
                        <span>{isCompleted ? "Completed" : "Mark as Solved"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: RESEARCHER PUBLIC CREDENTIALS & ID CARD */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-300 p-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] block mb-1">
                Researcher Profile
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Public Researcher Credentials & Verification Badge
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Shareable security researcher profile showing verified certifications, solved labs, and published advisories.
              </p>
            </div>

            {/* Public Digital ID Card Preview */}
            <div className="bg-[#111A4D] text-white p-6 border-2 border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-0.5">
                    WONDERCAVE SECURITY ADVISORY BOARD
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{user.name}</h3>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    {user.organization || "Independent Security Researcher"} • {user.country || "Global"}
                  </div>
                </div>

                <div className="bg-white/10 p-3 border border-white/20 text-center shrink-0">
                  <div className="text-xs font-mono uppercase text-slate-300 text-[10px]">Rank Tier</div>
                  <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">{researcherLevel}</div>
                  <div className="text-[10px] font-mono text-emerald-300 mt-0.5">{totalXp} XP Points</div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-200 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Specialization Track:</span>
                  <span className="font-semibold">{user.specialization || "Web App Security & Code Audit"}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Researcher Bio:</span>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">{researcherBio}</p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">PGP Key Fingerprint:</span>
                  <span className="text-[11px] text-amber-200">{pgpKey}</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Advisories Published: {submissions.filter(s => s.status === 'approved').length}</span>
                  <span>Managed by Nayem Hasan (wondercave.nayem.net)</span>
                </div>
              </div>
            </div>

            {/* Profile Customization Form */}
            <div className="bg-white border border-slate-300 p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Edit Public Bio & Security Keys
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Bio / Research Focus
                </label>
                <textarea
                  rows={3}
                  value={researcherBio}
                  onChange={(e) => setResearcherBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  PGP Key Fingerprint
                </label>
                <input
                  type="text"
                  value={pgpKey}
                  onChange={(e) => setPgpKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-mono focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://wondercave.nayem.net/researcher/${user.id || user.uid}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3.5 py-2 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Public Verification URL"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                      name: user.name,
                      id: user.id || user.uid,
                      email: user.email,
                      rank: researcherLevel,
                      xp: totalXp,
                      completedLabs,
                      pgpKey,
                      bio: researcherBio,
                      issuer: "WonderCave (wondercave.nayem.net / Nayem Hasan)",
                      verifiedAt: new Date().toISOString()
                    }, null, 2));
                    const dl = document.createElement("a");
                    dl.setAttribute("href", dataStr);
                    dl.setAttribute("download", `wondercave_researcher_${user.name?.toLowerCase().replace(/\s+/g, '_')}.json`);
                    dl.click();
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export Digital ID (JSON)</span>
                </button>
              </div>
            </div>

            {/* Mock API Token Generator */}
            <div className="bg-white border border-slate-300 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                <Key size={14} className="text-[#FF5A36]" />
                <span>Personal API Authentication Token</span>
              </div>
              <p className="text-xs text-slate-600">
                Use this bearer token to test WonderCave programmatic endpoints (e.g. <code>GET /api/posts</code>, <code>GET /api/products</code>):
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiToken}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-mono font-bold select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(apiToken);
                    setCopiedToken(true);
                    setTimeout(() => setCopiedToken(false), 2000);
                  }}
                  className="px-3.5 py-2 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedToken ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedToken ? "Copied" : "Copy Token"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setApiToken(`wc_live_${(user.id || "res").slice(0, 8)}_${Math.random().toString(36).substring(2, 10)}`)}
                  title="Generate new token"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT ACTIVITY LEDGER */}
        {activeTab === "audit" && (
          <div className="bg-white border border-slate-300 p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] block mb-1">
                  Audit Governance
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Researcher Session & Telemetry Audit Log
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tamper-evident activity trail recording actions, submissions, and sandbox access.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityLogs, null, 2));
                  const dl = document.createElement("a");
                  dl.setAttribute("href", dataStr);
                  dl.setAttribute("download", `wondercave_audit_${Date.now()}.json`);
                  dl.click();
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>Export Audit JSON</span>
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#E9ECEF] border border-slate-300 flex justify-between items-start gap-4">
                  <div>
                    <span className="font-bold text-[#111A4D] uppercase tracking-wider mr-2">[{log.action}]</span>
                    <span className="text-slate-700 font-sans">{log.detail}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: POST DELETION REQUEST */}
      {deletionModalSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-red-600">
                <Trash2 size={16} />
                <span>Request Post Deletion</span>
              </div>
              <button 
                onClick={() => setDeletionModalSub(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              You are requesting removal of: <strong>"{deletionModalSub.title}"</strong>.
              Advisories can only be removed after AnkoreTech (Admin) confirms the withdrawal justification.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Standard Deletion Reason
              </label>
              <select
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800"
              >
                <option value="Vulnerability patched and embargoed by vendor.">Vulnerability patched and embargoed by vendor</option>
                <option value="Author requesting redaction of private research data.">Author requesting redaction of private research data</option>
                <option value="Superseded by updated advisory with new proof-of-concept.">Superseded by updated advisory with new PoC</option>
                <option value="Duplicate or obsolete technical writeup.">Duplicate or obsolete technical writeup</option>
                <option value="Custom justification">Other / Custom explanation</option>
              </select>
            </div>

            {deletionReason === "Custom justification" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Provide Detailed Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={customDeletionReason}
                  onChange={(e) => setCustomDeletionReason(e.target.value)}
                  placeholder="Explain why this research post should be removed from WonderCave..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletionModalSub(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isRequestingDeletion}
                onClick={handleConfirmDeletionRequest}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRequestingDeletion ? "Submitting..." : "Submit Deletion Request"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
