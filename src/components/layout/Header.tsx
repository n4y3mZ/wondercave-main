import { Link, useLocation } from "react-router-dom";
import { Menu, X, AlignJustify, Search, ChevronDown, ArrowRight, UserCheck, LogOut, ShieldCheck, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "../Logo";
import GlobalSearchBar from "./GlobalSearchBar";
import { auth, onAuthStateChanged, signOut } from "../../firebase";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Listen to Firebase auth state and local storage
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Member",
          email: user.email,
          photoURL: user.photoURL
        });
      } else {
        const stored = localStorage.getItem("sc_user");
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("sc_token");
    localStorage.removeItem("sc_token_expiry");
    localStorage.removeItem("sc_user");
    setCurrentUser(null);
  };

  // Scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Fetch announcement
  useEffect(() => {
    fetch('/api/announcement')
      .then(res => res.json())
      .then(data => {
        setAnnouncement(data);
        setShowAnnouncement(data?.show ?? false);
      })
      .catch(console.error);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col bg-white border-b border-slate-300 shadow-none">
        {/* Announcement Bar */}
        <AnimatePresence>
          {showAnnouncement && announcement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`${announcement.backgroundColor || 'bg-[#111A4D]'} ${announcement.textColor || 'text-white'} text-xs md:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 flex justify-between items-center overflow-hidden border-b border-slate-700`}
            >
              <div className="flex-1 text-center truncate sm:whitespace-normal">
                {announcement.message}{" "}
                <Link to={announcement.linkUrl || "/learning-paths"} className="underline font-bold hover:opacity-80 transition-opacity ml-1">
                  {announcement.linkText || "Learn more →"}
                </Link>
              </div>
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="hover:opacity-80 transition-opacity p-1 rounded-none focus:outline-none shrink-0"
                aria-label="Close announcement"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Utility Bar (Responsive on Android & Mobile) */}
        <div className="w-full flex justify-between items-center px-3 sm:px-6 py-1.5 sm:py-2 border-b border-slate-200 bg-[#E9ECEF] text-[11px] sm:text-xs text-slate-600">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-bold text-slate-900 shrink-0">WonderCave</span>
            <span className="text-slate-400 shrink-0">/</span>
            <span className="truncate text-slate-600">
              <span className="hidden md:inline">wondercave.nayem.net • </span>Free Enterprise Training
            </span>
          </div>

          {/* Desktop/Tablet Utility Actions (Hidden on mobile to avoid duplicate buttons) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-4 shrink-0">
            <Link to="/posts" className="hover:text-[#FF5A36] font-bold text-slate-800">
              Posts
            </Link>
            
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center gap-1 bg-[#111A4D] hover:bg-slate-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white px-2 sm:px-3 py-1 rounded-none transition-colors"
                >
                  <UserCheck size={11} className="text-emerald-400" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-slate-500 hover:text-red-700 transition-colors p-1"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#111A4D] hover:bg-slate-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white px-2.5 sm:px-3 py-1 rounded-none transition-colors"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="w-full h-14 sm:h-16 bg-white flex items-center justify-between px-3 sm:px-6 relative">
          <div className="flex items-center gap-2 sm:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-xl text-slate-900 tracking-tight relative z-20 shrink-0">
              <Logo className="w-7 h-7 sm:w-8 sm:h-8 rounded-none shrink-0" />
              <span className="truncate">WonderCave</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-700 relative z-20">
              
              {/* Dropdown 1: Products */}
              <div className="relative group">
                <button 
                  className={`flex items-center gap-1 transition-colors hover:text-brand-primary py-5 rounded-none ${activeDropdown === "products" ? "text-brand-primary" : ""}`}
                  onClick={() => toggleDropdown("products")}
                  aria-expanded={activeDropdown === "products"}
                >
                  Products <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "products" ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === "products" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-[780px] bg-white border border-slate-300 shadow-xl rounded-none overflow-hidden flex"
                    >
                      <div className="w-1/3 bg-slate-50 p-6 border-r border-slate-200 pointer-events-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Enterprise Edition</h3>
                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">Full security assessment, continuous vulnerability crawler, and threat intelligence.</p>
                        <img 
                          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=85&w=800" 
                          alt="Enterprise Edition" 
                          className="w-full h-28 object-cover rounded-none border border-slate-300"
                        />
                        <Link to="/products/enterprise" className="mt-3 flex items-center gap-1 text-xs font-bold text-[#111A4D] hover:underline">
                          View details <ArrowRight size={13} />
                        </Link>
                      </div>
                      <div className="w-2/3 p-6 grid grid-cols-2 gap-x-6 gap-y-4 pointer-events-auto">
                        <Link to="/products/vulnerability-scanner" className="hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Vulnerability Scanner</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Automated deep-crawling web engine.</p>
                        </Link>
                        <Link to="/products/suite-editions" className="hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Suite Editions</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Community, Pro, and Enterprise tiers.</p>
                        </Link>
                        <Link to="/release-notes" className="hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Release Notes</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Latest scanner releases and changelogs.</p>
                        </Link>
                        <Link to="/products" className="hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">All Security Tools</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Explore the complete assessment catalog.</p>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 2: Solutions */}
              <div className="relative group">
                <button 
                  className={`flex items-center gap-1 transition-colors hover:text-brand-primary py-5 rounded-none ${activeDropdown === "solutions" ? "text-brand-primary" : ""}`}
                  onClick={() => toggleDropdown("solutions")}
                  aria-expanded={activeDropdown === "solutions"}
                >
                  Solutions <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "solutions" ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === "solutions" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full -left-16 w-[620px] bg-white border border-slate-300 shadow-xl rounded-none overflow-hidden p-6 gap-6 grid grid-cols-2 pointer-events-auto"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=85&w=800" 
                        alt="Industry Solutions" 
                        className="w-full h-full object-cover border border-slate-300 rounded-none bg-slate-100 col-span-1"
                      />
                      <div className="flex flex-col gap-3 justify-center">
                        <Link to="/solutions/manufacturing" className="group block p-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-primary">Manufacturing & OT</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">SCADA and industrial network perimeter security.</p>
                        </Link>
                        <Link to="/solutions/retail" className="group block p-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-primary">E-Commerce & Retail</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">PCI-DSS compliance and payment flow protection.</p>
                        </Link>
                        <Link to="/solutions/healthcare" className="group block p-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-primary">Healthcare & HIPAA</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Secure patient portals and EHR encryption verification.</p>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 3: Resources */}
              <div className="relative group">
                <button 
                  className={`flex items-center gap-1 transition-colors hover:text-brand-primary py-5 rounded-none ${activeDropdown === "resources" ? "text-brand-primary" : ""}`}
                  onClick={() => toggleDropdown("resources")}
                  aria-expanded={activeDropdown === "resources"}
                >
                  Resources <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === "resources" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full -left-32 w-[600px] bg-white border border-slate-300 shadow-xl rounded-none overflow-hidden p-6 grid grid-cols-2 gap-4 pointer-events-auto"
                    >
                      <div className="border-r border-slate-200 pr-4 space-y-3">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Learning & Labs</span>
                        <Link to="/learning-paths" className="block hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Learning Paths</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Structured cybersecurity tracks from zero to practitioner.</p>
                        </Link>
                        <Link to="/academy" className="block hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">WonderCave Labs</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Real-world simulated vulnerability environments.</p>
                        </Link>
                        <Link to="/posts" className="block hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-[#FF5A36]">Security Posts & Dispatches</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Zero-day disclosures and peer-reviewed writeups.</p>
                        </Link>
                      </div>
                      <div className="pl-2 space-y-3">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Community & Research</span>
                        <Link to="/hall-of-fame" className="block hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Hall of Fame</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Top ethical researchers and contributor rankings.</p>
                        </Link>
                        <Link to="/get-certified" className="block hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Certification Exams</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Professional credentials verified by Nayem Hasan.</p>
                        </Link>
                        <Link to="/blog" className="block hover:bg-slate-50 p-2 border border-transparent hover:border-slate-200 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">Engineering Blog</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Architecture breakdowns and exploit analysis.</p>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/posts" className="transition-colors hover:text-[#FF5A36] py-5 font-bold text-[#FF5A36]">
                Posts
              </Link>
              <Link to="/showcase" className="transition-colors hover:text-brand-primary py-5">
                Showcase
              </Link>
              <Link to="/pricing" className="transition-colors hover:text-brand-primary py-5">
                Pricing
              </Link>
              <Link to="/support" className="transition-colors hover:text-brand-primary py-5">
                Support
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 relative z-20 shrink-0">
            {/* Global Search Bar Trigger (Desktop & Mobile) */}
            <GlobalSearchBar 
              isOpen={isSearchOpen} 
              onOpen={() => {
                setIsSearchOpen(true);
                setActiveDropdown(null);
                setIsMobileMenuOpen(false);
              }} 
              onClose={() => setIsSearchOpen(false)} 
            />

            {/* Mobile Navigation Controls (Android Optimized) */}
            <div className="flex items-center gap-1 sm:gap-1.5 lg:hidden shrink-0">
              {currentUser ? (
                <Link 
                  to="/dashboard" 
                  className="bg-[#111A4D] hover:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-white px-2 py-1.5 rounded-none flex items-center gap-1 shrink-0"
                >
                  <User size={11} className="text-emerald-400" />
                  <span className="max-w-[65px] truncate">APP</span>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-[#111A4D] hover:bg-slate-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white px-2.5 py-1.5 rounded-none shrink-0"
                >
                  LOGIN
                </Link>
              )}

              {/* Hamburger Button: ALWAYS visible and interactive on Mobile/Android */}
              <button 
                className="text-slate-900 p-2 min-w-[38px] min-h-[38px] border border-slate-300 rounded-none hover:bg-slate-100 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsSearchOpen(false);
                }} 
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <AlignJustify size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer (Anchored directly inside sticky header) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-b-2 border-slate-900 shadow-2xl w-full overflow-hidden max-h-[calc(100vh-110px)] overflow-y-auto no-scrollbar scrollbar-none"
            >
            {/* User Session Banner (if logged in) */}
            {currentUser && (
              <div className="bg-[#111A4D] text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/10 flex items-center justify-center">
                    <UserCheck size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{currentUser.name}</span>
                    <span className="text-[10px] font-mono text-slate-300 block">{currentUser.email}</span>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2.5 py-1 bg-white text-[#111A4D] font-bold text-[10px] uppercase tracking-wider"
                >
                  Open Dashboard
                </Link>
              </div>
            )}

            <nav className="flex flex-col px-4 sm:px-6 py-3 divide-y divide-slate-100">
              <Link 
                to="/posts" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-[#FF5A36] flex justify-between items-center"
              >
                <span>Security Posts & Dispatches</span>
                <span className="px-1.5 py-0.5 bg-red-100 text-[#FF5A36] text-[10px] font-mono font-bold uppercase">HOT</span>
              </Link>
              
              <Link 
                to="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Products & Tools</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/solutions" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Solutions</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/learning-paths" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Learning Paths</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/resources" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Resources & Documentation</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/showcase" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Showcase</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/pricing" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Pricing</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/support" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Support & Contact</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>

              <Link 
                to="/careers" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-xs font-bold text-slate-800 flex justify-between items-center"
              >
                <span>Careers</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
            </nav>

            {/* Bottom Actions inside drawer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider border border-red-300 flex items-center justify-center gap-1.5"
                >
                  <LogOut size={13} />
                  <span>Sign Out of Account</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 bg-[#111A4D] text-white font-bold text-xs uppercase tracking-wider text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
              <div className="text-center pt-1 text-[10px] font-mono text-slate-400">
                wondercave.nayem.net • Nayem Hasan
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>

      {/* Global Backdrop for mega menus */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[110px] bg-slate-900/20 z-10 hidden lg:block"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
