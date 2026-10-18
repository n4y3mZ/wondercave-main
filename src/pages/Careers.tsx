import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/api";
import { motion } from "motion/react";
import { Trophy, Star, ArrowUpRight } from "lucide-react";
import Seo from "../components/layout/Seo";

export default function Careers() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard).catch(console.error);
  }, []);

  return (
    <div className="w-full bg-[#E9ECEF] pb-24 text-slate-900 font-sans">
      <Seo 
        title="Careers & Research Fellowship — WonderCave" 
        description="Join the security engineering team and research fellowship at WonderCave." 
      />
      
      <header className="bg-white border-b border-slate-300 py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">Security Research Fellows</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Engineering & Research Fellowship</h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Collaborate with ethical hackers, vulnerability researchers, and platform engineers protecting global cloud infrastructure.
          </p>
        </div>
      </header>

      {/* Meet the Team - Leaderboard Gamification */}
      <section className="py-16 px-4 border-b border-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Trophy className="text-[#FF5A36]" size={14} /> Hall of Fame Contributors
              </div>
              <p className="text-slate-700 mt-1 text-sm font-medium">Top research contributors and lab authors.</p>
            </div>
            <div className="font-mono text-xs text-[#111A4D] bg-white px-3 py-1.5 border border-slate-300 font-bold uppercase tracking-wider rounded-none">
              CYCLE: 2026 ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaderboard.map((person, i) => (
              <motion.div 
                key={person.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`bg-white rounded-none border ${i === 0 ? 'border-[#111A4D] ring-2 ring-[#111A4D]' : 'border-slate-300'} p-6 text-center shadow-none`}
              >
                <div className="w-20 h-20 border-2 border-slate-300 bg-slate-100 mx-auto mb-4 overflow-hidden rounded-none">
                  <img 
                    src={person.avatar} 
                    alt={person.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-none" 
                  />
                </div>
                
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">{person.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium mb-3 uppercase tracking-wider">{person.role}</p>
                
                <div className="inline-flex items-center gap-1.5 bg-[#E9ECEF] border border-slate-300 px-2.5 py-1 text-xs font-mono text-slate-800 font-semibold rounded-none">
                  <Star size={11} className="text-[#FF5A36]" fill="currentColor" />
                  {person.points.toLocaleString()} PTS
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Operations */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-300 p-8 rounded-none shadow-none">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Responsible Disclosure & Ethics</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every researcher and engineer at WonderCave adheres to strict ethical standards. All lab materials and scanner capabilities are designed to empower defensive engineers and verify enterprise posture before malicious exploitation occurs.
            </p>
          </div>
          
          <div className="bg-white border border-slate-300 p-8 rounded-none shadow-none">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Open Research & Global Reach</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Maintained under wondercave.nayem.net and led by Nayem Hasan, our mission is to ensure cybersecurity education remains 100% accessible to developers, students, and organizations worldwide without paywalls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
