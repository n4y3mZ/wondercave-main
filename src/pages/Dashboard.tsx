import React, { useEffect, useState } from "react";
import { 
  fetchActivity, fetchUsers, createUser, toggleBlockUser, deleteUser, 
  updateUser, fetchPages, savePage, fetchTelemetryLogs, approveUserAccount,
  fetchPostSubmissions
} from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  LayoutDashboard, Users, Activity, LogOut, Settings, Save, RefreshCw, 
  Database, CheckCircle, ExternalLink, UserPlus, Ban, ShieldCheck, 
  Trash2, AlertTriangle, FileEdit, Copy, Check, Eye, Edit3, X, Plus,
  FileCheck, Download, Monitor, Globe, Clock, UserCheck
} from "lucide-react";
import Seo from "../components/layout/Seo";
import Markdown from "react-markdown";
import { auth, signOut } from "../firebase";
import MemberDashboard from "../components/dashboard/MemberDashboard";
import ReviewQueuePanel from "../components/dashboard/ReviewQueuePanel";
import MandatoryOnboardingModal from "../components/MandatoryOnboardingModal";

const STARTER_SHEET_CSV = `slug,title,subtitle,content,imageUrl
web-security-basics,Web Security Fundamentals,Core principles of defensive web application engineering,"## Web Security Fundamentals\\n\\nUnderstand the fundamental concepts of application security: authentication, authorization, and input validation.",https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=85&w=1200
cloud-defense-protocols,Cloud Defense Protocols,Hardening AWS and GCP production deployments,"## Cloud Defense\\n\\nImplement least-privilege IAM policies, VPC security perimeters, and continuous audit logging.",https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=85&w=1200
zero-trust-architecture,Zero Trust Architecture,Never trust, always verify every network entity,"## Zero Trust\\n\\nTransition from perimeter defense to identity-centric microsegmentation.",https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=85&w=1200`;

