import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COOKIE_CONSENT_KEY = "wondercave_cookie_consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given via cookie or localStorage
    const hasConsentCookie = document.cookie
      .split("; ")
      .some(row => row.startsWith(`${COOKIE_CONSENT_KEY}=`));
    const hasConsentStorage = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!hasConsentCookie && !hasConsentStorage) {
      // Small timeout for smooth entrance at start
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (choice: "all" | "essential") => {
    try {
      // 1 year expiry
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${COOKIE_CONSENT_KEY}=${choice}; path=/; max-age=${maxAge}; SameSite=Lax`;
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // fallback
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-lg z-50 pointer-events-auto"
        >
          {/* Glassmorphism Container */}
          <div className="relative backdrop-blur-md bg-white/80 dark:bg-[#0D153B]/80 border border-slate-300/70 dark:border-white/20 shadow-2xl p-4 sm:p-5 transition-all">
            {/* Close button */}
            <button
              onClick={() => handleAccept("essential")}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 transition-colors"
              aria-label="Dismiss cookie notice"
            >
              <X size={15} />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#111A4D]/10 dark:bg-white/10 text-[#FF5A36] shrink-0 border border-slate-200 dark:border-white/10">
                <Cookie size={18} />
              </div>

              <div className="flex-1 pr-3 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Cookie & Session Notice
                  </h4>
               
                </div>

                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  WonderCave uses essential cookies and secure session tokens to authenticate lab environments, defend application state, and track cybersecurity progress.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button
                    onClick={() => handleAccept("all")}
                    className="bg-[#111A4D] hover:bg-slate-900 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1.5 transition-colors border border-[#111A4D] cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => handleAccept("essential")}
                    className="bg-white/90 hover:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-bold text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1.5 transition-colors border border-slate-300 dark:border-slate-600 cursor-pointer"
                  >
                    Essential Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
