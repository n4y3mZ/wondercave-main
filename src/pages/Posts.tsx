import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, Calendar, User, Clock, Share2, Code, ArrowRight, Search, 
  ExternalLink, Copy, Check, Image as ImageIcon, Plus, Tag, Twitter, 
  Linkedin, Send, Eye, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Seo from "../components/layout/Seo";
import { FALLBACK_NEWS_POSTS, NewsPost } from "../data/fallbackNews";

export default function Posts() {
  const [posts, setPosts] = useState<NewsPost[]>(FALLBACK_NEWS_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Image Ingestion Tool modal state
  const [showImageTool, setShowImageTool] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageCaptionInput, setImageCaptionInput] = useState("");
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Embed Modal state
  const [embedPost, setEmbedPost] = useState<NewsPost | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Social Share Toast
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(() => {
        // Fallback already pre-seeded
      });
  }, []);

  const categories = ["All", "Zero-Day Research", "Threat Intelligence", "Academy Updates"];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyEmbed = (post: NewsPost) => {
    const embedSnippet = `<iframe src="${window.location.origin}/posts/${post.slug}" width="100%" height="600" frameborder="0" style="border:1px solid #CED4DA;"></iframe>`;
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleShare = (network: string, post: NewsPost) => {
    const url = `${window.location.origin}/posts/${post.slug}`;
    const text = encodeURIComponent(`${post.title} — WonderCave Security Research`);
    
    if (network === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (network === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (network === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, "_blank");
    } else if (network === "copy") {
      navigator.clipboard.writeText(url);
      setShareToast("Link copied to clipboard!");
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  const generatedMarkdownTag = imageUrlInput.trim() 
    ? `![${imageCaptionInput.trim() || 'Descriptive Image Caption'}](${imageUrlInput.trim()})`
    : "";

  return (
    <div className="w-full bg-[#E9ECEF] min-h-screen text-slate-900 font-sans pb-20">
      <Seo 
        title="Security Intelligence & Technical Dispatches — WonderCave" 
        description="Official vulnerability disclosures, zero-day research papers, threat advisories, and platform releases maintained by Nayem Hasan at wondercave.nayem.net." 
      />

      {/* Header Banner */}
      <section className="bg-white border-b border-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF5A36] uppercase tracking-widest">
              <Shield size={14} />
              <span>WonderCave Research Publications</span>
            </div>
            
            {/* Quick Utility Action: Image Ingestion Tool */}
            <button
              onClick={() => setShowImageTool(true)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#111A4D] font-bold text-xs uppercase tracking-wider px-3.5 py-2 border border-slate-300 transition-colors"
            >
              <ImageIcon size={14} />
              <span>Image Ingestion Tool</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3">
            Security Intelligence & Technical Dispatches
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Peer-reviewed vulnerability advisories, zero-day exploit analysis, and platform changelogs published by the WonderCave research team under the direction of Nayem Hasan.
          </p>
        </div>
      </section>

      {/* Controls & Category Filter Bar */}
      <div className="bg-[#DEE2E6] border-b border-slate-300 py-4 px-4 sm:px-6 lg:px-8 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs without scrollbar (wraps cleanly on mobile/Android) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
                  selectedCategory === cat
                    ? "bg-[#111A4D] text-white border-[#111A4D]"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search advisories or tags..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
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

      {/* Posts Listing */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-300 p-12 text-center">
            <Shield size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No publications match your criteria</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing the search query or selecting a different category.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="bg-[#111A4D] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-900"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPosts.map((post, idx) => (
              <article
                key={post.id || post.slug}
                className="bg-white border border-slate-300 overflow-hidden shadow-none flex flex-col md:flex-row transition-all hover:border-slate-400"
              >
                {/* Post Visual Banner */}
                <div className="w-full md:w-2/5 shrink-0 relative bg-slate-950 overflow-hidden min-h-[220px]">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#111A4D] text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border border-slate-700">
                    {post.category}
                  </div>
                </div>

                {/* Post Information */}
                <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Date, Author, Read Time */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#FF5A36] shrink-0" />
                        <span>{post.date}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-700 font-semibold truncate">
                        <User size={12} className="text-slate-400 shrink-0" />
                        <span>{post.author.name}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="shrink-0" />
                        <span>{post.readTime || "5 min read"}</span>
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 hover:text-[#111A4D] transition-colors break-words leading-snug">
                      <Link to={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-4 break-words">
                      {post.subtitle}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Bar: Read Link + Social Handles + Embed Code */}
                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      to={`/posts/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111A4D] hover:text-[#FF5A36] transition-colors"
                    >
                      <span>Read Full Advisory</span>
                      <ArrowRight size={14} />
                    </Link>

                    <div className="flex items-center gap-2">
                      {/* Social handles buttons */}
                      <button
                        onClick={() => handleShare("twitter", post)}
                        title="Share on X / Twitter"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Twitter size={14} />
                      </button>
                      <button
                        onClick={() => handleShare("linkedin", post)}
                        title="Share on LinkedIn"
                        className="p-1.5 text-slate-500 hover:text-[#0A66C2] hover:bg-slate-100 transition-colors"
                      >
                        <Linkedin size={14} />
                      </button>
                      <button
                        onClick={() => handleShare("telegram", post)}
                        title="Share on Telegram"
                        className="p-1.5 text-slate-500 hover:text-[#229ED9] hover:bg-slate-100 transition-colors"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        onClick={() => handleShare("copy", post)}
                        title="Copy article link"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>

                      {/* Embed Code Copy Button */}
                      <button
                        onClick={() => setEmbedPost(post)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 border border-slate-300 transition-colors ml-2"
                        title="Embed this article on external websites"
                      >
                        <Code size={12} />
                        <span>Embed</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Embed Code Modal */}
      <AnimatePresence>
        {embedPost && (
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
                  onClick={() => setEmbedPost(null)}
                  className="text-slate-400 hover:text-slate-900 text-sm font-mono p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Copy and paste the HTML iframe below into any external blog, documentation portal, or CMS (WordPress, Webflow, Ghost) to render this live security advisory:
              </p>

              <div className="bg-[#0B1120] p-4 border border-slate-700 text-[#38BDF8] font-mono text-xs overflow-x-auto mb-4 leading-relaxed">
                <code className="text-[#38BDF8] !text-[#38BDF8]">
                  {`<iframe src="${window.location.origin}/posts/${embedPost.slug}" width="100%" height="600" frameborder="0" style="border:1px solid #CED4DA;"></iframe>`}
                </code>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-slate-500">
                  Responsive • Standalone sandbox ready
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyEmbed(embedPost)}
                    className="inline-flex items-center gap-1.5 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 transition-colors"
                  >
                    {copiedEmbed ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedEmbed ? "Copied to Clipboard" : "Copy Embed Code"}</span>
                  </button>
                  <button
                    onClick={() => setEmbedPost(null)}
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

      {/* Interactive Image Ingestion & Formatting Facility */}
      <AnimatePresence>
        {showImageTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-300 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#FF5A36] tracking-widest block">
                    Content Authoring Facility
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Insert Image from URL with Caption
                  </h3>
                </div>
                <button
                  onClick={() => setShowImageTool(false)}
                  className="text-slate-400 hover:text-slate-900 text-sm font-mono p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Provide an image URL from Unsplash or your storage bucket along with a technical caption. The tool generates ready-to-paste markdown for news posts with standardized caption formatting.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Image Source URL
                  </label>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200"
                    className="w-full p-2.5 border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-slate-800"
                  />
                  <div className="flex gap-2 mt-1.5 text-[11px] text-slate-500 font-mono">
                    <span>Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => setImageUrlInput("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200")}
                      className="text-[#111A4D] underline hover:text-[#FF5A36]"
                    >
                      Server Cluster
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setImageUrlInput("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200")}
                      className="text-[#111A4D] underline hover:text-[#FF5A36]"
                    >
                      Cyber Sandbox
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setImageUrlInput("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200")}
                      className="text-[#111A4D] underline hover:text-[#FF5A36]"
                    >
                      AI Neural Logits
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Caption Annotation
                  </label>
                  <input
                    type="text"
                    value={imageCaptionInput}
                    onChange={(e) => setImageCaptionInput(e.target.value)}
                    placeholder="Figure 2: Memory extraction dump and zero-day execution boundary."
                    className="w-full p-2.5 border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {imageUrlInput.trim() && (
                <div className="mb-6 border border-slate-300 bg-slate-50 p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2 font-bold">
                    Live Rendering Preview
                  </span>
                  <div className="bg-white border border-slate-200 p-2">
                    <img
                      src={imageUrlInput}
                      alt={imageCaptionInput || "Preview"}
                      className="w-full h-48 object-cover border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200";
                      }}
                    />
                    <p className="text-[11px] font-mono text-slate-500 mt-2 text-center not-italic font-normal">
                      {imageCaptionInput || "Figure: Technical illustration caption."}
                    </p>
                  </div>
                </div>
              )}

              {/* Generated Markdown Output */}
              {generatedMarkdownTag && (
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Generated Markdown Tag
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedMarkdownTag}
                      className="w-full p-2.5 border border-slate-300 bg-slate-100 font-mono text-xs text-slate-800 select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedMarkdownTag);
                        setCopiedMarkdown(true);
                        setTimeout(() => setCopiedMarkdown(false), 2000);
                      }}
                      className="shrink-0 inline-flex items-center gap-1 bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-xs uppercase px-4 py-2.5 transition-colors"
                    >
                      {copiedMarkdown ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedMarkdown ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  onClick={() => setShowImageTool(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider px-4 py-2 border border-slate-300 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