function DatabaseSettingsPanel() {
  const [announcement, setAnnouncement] = useState({
    show: true,
    message: "WonderCave — Free Cybersecurity Training, Now Live.",
    linkText: "Learn more →",
    linkUrl: "/learning-paths",
    backgroundColor: "bg-[#111A4D]",
    textColor: "text-white"
  });

  const [sheetUrl, setSheetUrl] = useState("https://docs.google.com/spreadsheets/d/e/2PACX-1vTSsdCfcokUgW5nLtHk4ZquGROq-RxMitDUTEgzQMTrClc3ZusFk-09kq1bXUUQgnx4IbknxU2la9XX/pub?output=csv");
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  useEffect(() => {
    fetch("/api/announcement").then(res => res.json()).then(setAnnouncement).catch(console.error);
    fetch("/api/sync-sheets").then(res => res.json()).then(setSyncStatus).catch(console.error);
  }, []);

  const handleSaveAnnouncement = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement)
      });
      alert("Announcement updated.");
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetUrl })
      });
      const data = await res.json();
      setSyncStatus(data.meta || { lastSynced: new Date().toISOString(), status: "Synchronized" });
      setSyncMessage(data.message || "Database synchronized.");
    } catch (e: any) {
      setSyncMessage("Sync completed using cached database.");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyStarterCsv = () => {
    navigator.clipboard.writeText(STARTER_SHEET_CSV);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      {/* Google Sheets Sync Box */}
      <div className="bg-white p-6 rounded-none border border-slate-300 shadow-none">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">
          <Database size={15} className="text-[#FF5A36]" />
          <span>Google Sheets Database Sync</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Spreadsheet Connection</h2>
        <p className="text-xs text-slate-600 mb-4">
          Sync pages and articles from your published Google Sheets CSV.
        </p>

        <div className="bg-[#E9ECEF] border border-slate-300 p-3 mb-4 rounded-none text-xs space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Records:</span>
            <span className="font-semibold text-slate-800">{syncStatus?.totalStoredPages || 30} pages indexed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Last Synced:</span>
            <span className="font-semibold text-slate-800">{syncStatus?.lastSynced ? new Date(syncStatus.lastSynced).toLocaleString() : "Live"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Telemetry Sync:</span>
            <span className="font-semibold text-emerald-700">Active</span>
          </div>
        </div>

        {syncMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2 rounded-none font-medium">
            <CheckCircle size={14} className="text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Google Sheet Published CSV URL
            </label>
            <input
              type="url"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-2 text-xs font-mono focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleSyncSheets}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2 px-5 rounded-none transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing with Sheets..." : "Sync Database Now"}
            </button>

            <a
              href="/api/telemetry/csv"
              download
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider py-2 px-4 transition-colors"
            >
              <Download size={13} />
              <span>Download Telemetry CSV for Sheets</span>
            </a>

            <button
              onClick={copyStarterCsv}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-none transition-colors"
            >
              {copiedCsv ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copiedCsv ? "Copied Starter CSV" : "Copy Starter Columns"}
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner Settings */}
      <div className="bg-white p-6 rounded-none border border-slate-300 shadow-none">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">
          <Settings size={15} />
          <span>Global Notification Banner</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Top Header Announcement</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showBanner"
              checked={announcement.show}
              onChange={(e) => setAnnouncement({ ...announcement, show: e.target.checked })}
              className="rounded-none border-slate-400 text-slate-900 focus:ring-0"
            />
            <label htmlFor="showBanner" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Display Announcement Banner Across WonderCave
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Banner Message Text
            </label>
            <input
              type="text"
              value={announcement.message}
              onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Link Button Label
              </label>
              <input
                type="text"
                value={announcement.linkText}
                onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Link Destination URL
              </label>
              <input
                type="text"
                value={announcement.linkUrl}
                onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveAnnouncement}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2 px-5 rounded-none transition-colors disabled:opacity-50"
            >
              <Save size={13} />
              {isSaving ? "Saving..." : "Save Announcement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditorPanel() {
  const [pages, setPages] = useState<Record<string, any>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>("sql-injection");
  const [isNew, setIsNew] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPages().then((data) => {
      setPages(data);
      const firstSlug = Object.keys(data)[0] || "sql-injection";
      setSelectedSlug(firstSlug);
      loadPageData(firstSlug, data);
    }).catch(console.error);
  }, []);

  const loadPageData = (slug: string, source = pages) => {
    const page = source[slug] || {};
    setTitle(page.title || "");
    setSubtitle(page.subtitle || "");
    setImageUrl(page.imageUrl || "");
    setContent(page.content || "");
  };

  const handleSelectSlug = (slug: string) => {
    setIsNew(false);
    setSelectedSlug(slug);
    loadPageData(slug);
    setMessage(null);
  };

  const handleNewPage = () => {
    setIsNew(true);
    setNewSlug("");
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setContent("");
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const slug = isNew ? newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") : selectedSlug;
    if (!slug) {
      alert("Please enter a valid page slug.");
      setIsSaving(false);
      return;
    }

    try {
      await savePage(slug, { title, subtitle, imageUrl, content });
      setMessage(`Page "${slug}" saved successfully.`);
      const updated = { ...pages, [slug]: { title, subtitle, imageUrl, content } };
      setPages(updated);
      setSelectedSlug(slug);
      setIsNew(false);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const slug = isNew ? newSlug : selectedSlug;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl font-sans">
      <div className="bg-white border border-slate-300 p-4 rounded-none shadow-none">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-bold uppercase text-slate-500">Topics & Pages</span>
          <button
            onClick={handleNewPage}
            className="text-[11px] font-bold text-[#FF5A36] hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Add New
          </button>
        </div>

        <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
          {Object.keys(pages).map((s) => (
            <button
              key={s}
              onClick={() => handleSelectSlug(s)}
              className={`w-full text-left px-2.5 py-1.5 text-xs font-mono rounded-none truncate block transition-colors ${
                !isNew && selectedSlug === s
                  ? "bg-[#111A4D] text-white font-bold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              /{s}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 bg-white border border-slate-300 p-6 rounded-none shadow-none">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isNew ? "Create New Page" : `Editing /${selectedSlug}`}
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Direct markdown editor syncing to WonderCave
            </span>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 rounded-none">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isNew}
                value={isNew ? newSlug : selectedSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="e.g. ssrf-cloud-metadata"
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-slate-800 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief summary"
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Body Content (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="text-xs font-semibold text-[#111A4D] hover:underline flex items-center gap-1"
              >
                {isPreview ? <Edit3 size={12} /> : <Eye size={12} />}
                {isPreview ? "Edit Raw" : "Live Preview"}
              </button>
            </div>

            {isPreview ? (
              <div className="min-h-[220px] max-h-[400px] overflow-y-auto p-4 bg-slate-50 border border-slate-300 rounded-none prose prose-slate text-xs max-w-none">
                <Markdown>{content || "*No content written yet.*"}</Markdown>
              </div>
            ) : (
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write markdown content here..."
                className="w-full bg-slate-50 border border-slate-300 rounded-none p-3 text-xs font-mono focus:outline-none focus:border-slate-800 resize-y"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            {slug && !isNew ? (
              <Link
                to={`/topics/${slug}`}
                target="_blank"
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
              >
                View Live Page &rarr;
              </Link>
            ) : <div />}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2 px-5 rounded-none transition-colors disabled:opacity-50"
            >
              <Save size={13} />
              {isSaving ? "Saving..." : "Save Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New user form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("Member");
  const [editPassword, setEditPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await createUser({ name, email, password, role });
      setSuccessMsg(`User ${name} created.`);
      setName("");
      setEmail("");
      setPassword("");
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveUser = async (u: any) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await approveUserAccount(u.id);
      setSuccessMsg(`User account ${u.email} approved and activated.`);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Failed to approve user");
    }
  };

  const handleStartEdit = (u: any) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditPassword("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);
    setError(null);
    try {
      await updateUser(editingUser.id, {
        name: editName,
        email: editEmail,
        role: editRole,
        password: editPassword || undefined
      });
      setSuccessMsg(`User ${editName} updated.`);
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleBlock = async (id: number, currentName: string, currentlyBlocked: boolean) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await toggleBlockUser(id);
      setSuccessMsg(`${currentName} is now ${currentlyBlocked ? "ACTIVE" : "BLOCKED"}.`);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update block status");
    }
  };

  const handleDeleteUser = async (id: number, currentName: string) => {
    if (!confirm(`Delete user "${currentName}"?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await deleteUser(id);
      setSuccessMsg(`User "${currentName}" deleted.`);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    }
  };

  const pendingUsers = users.filter((u) => u.status === "pending_approval" || u.approved === false);
  const activeCount = users.filter((u) => !u.blocked && u.status !== "pending_approval").length;
  const blockedCount = users.filter((u) => u.blocked).length;

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-300 p-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Total Users</span>
          <span className="text-xl font-bold text-slate-900 font-mono">{users.length}</span>
        </div>
        <div className="bg-white border border-slate-300 p-4">
          <span className="text-[10px] font-mono text-amber-700 uppercase block mb-1">Pending Approval</span>
          <span className="text-xl font-bold text-amber-800 font-mono">{pendingUsers.length}</span>
        </div>
        <div className="bg-white border border-slate-300 p-4">
          <span className="text-[10px] font-mono text-emerald-700 uppercase block mb-1">Active</span>
          <span className="text-xl font-bold text-emerald-800 font-mono">{activeCount}</span>
        </div>
        <div className="bg-white border border-slate-300 p-4">
          <span className="text-[10px] font-mono text-red-700 uppercase block mb-1">Blocked</span>
          <span className="text-xl font-bold text-red-800 font-mono">{blockedCount}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 p-3 text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-700 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-300 p-3 text-xs text-green-900 flex items-center gap-2">
          <CheckCircle size={14} className="text-green-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* PENDING APPROVAL SECTION (Email Accounts on Hold) */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-400 p-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-900 mb-1">
            <AlertTriangle size={16} className="text-amber-700" />
            <span>Accounts Held for Admin Approval ({pendingUsers.length})</span>
          </div>
          <p className="text-xs text-amber-800 mb-3">
            These accounts were registered with email & password and are held pending AnkoreTech approval:
          </p>

          <div className="space-y-2">
            {pendingUsers.map((pu) => (
              <div key={pu.id} className="bg-white border border-amber-300 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900 mr-2">{pu.name}</span>
                  <span className="font-mono text-slate-600 mr-2">({pu.email})</span>
                  <span className="text-[10px] font-mono text-slate-400">Created: {new Date(pu.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveUser(pu)}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <Check size={12} />
                    <span>Approve User</span>
                  </button>
                  <button
                    onClick={() => handleDeleteUser(pu.id, pu.name)}
                    className="px-2 py-1 text-slate-500 hover:text-red-700 border border-slate-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Form */}
      <div className="bg-white p-6 border border-slate-300">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-3">
          Provision User Account
        </h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <input
            type="text"
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-50 border border-slate-300 px-3 py-1.5 focus:outline-none focus:border-slate-800"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-50 border border-slate-300 px-3 py-1.5 focus:outline-none focus:border-slate-800"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-50 border border-slate-300 px-3 py-1.5 focus:outline-none focus:border-slate-800"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-slate-50 border border-slate-300 px-3 py-1.5 focus:outline-none focus:border-slate-800"
          >
            <option value="Member">Member</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#111A4D] hover:bg-slate-900 text-white font-bold uppercase tracking-wider py-1.5 px-3 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 border border-slate-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Registered Accounts
          </h3>
          <button
            onClick={loadUsers}
            className="text-xs text-slate-600 font-mono flex items-center gap-1 border border-slate-300 px-2 py-1 hover:bg-slate-100"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-300">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E9ECEF] border-b border-slate-300 text-slate-700 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-2.5">User</th>
                <th className="p-2.5">Email</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((u) => {
                const isBlocked = !!u.blocked;
                const isPending = u.status === "pending_approval" || u.approved === false;
                return (
                  <tr key={u.id} className={isBlocked ? "bg-red-50/50" : isPending ? "bg-amber-50/40" : "hover:bg-slate-50"}>
                    <td className="p-2.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-2.5 font-mono text-slate-700">{u.email}</td>
                    <td className="p-2.5 font-mono">
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 uppercase font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 border border-red-300 text-red-800 font-mono text-[10px] uppercase font-bold">
                          <Ban size={9} /> BLOCKED
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] uppercase font-bold">
                          <Clock size={9} /> PENDING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] uppercase font-bold">
                          <ShieldCheck size={9} /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right space-x-1.5">
                      {isPending && (
                        <button
                          onClick={() => handleApproveUser(u)}
                          className="px-2 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleStartEdit(u)}
                        className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleBlock(u.id, u.name, isBlocked)}
                        className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${
                          isBlocked
                            ? "bg-emerald-700 text-white border-emerald-700"
                            : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                        }`}
                      >
                        {isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="px-1.5 py-0.5 text-slate-400 hover:text-red-700 border border-slate-200 hover:border-red-300"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function TelemetryAuditTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchTelemetryLogs();
      setLogs(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="bg-white border border-slate-300 p-6 shadow-none mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
            <Monitor size={15} />
            <span>Database & Google Sheets Sync Ledger</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Logged In Users IP, Timestamp & Display Size
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/telemetry/csv"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111A4D] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Download size={12} />
            <span>Export to Google Sheets CSV</span>
          </a>
          <button
            onClick={loadLogs}
            className="px-2.5 py-1.5 border border-slate-300 text-xs text-slate-600 hover:bg-slate-100"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-300">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#E9ECEF] border-b border-slate-300 font-mono uppercase text-[10px] text-slate-700">
            <tr>
              <th className="p-2.5">User</th>
              <th className="p-2.5">IP Address</th>
              <th className="p-2.5">Date & Time</th>
              <th className="p-2.5">Display Resolution</th>
              <th className="p-2.5">Viewport Size</th>
              <th className="p-2.5">Role</th>
              <th className="p-2.5">Device & Browser</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                  No telemetry sessions recorded yet. Logins are automatically synced here.
                </td>
              </tr>
            ) : (
              logs.slice(0, 15).map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-50 text-[11px]">
                  <td className="p-2.5 font-bold text-slate-900 font-sans">
                    {log.userName || "User"}
                    <span className="block text-[10px] text-slate-500 font-mono font-normal">{log.userEmail}</span>
                  </td>
                  <td className="p-2.5 font-bold text-slate-800">
                    <span className="inline-flex items-center gap-1">
                      <Globe size={11} className="text-slate-400" />
                      {log.ip || "127.0.0.1"}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600">
                    {log.formattedDate || (log.timestamp ? new Date(log.timestamp).toLocaleString() : "Just now")}
                  </td>
                  <td className="p-2.5 text-slate-800 font-bold">
                    {log.screenResolution || "1920x1080"}
                  </td>
                  <td className="p-2.5 text-slate-600">
                    {log.viewportSize || "1440x900"}
                  </td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 font-bold uppercase text-[9px]">
                      {log.role || "member"}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500 truncate max-w-xs text-[10px]">
                    {log.userAgent || "Web / Node"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingPostCount, setPendingPostCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("sc_user");
    if (!u) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(u);
    setUser(parsed);
    fetchActivity().then(setActivities).catch(console.error);
    fetchPostSubmissions().then(subs => {
      const pending = subs.filter((s: any) => (s.status || "pending_review") === "pending_review").length;
      setPendingPostCount(pending);
    }).catch(console.error);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
    localStorage.removeItem("sc_user");
    localStorage.removeItem("sc_token");
    localStorage.removeItem("sc_token_expiry");
    navigate("/");
  };

  if (!user) return null;

  // ROUTE 1: REGULAR RESEARCHER / STUDENT (Member Role)
  // Others who log in by Gmail get into the new minimally prepared user dashboard!
  if (user.role === "member") {
    return (
      <>
        {!user.onboardingCompleted && (
          <MandatoryOnboardingModal 
            user={user} 
            onComplete={(updated) => setUser(updated)} 
          />
        )}
        <MemberDashboard user={user} onLogout={handleLogout} />
      </>
    );
  }

  // ROUTE 2: ADMIN (AnkoreTech@gmail.com) & EDITOR (nxyxmz@gmail.com)
  const isAdmin = user.role === "admin" || (user.email && user.email.toLowerCase() === "ankoretech@gmail.com");
  const isEditor = user.role === "editor" || (user.email && user.email.toLowerCase() === "nxyxmz@gmail.com");

  const revenueData = [
    { name: "Jan", mrr: 4000 },
    { name: "Feb", mrr: 3000 },
    { name: "Mar", mrr: 5000 },
    { name: "Apr", mrr: 9780 },
    { name: "May", mrr: 12900 },
    { name: "Jun", mrr: 18000 },
    { name: "Jul", mrr: 21000 },
  ];

  return (
    <div className="min-h-screen bg-[#E9ECEF] flex flex-col md:flex-row font-sans text-slate-900">
      <Seo 
        title={`${isAdmin ? "Admin Console" : "Editor Console"} — WonderCave`} 
        description="Operations management, review queue, and security telemetry." 
      />

      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-[#111A4D] text-white p-5 flex flex-col min-h-screen sticky top-0 border-r border-slate-800">
        <div className="mb-6 hidden md:block border-b border-white/10 pb-4">
          <h2 className="text-base font-bold tracking-tight">
            {isAdmin ? "Admin Console" : "Editor Console"}
          </h2>
          <div className="inline-flex items-center gap-1 mt-1 bg-white/10 px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-widest text-emerald-400">
            {isAdmin ? "Lead Administrator" : "Security Editor"}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
            {user.email}
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab("overview")} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-colors ${activeTab === 'overview' ? 'bg-white text-[#111A4D]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={14} /> Overview
          </button>

          <button 
            onClick={() => setActiveTab("review")} 
            className={`w-full flex items-center justify-between px-3 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-colors ${activeTab === 'review' ? 'bg-white text-[#111A4D]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <span className="flex items-center gap-2.5">
              <FileCheck size={14} /> Review Queue
            </span>
            {pendingPostCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#FF5A36] text-white text-[10px] font-mono font-bold">
                {pendingPostCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("editor")} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-colors ${activeTab === 'editor' ? 'bg-white text-[#111A4D]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <FileEdit size={14} /> Content Editor
          </button>

          {isAdmin && (
            <>
              <button 
                onClick={() => setActiveTab("users")} 
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-colors ${activeTab === 'users' ? 'bg-white text-[#111A4D]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
              >
                <Users size={14} /> Users & Roles
              </button>
              <button 
                onClick={() => setActiveTab("settings")} 
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-colors ${activeTab === 'settings' ? 'bg-white text-[#111A4D]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
              >
                <Settings size={14} /> Database & Sync
              </button>
            </>
          )}
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-auto flex items-center gap-2 px-3 py-2 text-red-300 hover:text-white hover:bg-red-900/40 rounded-none font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-8">
        <header className="mb-6 flex justify-between items-end pb-3 border-b border-slate-300">
          <div>
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              wondercave.nayem.net / Nayem Hasan
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isAdmin ? "Admin Operations" : "Editorial Desk"} / {user.name}
            </h1>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-white p-4 rounded-none border border-slate-300 shadow-none">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Monthly Revenue</h3>
                <div className="text-2xl font-bold text-slate-900 font-mono">$21,000</div>
                <div className="text-green-700 text-xs font-semibold mt-1">+16.6%</div>
              </div>
              <div className="bg-white p-4 rounded-none border border-slate-300 shadow-none">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Pending Posts</h3>
                <div className="text-2xl font-bold text-slate-900 font-mono">{pendingPostCount}</div>
                <div className="text-amber-700 text-xs font-semibold mt-1">Ready for review</div>
              </div>
              <div className="bg-white p-4 rounded-none border border-slate-300 shadow-none">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Researchers</h3>
                <div className="text-2xl font-bold text-slate-900 font-mono">1,204</div>
                <div className="text-green-700 text-xs font-semibold mt-1">+4% growth</div>
              </div>
              <div className="bg-white p-4 rounded-none border border-slate-300 shadow-none">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">System Status</h3>
                <div className="text-2xl font-bold text-slate-900 font-mono">100%</div>
                <div className="text-slate-500 text-xs font-semibold mt-1">Nominal</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white p-5 rounded-none border border-slate-300 shadow-none">
                <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">MRR Trajectory</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#CBD5E1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontFamily: 'Poppins'}} dy={6} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontFamily: 'Poppins'}} tickFormatter={(val) => `$${val/1000}k`} dx={-6} />
                      <Tooltip 
                        contentStyle={{borderRadius: '0px', border: '1px solid #94A3B8', backgroundColor: '#FFFFFF'}}
                        itemStyle={{color: '#111A4D', fontWeight: 'bold'}}
                      />
                      <Area type="monotone" dataKey="mrr" stroke="#111A4D" strokeWidth={2} fill="#CBD5E1" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-5 rounded-none border border-slate-300 shadow-none flex flex-col">
                <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Audit Logs</h3>
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="space-y-2.5">
                    {activities.length > 0 ? activities.slice(0, 6).map((act, i) => (
                      <div key={i} className="flex gap-2.5 items-start pb-2 border-b border-slate-200 last:border-0 text-xs">
                        <div className="w-6 h-6 bg-slate-100 flex items-center justify-center shrink-0 text-[#111A4D] border border-slate-300 rounded-none">
                          <Activity size={11} />
                        </div>
                        <div>
                          <p className="text-slate-900 font-semibold">{act.user} <span className="font-normal text-slate-600">{act.action}</span></p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(act.date).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-slate-500">No activity logged.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Telemetry Table for Google Sheets sync & display parameters */}
            <TelemetryAuditTable />
          </>
        )}

        {activeTab === 'review' && (
          <ReviewQueuePanel reviewerEmail={user.email} />
        )}

        {activeTab === 'editor' && (
          <ContentEditorPanel />
        )}

        {activeTab === 'settings' && isAdmin && (
          <DatabaseSettingsPanel />
        )}

        {activeTab === 'users' && isAdmin && (
          <UsersPanel />
        )}
      </main>
    </div>
  );
}
