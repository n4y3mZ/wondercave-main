import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronRight, FileText, ShieldAlert, Cpu, Building2, BookOpen, Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  path: string;
  category: "Vulnerabilities" | "Products" | "Solutions" | "Blog & Research" | "WonderCave Labs" | "General";
}

const STATIC_ENTRIES: SearchItem[] = [
  {
    id: "posts",
    title: "Security Intelligence & Technical Dispatches",
    subtitle: "Peer-reviewed vulnerability research, zero-day advisories, and academy news.",
    content: "Zero-day prompt injection, CDN delimiter bypasses, post-quantum cryptography labs, and threat intelligence.",
    path: "/posts",
    category: "Blog & Research"
  },
  {
    id: "showcase",
    title: "Security Architecture Showcase",
    subtitle: "Production-ready vulnerability management modules, crawler engines, and blueprints.",
    content: "Explore live interactive demos, API specs, and deployable enterprise security assets.",
    path: "/showcase",
    category: "Products"
  },
  {
    id: "careers",
    title: "Engineering & Research Fellowship",
    subtitle: "Hall of fame contributors, ethical hacking fellowships, and security engineering.",
    content: "Responsible disclosure, bug bounties, lab author contributions, and open security research.",
    path: "/careers",
    category: "WonderCave Labs"
  },
  {
    id: "support",
    title: "WonderCave Support & Advisory",
    subtitle: "Technical assistance, enterprise deployment support, and incident advisories.",
    content: "Direct support channels managed centrally for wondercave.nayem.net by Nayem Hasan.",
    path: "/support",
    category: "General"
  },
  {
    id: "dashboard",
    title: "Enterprise Console & Settings",
    subtitle: "MRR telemetry, database sync management, and platform analytics.",
    content: "Manage Google Sheets database connection, live CSV sync, and system notices.",
    path: "/dashboard",
    category: "General"
  },
  {
    id: "redirects",
    title: "HTTP 301 Permanent Redirects",
    subtitle: "System redirect handler and canonical document locator.",
    content: "Relocate deprecated endpoints to their permanent WonderCave destinations.",
    path: "/301",
    category: "General"
  }
];

function resolveItemPath(slug: string): { path: string; category: SearchItem["category"] } {
  const vulnSlugs = [
    "cross-site-scripting", "sql-injection", "cross-site-request-forgery",
    "xxe-injection", "web-cache-deception", "web-llm-attacks", "api-testing",
    "nosql-injection", "directory-traversal", "ssrf", "cors",
    "command-injection", "access-control", "jwt-attacks", "race-conditions"
  ];
  if (vulnSlugs.includes(slug)) {
    return { path: `/topics/${slug}`, category: "Vulnerabilities" };
  }

  if (slug === "vulnerability-scanner" || slug === "suite-editions") {
    return { path: `/products/${slug}`, category: "Products" };
  }
  if (slug === "enterprise") {
    return { path: `/products/enterprise`, category: "Products" };
  }
  if (slug === "products") {
    return { path: `/products`, category: "Products" };
  }

  if (slug === "manufacturing" || slug === "retail" || slug === "healthcare") {
    return { path: `/solutions/${slug}`, category: "Solutions" };
  }
  if (slug === "solutions") {
    return { path: `/solutions`, category: "Solutions" };
  }

  if (slug === "organizations" || slug === "testers" || slug === "developers") {
    return { path: `/customers/${slug}`, category: "General" };
  }

  if (["blog", "case-studies", "documentation", "research", "webinars", "release-notes"].includes(slug)) {
    return { path: `/${slug}`, category: "Blog & Research" };
  }

  if (["learning-paths", "latest-topics", "all-content", "hall-of-fame", "get-started", "get-certified", "labs", "events"].includes(slug)) {
    return { path: `/${slug}`, category: "WonderCave Labs" };
  }

  return { path: `/${slug}`, category: "General" };
}

function getCategoryIcon(cat: SearchItem["category"]) {
  switch (cat) {
    case "Vulnerabilities":
      return <ShieldAlert size={14} className="text-[#FF5A36] shrink-0" />;
    case "Products":
      return <Cpu size={14} className="text-[#111A4D] shrink-0" />;
    case "Solutions":
      return <Building2 size={14} className="text-emerald-700 shrink-0" />;
    case "Blog & Research":
      return <FileText size={14} className="text-indigo-700 shrink-0" />;
    case "WonderCave Labs":
      return <BookOpen size={14} className="text-amber-700 shrink-0" />;
    default:
      return <Sparkles size={14} className="text-slate-600 shrink-0" />;
  }
}

