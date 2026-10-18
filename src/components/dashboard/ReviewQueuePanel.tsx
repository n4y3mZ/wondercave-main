import React, { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Eye, RefreshCw, AlertTriangle, 
  Clock, Check, X, FileText, Send, User, Tag, Calendar
} from "lucide-react";
import Markdown from "react-markdown";
import { fetchPostSubmissions, updatePostSubmission } from "../../services/api";

interface ReviewQueuePanelProps {
  reviewerEmail: string;
}

export default function ReviewQueuePanel({ reviewerEmail }: ReviewQueuePanelProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending_review" | "edit_requested" | "deletion_requested" | "approved" | "rejected">("pending_review");
  const [previewSub, setPreviewSub] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<any | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await fetchPostSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.warn("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (sub: any) => {
    setActionLoading(true);
    setMsg(null);
    try {
      await updatePostSubmission(sub.id, "approved", reviewerEmail);
      setMsg(`Post "${sub.title}" approved and updated in live feed.`);
      await loadSubmissions();
      if (previewSub && previewSub.id === sub.id) {
        setPreviewSub({ ...previewSub, status: "approved" });
      }
    } catch (err: any) {
      alert("Failed to approve submission: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDeletion = async (sub: any) => {
    if (!window.confirm(`Confirm deletion of post "${sub.title}"? This will remove it from live listings.`)) return;
    setActionLoading(true);
    setMsg(null);
    try {
      await updatePostSubmission(sub.id, "deleted", reviewerEmail, "Post deletion approved by admin.");
      setMsg(`Post "${sub.title}" has been deleted from public feed.`);
      await loadSubmissions();
      if (previewSub && previewSub.id === sub.id) {
        setPreviewSub(null);
      }
    } catch (err: any) {
      alert("Failed to confirm deletion: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDeletion = async (sub: any) => {
    setActionLoading(true);
    setMsg(null);
    try {
      await updatePostSubmission(sub.id, "approved", reviewerEmail, "Deletion request declined. Post kept active.");
      setMsg(`Deletion request declined for "${sub.title}".`);
      await loadSubmissions();
    } catch (err: any) {
      alert("Failed to decline deletion: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRejectModal) return;
    setActionLoading(true);
    try {
      await updatePostSubmission(showRejectModal.id, "rejected", reviewerEmail, feedbackText.trim());
      setMsg(`Post marked as rejected with feedback sent to author.`);
      setShowRejectModal(null);
      setFeedbackText("");
      await loadSubmissions();
      if (previewSub && previewSub.id === showRejectModal.id) {
        setPreviewSub({ ...previewSub, status: "rejected", feedback: feedbackText.trim() });
      }
    } catch (err: any) {
      alert("Failed to reject submission: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = filter === "all" 
    ? submissions 
    : submissions.filter((s) => (s.status || "pending_review") === filter);

  const pendingCount = submissions.filter((s) => (s.status || "pending_review") === "pending_review").length;
  const editCount = submissions.filter((s) => s.status === "edit_requested").length;
  const deletionCount = submissions.filter((s) => s.status === "deletion_requested").length;

  return (
    <div className="space-y-6 max-w-6xl font-sans text-slate-900">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-300 p-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] block mb-1">
            Editorial Governance
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Community Post Review Queue
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Review user-submitted vulnerability analyses, edit revisions, and deletion requests before updating WonderCave.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSubmissions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-700 shrink-0" />
            <span>{msg}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap border-b border-slate-300 gap-1 bg-white px-4 sm:px-6 pt-2 overflow-x-auto">
        <button
          onClick={() => setFilter("pending_review")}
          className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            filter === "pending_review" 
              ? "border-[#111A4D] text-[#111A4D]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Pending Review</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilter("edit_requested")}
          className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            filter === "edit_requested" 
              ? "border-[#111A4D] text-[#111A4D]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Edit Requests</span>
          {editCount > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-200 text-blue-900 text-[10px] font-mono font-bold">
              {editCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilter("deletion_requested")}
          className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            filter === "deletion_requested" 
              ? "border-red-600 text-red-700" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Deletion Requests</span>
          {deletionCount > 0 && (
            <span className="px-1.5 py-0.2 bg-red-200 text-red-900 text-[10px] font-mono font-bold">
              {deletionCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 cursor-pointer ${
            filter === "approved" 
              ? "border-[#111A4D] text-[#111A4D]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Approved & Published
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 cursor-pointer ${
            filter === "rejected" 
              ? "border-[#111A4D] text-[#111A4D]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Rejected
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors shrink-0 cursor-pointer ${
            filter === "all" 
              ? "border-[#111A4D] text-[#111A4D]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All ({submissions.length})
        </button>
      </div>

      {/* Submissions List */}
      <div className="bg-white border border-slate-300">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500">
            <div 
              className="w-6 h-6 border-2 border-slate-900 border-t-transparent animate-spin mx-auto mb-2 rounded-full"
              style={{ borderRadius: "100%" }}
            ></div>
            <span>Loading submissions from database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <FileText size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="font-bold text-slate-700">No submissions found in this view.</p>
            <p className="mt-1">When researchers submit posts, edit requests, or deletion notices, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filtered.map((sub) => {
              const isPending = (sub.status || "pending_review") === "pending_review";
              const isEditReq = sub.status === "edit_requested";
              const isDeletionReq = sub.status === "deletion_requested";

              return (
                <div key={sub.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-mono font-bold uppercase">
                        {sub.category || "Research"}
                      </span>

                      {isDeletionReq ? (
                        <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                          <AlertTriangle size={11} /> Deletion Requested
                        </span>
                      ) : isEditReq ? (
                        <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 text-blue-800 text-[10px] font-mono font-bold uppercase">
                          Revision Requested
                        </span>
                      ) : sub.status === "approved" ? (
                        <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                          Approved
                        </span>
                      ) : sub.status === "rejected" ? (
                        <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 text-[10px] font-mono font-bold uppercase">
                          Rejected
                        </span>
                      ) : sub.status === "deleted" ? (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase">
                          Deleted / Archived
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-mono font-bold uppercase">
                          Pending Review
                        </span>
                      )}

                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(sub.submittedAt || sub.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {sub.title}
                    </h3>

                    {/* Notice for deletion requests */}
                    {isDeletionReq && (
                      <div className="mt-2 p-2.5 bg-red-50 border border-red-200 text-xs text-red-900">
                        <strong>Author Reason for Deletion:</strong> {sub.deletionReason || "No explanation provided."}
                        <div className="text-[10px] font-mono text-red-700 mt-0.5">
                          Requested by {sub.deletionRequestedBy || sub.authorEmail} on {new Date(sub.deletionRequestedAt || Date.now()).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {/* Notice for edit requests */}
                    {isEditReq && sub.pendingEdit && (
                      <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 text-xs text-blue-900">
                        <strong>Pending Revision:</strong> {sub.pendingEdit.title !== sub.title ? `Title changed to: "${sub.pendingEdit.title}"` : "Body/content updated."}
                      </div>
                    )}

                    {sub.subtitle && !isDeletionReq && (
                      <p className="text-xs text-slate-600 truncate mt-0.5">{sub.subtitle}</p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <User size={12} className="text-slate-400" />
                        <strong>{sub.authorName}</strong> ({sub.authorEmail})
                      </span>
                      {sub.tags && (
                        <span className="flex items-center gap-1">
                          <Tag size={12} className="text-slate-400" />
                          <span>{Array.isArray(sub.tags) ? sub.tags.join(", ") : sub.tags}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => setPreviewSub(isEditReq && sub.pendingEdit ? { ...sub, ...sub.pendingEdit } : sub)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>{isEditReq ? "Review Edits" : "Preview Post"}</span>
                    </button>

                    {isDeletionReq && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleConfirmDeletion(sub)}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Check size={12} />
                          <span>Confirm & Delete</span>
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleRejectDeletion(sub)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <X size={12} />
                          <span>Keep Post</span>
                        </button>
                      </>
                    )}

                    {isEditReq && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleApprove(sub)}
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Check size={12} />
                          <span>Approve & Update</span>
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleReject(sub)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <X size={12} />
                          <span>Reject Edit</span>
                        </button>
                      </>
                    )}

                    {isPending && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleApprove(sub)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Check size={12} />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => setShowRejectModal(sub)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <X size={12} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border-2 border-slate-900 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="bg-[#111A4D] text-white p-4 px-6 flex justify-between items-center border-b border-slate-800 shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
                  Post Submission Preview
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-xl">
                  {previewSub.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewSub(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="bg-slate-50 border border-slate-200 p-4 text-xs font-mono space-y-1">
                <div>Author: <strong>{previewSub.authorName}</strong> ({previewSub.authorEmail})</div>
                <div>Category: <strong>{previewSub.category}</strong></div>
                <div>Submitted At: <strong>{previewSub.submittedAt || previewSub.createdAt}</strong></div>
                {previewSub.tags && <div>Tags: <strong>{Array.isArray(previewSub.tags) ? previewSub.tags.join(", ") : previewSub.tags}</strong></div>}
              </div>

              {previewSub.heroImage && (
                <div className="border border-slate-300">
                  <img src={previewSub.heroImage} alt="Cover" className="w-full h-48 object-cover" />
                </div>
              )}

              {previewSub.subtitle && (
                <p className="text-sm font-medium text-slate-700 italic border-l-2 border-[#111A4D] pl-3 py-1">
                  {previewSub.subtitle}
                </p>
              )}

              <div className="border-t border-slate-200 pt-4 prose prose-slate max-w-none text-xs">
                <Markdown>{previewSub.content || "*No content.*"}</Markdown>
              </div>
            </div>

            <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={() => setPreviewSub(null)}
                className="px-4 py-2 border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close Preview
              </button>

              {(previewSub.status || "pending_review") === "pending_review" && (
                <div className="flex gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleApprove(previewSub)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Check size={13} />
                    <span>Approve & Publish Live</span>
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => {
                      setShowRejectModal(previewSub);
                      setPreviewSub(null);
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <X size={13} />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Reject Post: {showRejectModal.title}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Provide feedback explaining what the researcher needs to adjust before resubmitting.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Reviewer Feedback Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Please include concrete PoC code examples and sanitize specific internal domain references..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(null)}
                  className="px-3 py-1.5 border border-slate-300 bg-white text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
