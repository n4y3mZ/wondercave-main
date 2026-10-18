import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Target, RefreshCcw, BookOpen, ChevronRight, ArrowRight } from "lucide-react";
import Seo from "../components/layout/Seo";

export default function Home() {
  return (
    <div className="w-full bg-[#E9ECEF] text-slate-900 font-sans">
      <Seo 
        title="WonderCave" 
        description="The free commercial-grade cybersecurity training and technology portal for everyone. Managed by Nayem Hasan at wondercave.nayem.net." 
      />

      {/* Sub Navigation with robust mobile scrollbar suppression */}
      <nav 
        aria-label="Sub navigation"
        className="w-full border-b border-slate-300 bg-white flex justify-start sm:justify-center py-2.5 overflow-x-auto no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-center gap-5 sm:gap-6 text-xs font-semibold text-slate-700 max-w-7xl px-4 whitespace-nowrap">
          <Link to="/dashboard" className="hover:text-brand-primary transition-colors py-0.5">Dashboard</Link>
          <Link to="/learning-paths" className="hover:text-brand-primary transition-colors py-0.5">Learning paths</Link>
          <Link to="/latest-topics" className="hover:text-brand-primary transition-colors py-0.5">Latest topics</Link>
          <Link to="/all-content" className="hover:text-brand-primary transition-colors py-0.5">All content</Link>
          <Link to="/hall-of-fame" className="hover:text-brand-primary transition-colors py-0.5">Hall of Fame</Link>
          <Link to="/get-started" className="hover:text-brand-primary transition-colors py-0.5">Get started</Link>
          <Link to="/get-certified" className="hover:text-brand-primary transition-colors py-0.5">Get certified</Link>
          <Link to="/posts" className="hover:text-brand-primary transition-colors font-bold text-[#FF5A36] py-0.5">Posts</Link>
        </div>
      </nav>

      {/* Hero Section with High-Tech Background Image & Dark Overlay */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800 pt-16 pb-16 sm:pt-24 sm:pb-24 px-4">
        {/* Background Tech Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=85&w=1920" 
            alt="Cybersecurity infrastructure network" 
            className="w-full h-full object-cover opacity-35"
            loading="eager"
          />
          {/* Dark Overlay for razor-sharp legibility */}
          <div className="absolute inset-0 bg-[#0B112C]/90 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex justify-center mb-3 sm:mb-4">
             <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Web<span className="text-[#FF5A36]">&nbsp;Security&nbsp;</span>Hub
             </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-xs sm:text-base md:text-lg text-slate-200 font-normal mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            The free commercial-grade cybersecurity training and vulnerability intelligence platform for defenders, engineers, and researchers.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link to="/login" className="bg-[#FF5A36] hover:bg-[#e04826] text-white font-bold py-3 px-8 w-full sm:w-48 text-center text-xs sm:text-sm rounded-none shadow-lg transition-colors uppercase tracking-wider border border-[#FF5A36]">
              Sign up
            </Link>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 font-bold py-3 w-full sm:w-48 text-center text-xs sm:text-sm rounded-none backdrop-blur-xs transition-colors uppercase tracking-wider">
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Props & Featured Lab */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-slate-300 p-6 rounded-none flex gap-4 items-start shadow-none">
            <div className="p-2.5 bg-slate-100 text-[#FF5A36] border border-slate-200 rounded-none shrink-0">
               <Target size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Boost your career</h3>
              <p className="text-slate-600 text-xs leading-relaxed">WonderCave is a verified commercial-grade step toward cybersecurity leadership.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-300 p-6 rounded-none flex gap-4 items-start shadow-none">
            <div className="p-2.5 bg-slate-100 text-[#111A4D] border border-slate-200 rounded-none shrink-0">
               <RefreshCcw size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Flexible learning</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Learn anywhere, anytime with interactive sandbox labs and live progress tracking.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-300 p-6 rounded-none flex gap-4 items-start shadow-none">
            <div className="p-2.5 bg-slate-100 text-green-700 border border-slate-200 rounded-none shrink-0">
               <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Learn from experts</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Authored by world-class security researchers and updated continuously.</p>
            </div>
          </div>
        </div>

        {/* New Labs Banner with HD Tech Image */}
        <div className="bg-white border border-slate-300 rounded-none p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-none">
          <div className="w-full md:w-2/5 shrink-0">
             <div className="w-full h-56 bg-slate-100 border border-slate-300 overflow-hidden rounded-none">
               <img 
                 loading="lazy" 
                 src="https://wallpapercave.com/wp/wp4063801.jpg" 
                 alt="AI Security Testing Lab" 
                 referrerPolicy="no-referrer"
                 className="w-full h-full object-cover rounded-none" 
               />
             </div>
          </div>
          <div className="w-full md:w-3/5">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">New Release / Interactive Sandbox</div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">AI-Powered Scanner & LLM Vulnerabilities</h2>
            <p className="text-slate-600 text-xs md:text-sm mb-6 leading-relaxed">
              Explore indirect prompt injection, SSRF chains against internal inference endpoints, and automated payload crafting to audit AI-driven web systems in enterprise production.
            </p>
            <Link to="/topics/web-llm-attacks" className="text-[#FF5A36] text-xs font-bold flex items-center gap-1 hover:underline uppercase tracking-wider">
              Launch Interactive Lab <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Materials & Labs Grid */}
      <section className="bg-[#DEE2E6] py-16 px-4 border-t border-b border-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-mono font-bold text-[#FF5A36] uppercase tracking-widest mb-1.5">Interactive Cybersecurity Sandbox</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Curriculum & Interactive Labs</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore hands-on vulnerability scenarios, dissect real-world breach mechanics, and verify defenses in live isolated virtual environments.
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-5 border-b border-slate-300 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Latest Modules</h3>
            <span className="text-[11px] font-mono text-slate-500 uppercase">Live Sandboxes Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
               { 
                 title: "Web Cache Deception", 
                 slug: "web-cache-deception", 
                 category: "CDN & PROXY",
                 desc: "Exploit path delimiter discrepancies to coerce edge caches into exposing private accounts.",
                 bgImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#111A4D]/90 via-[#182357]/85 to-[#0b102b]/95"
               },
               { 
                 title: "Web LLM Attacks", 
                 slug: "web-llm-attacks", 
                 category: "NEURAL INFERENCE",
                 desc: "Indirect prompt injection, autonomous agent hijacking, and exfiltrating private RAG memory.",
                 bgImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#111A4D]/90 via-[#182357]/85 to-[#0b102b]/95"
               },
               { 
                 title: "API Security & BOLA", 
                 slug: "api-testing", 
                 category: "REST & GRAPHQL",
                 desc: "Broken Object Level Authorization, mass assignment, and tenant boundary traversal.",
                 bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#111A4D]/90 via-[#182357]/85 to-[#0b102b]/95"
               },
               { 
                 title: "NoSQL Injection", 
                 slug: "nosql-injection", 
                 category: "DATABASE DEFENSE",
                 desc: "MongoDB JSON operator injections, blind regex exfiltration, and $where execution.",
                 bgImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#111A4D]/90 via-[#182357]/85 to-[#0b102b]/95"
               }
             ].map((topic, i) => (
               <Link 
                 key={i} 
                 to={`/topics/${topic.slug}`} 
                 className="relative group block rounded-none min-h-[230px] p-6 text-white overflow-hidden border border-slate-700 hover:border-[#FF5A36] transition-all duration-300 flex flex-col justify-between shadow-sm"
               >
                 {/* Blurred Image Background with Subtle Gradient Overlay */}
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   <img 
                     src={topic.bgImage} 
                     alt={topic.title}
                     className="w-full h-full object-cover blur-[5px] scale-105 opacity-25 group-hover:opacity-40 group-hover:scale-115 transition-all duration-700" 
                   />
                   <div className={`absolute inset-0 ${topic.gradientOverlay}`}></div>
                 </div>

                 {/* Card Content */}
                 <div className="relative z-10">
                   <div className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#FF5A36] uppercase bg-black/40 px-2 py-0.5 mb-3 border border-[#FF5A36]/30">
                     {topic.category}
                   </div>
                   <h4 className="text-lg font-bold leading-snug tracking-tight mb-2 group-hover:text-amber-200 transition-colors">
                     {topic.title}
                   </h4>
                   <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                     {topic.desc}
                   </p>
                 </div>

                 <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-slate-200">
                   <span className="uppercase tracking-wider text-[11px] group-hover:text-[#FF5A36] transition-colors">Launch Sandbox</span>
                   <div className="w-7 h-7 rounded-none border border-white/20 bg-black/30 flex items-center justify-center group-hover:border-[#FF5A36] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 transition-all">
                     <ChevronRight size={14} />
                   </div>
                 </div>
               </Link>
             ))}
          </div>

          <div className="flex items-center justify-between mb-5 border-b border-slate-300 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Featured Exploits</h3>
            <span className="text-[11px] font-mono text-slate-500 uppercase">Core Vulnerability Profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
               { 
                 title: "SQL Injection", 
                 slug: "sql-injection", 
                 category: "RELATIONAL DB",
                 desc: "UNION payloads, blind inferential extraction, and second-order database compromise.",
                 bgImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#1E293B]/90 via-[#182030]/85 to-[#0F172A]/95"
               },
               { 
                 title: "Cross-Site Scripting", 
                 slug: "cross-site-scripting", 
                 category: "DOM & BROWSERS",
                 desc: "Stored, reflected, and DOM-based JavaScript execution, session theft, and CSP evasion.",
                 bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#1E293B]/90 via-[#182030]/85 to-[#0F172A]/95"
               },
               { 
                 title: "Cross-Site Request Forgery", 
                 slug: "cross-site-request-forgery", 
                 category: "SESSION BOUNDARY",
                 desc: "Ambient cookie abuse, cross-origin state tampering, and SameSite attribute defense.",
                 bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#1E293B]/90 via-[#182030]/85 to-[#0F172A]/95"
               },
               { 
                 title: "XXE Injection", 
                 slug: "xxe-injection", 
                 category: "PARSER SECURITY",
                 desc: "External DTD evaluation, arbitrary local file disclosure, and cloud metadata SSRF.",
                 bgImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
                 gradientOverlay: "bg-gradient-to-br from-[#1E293B]/90 via-[#182030]/85 to-[#0F172A]/95"
               }
             ].map((topic, i) => (
               <Link 
                 key={i} 
                 to={`/topics/${topic.slug}`} 
                 className="relative group block rounded-none min-h-[230px] p-6 text-white overflow-hidden border border-slate-700 hover:border-[#FF5A36] transition-all duration-300 flex flex-col justify-between shadow-sm"
               >
                 {/* Blurred Image Background with Subtle Gradient Overlay */}
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   <img 
                     src={topic.bgImage} 
                     alt={topic.title}
                     className="w-full h-full object-cover blur-[5px] scale-105 opacity-25 group-hover:opacity-40 group-hover:scale-115 transition-all duration-700" 
                   />
                   <div className={`absolute inset-0 ${topic.gradientOverlay}`}></div>
                 </div>

                 {/* Card Content */}
                 <div className="relative z-10">
                   <div className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#FF5A36] uppercase bg-black/40 px-2 py-0.5 mb-3 border border-[#FF5A36]/30">
                     {topic.category}
                   </div>
                   <h4 className="text-lg font-bold leading-snug tracking-tight mb-2 group-hover:text-amber-200 transition-colors">
                     {topic.title}
                   </h4>
                   <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                     {topic.desc}
                   </p>
                 </div>

                 <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-slate-200">
                   <span className="uppercase tracking-wider text-[11px] group-hover:text-[#FF5A36] transition-colors">Launch Sandbox</span>
                   <div className="w-7 h-7 rounded-none border border-white/20 bg-black/30 flex items-center justify-center group-hover:border-[#FF5A36] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 transition-all">
                     <ChevronRight size={14} />
                   </div>
                 </div>
               </Link>
             ))}
          </div>

          <div className="text-center flex justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <Link to="/learning-materials" className="text-[#111A4D] hover:text-[#FF5A36] underline underline-offset-4">View all learning materials &rarr;</Link>
            <span className="text-slate-400">/</span>
            <Link to="/labs" className="text-[#111A4D] hover:text-[#FF5A36] underline underline-offset-4">View all labs &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Up-to-the-minute learning resources */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-4">Hands-on Security Engineering</h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
          WonderCave combines interactive attack simulations with defensive code patterns. Learn how vulnerabilities manifest in real software stacks and test your skills in isolated environments.
        </p>

        <div className="flex flex-col md:flex-row gap-8 bg-white border border-slate-300 p-8 rounded-none shadow-none mb-12">
           <div className="flex-1">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Code Analysis / XSS</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Reflected Cross-Site Scripting</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Reflected XSS arises when untrusted parameters from an HTTP request are echoed back into the response without contextual serialization or sanitization.
              </p>
              
              <div className="border border-slate-800 bg-slate-950 p-5 rounded-none font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                <div className="text-slate-500 mb-2">// Insecure reflection endpoint:</div>
                <div><span className="text-pink-400">GET</span> /status?message=<span className="text-amber-300">&lt;script&gt;alert(1)&lt;/script&gt;</span> HTTP/1.1</div>
                <div><span className="text-slate-500">Host:</span> api.internal.local</div>
                <div className="my-2 border-b border-slate-800"></div>
                <div className="text-slate-500 mb-1">// Server unescaped response:</div>
                <div>&lt;div class=&quot;notice&quot;&gt;<span className="text-amber-300">&lt;script&gt;alert(1)&lt;/script&gt;</span>&lt;/div&gt;</div>
              </div>
           </div>
           
           <div className="w-full md:w-64 flex flex-col gap-2.5 justify-center">
              <div className="flex items-center gap-3 bg-[#E9ECEF] px-4 py-3 border border-slate-300 rounded-none">
                 <span className="font-mono text-xs font-bold text-[#FF5A36] shrink-0">01</span>
                 <span className="text-xs font-semibold text-slate-800">Learn vulnerability signatures</span>
              </div>
              <div className="flex items-center gap-3 bg-[#E9ECEF] px-4 py-3 border border-slate-300 rounded-none">
                 <span className="font-mono text-xs font-bold text-[#111A4D] shrink-0">02</span>
                 <span className="text-xs font-semibold text-slate-800">Practice authorized penetration testing</span>
              </div>
              <div className="flex items-center gap-3 bg-[#E9ECEF] px-4 py-3 border border-slate-300 rounded-none">
                 <span className="font-mono text-xs font-bold text-[#FF5A36] shrink-0">03</span>
                 <span className="text-xs font-semibold text-slate-800">Solve interactive sandbox challenges</span>
              </div>
              <div className="flex items-center gap-3 bg-[#E9ECEF] px-4 py-3 border border-slate-300 rounded-none">
                 <span className="font-mono text-xs font-bold text-emerald-700 shrink-0">04</span>
                 <span className="text-xs font-semibold text-slate-800">Verify your certification badges</span>
              </div>
           </div>
        </div>
      </section>
      
      {/* All Topics directory */}
      <section className="bg-white border-t border-b border-slate-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider">All Security Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-xs">
             {[
               "SQL injection", "CORS", "Command injection", "Access control", "WebSockets", "Information disclosure", "Prototype pollution", "API testing",
               "Cross-site scripting", "XXE injection", "Server-side template injection", "Authentication", "DOM-based", "File upload vulnerabilities", "Web LLM attacks",
               "CSRF", "SSRF", "Insecure deserialization", "OAuth authentication", "Web cache poisoning", "JWT attacks", "Race conditions", "Web cache deception",
               "Clickjacking", "Request smuggling", "Directory traversal", "Business logic vulnerabilities", "HTTP Host header attacks", "NoSQL injection"
             ].map((topic, i) => (
               <Link key={i} to={`/topics/${topic.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-700 hover:text-[#FF5A36] font-medium transition-colors truncate">
                 {topic}
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Start learning banner - Solid architectural dark, no gradient */}
      <section className="bg-[#111A4D] text-white py-14 px-4 text-center border-t border-slate-700">
         <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Ready to Master Cybersecurity?</h2>
         <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
           Join security professionals, enterprise teams, and students worldwide at WonderCave.
         </p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="bg-[#FF5A36] text-white hover:bg-[#e04825] font-bold py-3 px-8 w-full sm:w-44 text-center text-xs uppercase tracking-wider rounded-none transition-colors">
              Get Started Free
            </Link>
            <Link to="/products" className="bg-transparent border border-white text-white hover:bg-white/10 text-center font-bold py-3 px-8 w-full sm:w-44 text-xs uppercase tracking-wider rounded-none transition-colors">
              Explore Tools
            </Link>
         </div>
      </section>
    </div>
  );
}

