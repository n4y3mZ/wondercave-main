import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Calendar, User, Clock, Share2, Code, ArrowLeft, ArrowRight, Shield, 
  Check, Copy, Image as ImageIcon, Twitter, Linkedin, Send, ExternalLink, 
  CheckCircle2, AlertTriangle, Eye, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import Seo from "../components/layout/Seo";
import { FALLBACK_NEWS_POSTS, NewsPost } from "../data/fallbackNews";

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 border border-slate-700 bg-[#0B1120] shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1E293B] border-b border-slate-700 text-[11px] font-mono text-slate-300">
        <span className="text-slate-400 font-semibold tracking-wider uppercase text-[10px]">Source / Exploit Payload</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2 py-0.5 text-[11px] font-mono border border-slate-600 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed bg-[#0B1120] text-slate-100 m-0 border-0">
        <code className="!text-[#F8FAFC] font-mono text-xs sm:text-sm leading-relaxed block whitespace-pre font-normal" style={{ color: "#F8FAFC" }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<NewsPost[]>(FALLBACK_NEWS_POSTS);
  const [currentPost, setCurrentPost] = useState<NewsPost | null>(null);
  const [additionalImages, setAdditionalImages] = useState<Array<{ url: string; caption: string }>>([]);

  // Embed Modal
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Social Share Toast
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Image Ingestion Tool for this post
  const [showImageTool, setShowImageTool] = useState(false);
  const [customImgUrl, setCustomImgUrl] = useState("");
  const [customCaption, setCustomCaption] = useState("");
  const [copiedImgMarkdown, setCopiedImgMarkdown] = useState(false);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const found = posts.find(p => p.slug === slug || p.id === slug) || FALLBACK_NEWS_POSTS.find(p => p.slug === slug || p.id === slug);
    if (found) {
      setCurrentPost(found);
    }
  }, [slug, posts]);

  if (!currentPost) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#E9ECEF] p-8 text-center">
        <Shield size={40} className="text-[#FF5A36] mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Security Publication Not Found</h2>
        <p className="text-xs text-slate-600 mb-6 max-w-md">The requested advisory or research dispatch may have been moved or archived.</p>
        <Link to="/posts" className="bg-[#111A4D] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider">
          Return to All Publications
        </Link>
      </div>
    );
  }

  const handleShare = (network: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`${currentPost.title} — WonderCave Security Research`);
    
    if (network === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (network === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (network === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, "_blank");
    } else if (network === "copy") {
      navigator.clipboard.writeText(url);
      setShareToast("Article URL copied to clipboard!");
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  const handleCopyEmbed = () => {
    const embedSnippet = `<iframe src="${window.location.origin}/posts/${currentPost.slug}" width="100%" height="600" frameborder="0" style="border:1px solid #CED4DA;"></iframe>`;
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleAddImageToPost = () => {
    if (!customImgUrl.trim()) return;
    setAdditionalImages(prev => [...prev, {
      url: customImgUrl.trim(),
      caption: customCaption.trim() || `Figure ${prev.length + 4}: User-inserted technical analysis.`
    }]);
    setCustomImgUrl("");
    setCustomCaption("");
    setShowImageTool(false);
    setShareToast("Image appended to technical post!");
    setTimeout(() => setShareToast(null), 2500);
  };

  const currentIndex = posts.findIndex(p => p.slug === currentPost.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="w-full bg-[#E9ECEF] min-h-screen text-slate-900 font-sans pb-24">
      <Seo 
        title={`${currentPost.title} — WonderCave`} 
        description={currentPost.subtitle} 
      />

      {/* Share Toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-[#111A4D] text-white px-4 py-2 text-xs font-semibold shadow-lg border border-slate-700 flex items-center gap-2"
          >
            <Check size={14} className="text-emerald-400" />
            <span>{shareToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-600">
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#111A4D] hover:text-[#FF5A36] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Publications</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500">{currentPost.category}</span>
          </div>
        </div>

        {/* Article Header Card */}
        <header className="bg-white border border-slate-300 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 rounded-none shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 border-b border-slate-100 pb-2.5">
            <span className="inline-block bg-[#111A4D] text-white px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest border border-slate-700">
              {currentPost.category}
            </span>

            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-slate-500">
              <Calendar size={12} className="text-[#FF5A36] shrink-0" />
              <span>Published: {currentPost.date}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2 sm:mb-3 leading-tight break-words">
            {currentPost.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed mb-4 sm:mb-6 font-normal break-words">
            {currentPost.subtitle}
          </p>

          {/* Author Details & Social Share Controls */}
          <div className="pt-4 sm:pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentPost.author.avatar}
                alt={currentPost.author.name}
                className="w-9 h-9 sm:w-10 sm:h-10 object-cover border border-slate-300 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{currentPost.author.name}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">{currentPost.author.role} • wondercave.nayem.net</div>
              </div>
            </div>

            {/* Social Share Bar + Embed Trigger + Image Ingestion Tool */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase text-slate-400 mr-1 hidden sm:inline">Share:</span>
              <button
                onClick={() => handleShare("twitter")}
                title="Share on X / Twitter"
                className="p-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <Twitter size={14} />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                title="Share on LinkedIn"
                className="p-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin size={14} />
              </button>
              <button
                onClick={() => handleShare("telegram")}
                title="Share on Telegram"
                className="p-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#229ED9] transition-colors"
              >
                <Send size={14} />
              </button>
              <button
                onClick={() => handleShare("copy")}
                title="Copy Link"
                className="p-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <Share2 size={14} />
              </button>

              <button
                onClick={() => setShowEmbedModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors ml-1"
                title="Embed this advisory on other websites"
              >
                <Code size={13} />
                <span>Embed</span>
              </button>

              <button
                onClick={() => setShowImageTool(true)}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-[#111A4D] border border-slate-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                title="Insert Image from URL"
              >
                <ImageIcon size={13} />
                <span>+ Image</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Visual Image with Caption */}
        {currentPost.heroImage && (
          <div className="mb-8 border border-slate-300 bg-white p-2">
            <img
              src={currentPost.heroImage}
              alt={currentPost.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[480px] object-cover border border-slate-200"
            />
            {currentPost.heroImageCaption && (
              <p className="text-[11px] font-mono text-slate-500 mt-2 text-center not-italic font-normal">
                {currentPost.heroImageCaption}
              </p>
            )}
          </div>
        )}

        {/* Article Body Content */}
        <main className="bg-white border border-slate-300 p-5 sm:p-8 md:p-12 mb-8">
          <div className="text-sm md:text-base leading-relaxed prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-[#111A4D] hover:prose-a:text-[#FF5A36] prose-code:font-mono prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-pre:p-0 prose-pre:bg-transparent">
            <Markdown
              components={{
                img: ({ node, ...props }) => (
                  <div className="my-6 border border-slate-300 bg-slate-50 p-2">
                    <img
                      {...props}
                      alt={props.alt || "Advisory illustration"}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[450px] object-cover border border-slate-200"
                    />
                    {props.alt && (
                      <p className="text-[11px] font-mono text-slate-500 mt-2 text-center not-italic font-normal">
                        {props.alt}
                      </p>
                    )}
                  </div>
                ),
                pre: ({ node, children, ...props }) => {
                  const codeContent = React.Children.toArray(children)
                    .map((child: any) => child?.props?.children || "")
                    .join("");
                  return <CodeBlock>{codeContent}</CodeBlock>;
                },
                code: ({ node, className, children, ...props }: any) => {
                  return (
                    <code className="bg-[#E9ECEF] text-[#0F172A] px-1.5 py-0.5 text-xs font-mono font-semibold border border-slate-300 not-italic rounded-none" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-[#111A4D] bg-[#F1F3F5] p-4 my-5 not-italic text-slate-700 text-xs sm:text-sm font-normal">
                    {props.children}
                  </blockquote>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6 border border-slate-300">
                    <table className="w-full text-xs text-left border-collapse" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="bg-slate-100 font-bold p-3 border-b border-slate-300 text-slate-900 uppercase tracking-wider" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-3 border-b border-slate-200 text-slate-700" {...props} />
                ),
              }}
            >
              {currentPost.content}
            </Markdown>
          </div>

          {/* User Inserted Additional Images */}
          {additionalImages.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                Appended Research Imagery
              </div>
              {additionalImages.map((img, i) => (
                <div key={i} className="border border-slate-300 bg-slate-50 p-2">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-auto max-h-[420px] object-cover border border-slate-200"
                  />
                  <p className="text-[11px] font-mono text-slate-500 mt-2 text-center not-italic font-normal">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tags Footer */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold mr-1">Tags:</span>
              {currentPost.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </main>

        {/* Previous & Next Post Navigation */}
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-300 p-6 mb-8">
          {prevPost ? (
            <Link
              to={`/posts/${prevPost.slug}`}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#111A4D]"
            >
              <ArrowLeft size={14} />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-mono">Previous</span>
                <span className="truncate max-w-[200px] block">{prevPost.title}</span>
              </div>
            </Link>
          ) : <div />}

          <Link
            to="/posts"
            className="text-xs font-bold uppercase tracking-wider text-[#FF5A36] hover:underline"
          >
            All Publications
          </Link>

          {nextPost ? (
            <Link
              to={`/posts/${nextPost.slug}`}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#111A4D]"
            >
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Next</span>
                <span className="truncate max-w-[200px] block">{nextPost.title}</span>
              </div>
              <ArrowRight size={14} />
            </Link>
          ) : <div />}
        </nav>
      </div>

      {/* Embed Modal */}
      <AnimatePresence>
        {showEmbedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#FF5A36] tracking-widest block">
                    Third-Party Syndication
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Embed Article on Other Websites
                  </h3>
                </div>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="text-slate-400 hover:text-slate-900 text-sm font-mono p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Copy and paste this HTML embed snippet to render this live security advisory on your external platform:
              </p>

              <div className="bg-[#0B1120] p-4 border border-slate-700 text-[#38BDF8] font-mono text-xs overflow-x-auto mb-4 leading-relaxed">
                <code className="text-[#38BDF8] !text-[#38BDF8]">
                  {`<iframe src="${window.location.origin}/posts/${currentPost.slug}" width="100%" height="600" frameborder="0" style="border:1px solid #CED4DA;"></iframe>`}
                </code>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-slate-500">
                  Cloudflare Workers & Pages compatible
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyEmbed}
                    className="inline-flex items-center gap-1.5 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 transition-colors"
                  >
                    {copiedEmbed ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedEmbed ? "Copied" : "Copy Embed Code"}</span>
                  </button>
                  <button
                    onClick={() => setShowEmbedModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider px-4 py-2 border border-slate-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Insert Image Tool Modal */}
      <AnimatePresence>
        {showImageTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-300 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#FF5A36] tracking-widest block">
                    Dynamic Media Insertion
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Add Image to this Publication
                  </h3>
                </div>
                <button
                  onClick={() => setShowImageTool(false)}
                  className="text-slate-400 hover:text-slate-900 text-sm font-mono p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={customImgUrl}
                    onChange={(e) => setCustomImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200"
                    className="w-full p-2.5 border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Caption Text
                  </label>
                  <input
                    type="text"
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    placeholder="Figure: Deep packet telemetry capture during live exploit."
                    className="w-full p-2.5 border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {customImgUrl.trim() && (
                <div className="mb-6 border border-slate-300 bg-slate-50 p-2">
                  <img
                    src={customImgUrl}
                    alt={customCaption || "Preview"}
                    className="w-full h-36 object-cover border border-slate-200"
                  />
                  <p className="text-[11px] font-mono text-slate-500 mt-1.5 text-center not-italic font-normal">
                    {customCaption || "Caption preview"}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  onClick={() => setShowImageTool(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase px-4 py-2 border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImageToPost}
                  disabled={!customImgUrl.trim()}
                  className="bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase px-4 py-2 disabled:opacity-50"
                >
                  Append Image to Body
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