interface GlobalSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function GlobalSearchBar({ isOpen, onClose, onOpen }: GlobalSearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch indexed pages and posts
  useEffect(() => {
    fetch("/api/pages")
      .then(res => res.json())
      .then((data: Record<string, any>) => {
        if (!data) return;
        const mapped: SearchItem[] = Object.entries(data).map(([slug, page]) => {
          const { path, category } = resolveItemPath(slug);
          return {
            id: slug,
            title: page.title || slug.replace(/-/g, " "),
            subtitle: page.subtitle || "",
            content: (page.content || "").replace(/[#*`_[\]()]/g, " ").slice(0, 500),
            path,
            category
          };
        });
        setItems([...STATIC_ENTRIES, ...mapped]);
      })
      .catch((err) => {
        console.warn("Unable to fetch page search index:", err);
        setItems(STATIC_ENTRIES);
      });
  }, []);

  // Global hotkey: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpen, onClose]);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on query & category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const subtitleMatch = item.subtitle.toLowerCase().includes(q);
      const contentMatch = item.content.toLowerCase().includes(q);
      const idMatch = item.id.toLowerCase().includes(q);
      const pathMatch = item.path.toLowerCase().includes(q);

      return titleMatch || subtitleMatch || contentMatch || idMatch || pathMatch;
    });
  }, [items, query, activeCategory]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  const handleSelectResult = (item: SearchItem) => {
    onClose();
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/topics/${encodeURIComponent(query.trim().toLowerCase().replace(/\s+/g, "-"))}`);
        onClose();
      }
    }
  };

  const categories = ["All", "Vulnerabilities", "Products", "Solutions", "Blog & Research", "WonderCave Labs"];

  return (
    <>
      {/* Navbar Embedded Search Trigger Button (Desktop) */}
      <button
        onClick={onOpen}
        type="button"
        className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#E9ECEF] hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors rounded-none text-xs w-48 lg:w-64 justify-between select-none cursor-pointer"
        aria-label="Search WonderCave content"
      >
        <div className="flex items-center gap-2 truncate">
          <Search size={14} className="text-slate-500 shrink-0" />
          <span className="truncate text-slate-500 font-normal">Search pages & blog...</span>
        </div>
        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-300 rounded-none shadow-none">
          ⌘K
        </kbd>
      </button>

      {/* Navbar Search Icon Button (Mobile) */}
      <button
        onClick={onOpen}
        type="button"
        className="md:hidden text-slate-700 p-2 hover:bg-slate-100 border border-slate-300 rounded-none"
        aria-label="Search"
      >
        <Search size={16} />
      </button>

      {/* Search Modal / Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.12 }}
              className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-none shadow-2xl overflow-hidden font-sans z-10 flex flex-col max-h-[82vh]"
            >
              {/* Header Input Area */}
              <div className="flex items-center px-4 py-3.5 border-b border-slate-300 bg-white">
                <Search size={18} className="text-[#FF5A36] shrink-0 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Filter by vulnerability (e.g. XSS, SQLi), product, solution, or blog post..."
                  className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-none mr-2 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-2 py-1 text-xs font-mono font-bold text-slate-600 bg-[#E9ECEF] border border-slate-300 hover:bg-slate-200 rounded-none transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 px-4 py-2 bg-[#E9ECEF] border-b border-slate-300 overflow-x-auto scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap text-xs">
                <span className="font-mono text-[11px] font-bold text-slate-500 uppercase mr-1">Filter:</span>
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-none border transition-colors ${
                        isSelected
                          ? "bg-[#111A4D] text-white border-[#111A4D]"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Live Filter Results List */}
              <div
                ref={resultsContainerRef}
                className="flex-1 overflow-y-auto divide-y divide-slate-200 bg-white"
              >
                {filteredResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      <span>{filteredResults.length} {filteredResults.length === 1 ? "Indexed Item" : "Indexed Items"} Found</span>
                      <span className="hidden sm:inline">Use ↑ ↓ keys to navigate / Enter to select</span>
                    </div>

                    {filteredResults.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.id + item.path}
                          onClick={() => handleSelectResult(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`px-4 py-3 cursor-pointer flex items-start justify-between gap-4 transition-colors ${
                            isSelected ? "bg-slate-100 border-l-4 border-l-[#111A4D]" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="mt-0.5 p-1.5 bg-[#E9ECEF] border border-slate-300 rounded-none">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-bold text-sm text-slate-900 truncate">
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-600 uppercase tracking-wider rounded-none">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                                {item.subtitle || item.content}
                              </p>
                              <div className="mt-1 text-[11px] font-mono text-slate-400 truncate">
                                Path: <span className="text-slate-600">{item.path}</span>
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center text-xs font-semibold text-slate-400 self-center">
                            {isSelected ? (
                              <span className="flex items-center gap-1 text-[#111A4D]">
                                Open <CornerDownLeft size={13} />
                              </span>
                            ) : (
                              <ChevronRight size={15} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 px-6 text-center">
                    <div className="w-12 h-12 bg-[#E9ECEF] border border-slate-300 mx-auto mb-3 flex items-center justify-center text-slate-500 rounded-none">
                      <Search size={22} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      No matching pages or posts
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
                      We couldn't find anything matching &ldquo;{query}&rdquo;. Try keywords like <code className="bg-slate-100 px-1 py-0.5 font-mono text-slate-800">xss</code>, <code className="bg-slate-100 px-1 py-0.5 font-mono text-slate-800">injection</code>, <code className="bg-slate-100 px-1 py-0.5 font-mono text-slate-800">scanner</code>, or <code className="bg-slate-100 px-1 py-0.5 font-mono text-slate-800">enterprise</code>.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Cross-site scripting", "SQL injection", "Vulnerability Scanner", "Manufacturing Security", "Research Blog"].map(suggest => (
                        <button
                          key={suggest}
                          onClick={() => setQuery(suggest)}
                          className="text-xs font-medium px-2.5 py-1 bg-[#E9ECEF] border border-slate-300 text-slate-800 hover:bg-slate-200 rounded-none transition-colors"
                        >
                          {suggest}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Helper Bar */}
              <div className="px-4 py-2.5 bg-[#E9ECEF] border-t border-slate-300 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <div className="flex items-center gap-4">
                  <span>Navigation: <kbd className="bg-white px-1 border border-slate-300 text-slate-800">↑</kbd> <kbd className="bg-white px-1 border border-slate-300 text-slate-800">↓</kbd></span>
                  <span>Select: <kbd className="bg-white px-1 border border-slate-300 text-slate-800">↵</kbd></span>
                  <span>Dismiss: <kbd className="bg-white px-1 border border-slate-300 text-slate-800">ESC</kbd></span>
                </div>
                <div className="hidden sm:block text-slate-500">
                  Global Index / wondercave.nayem.net
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
