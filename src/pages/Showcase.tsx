import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../services/api";
import { motion } from "motion/react";
import { Check, Code2, Play, ExternalLink } from "lucide-react";
import Seo from "../components/layout/Seo";

export default function Showcase() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="w-full bg-[#E9ECEF] pb-24 text-slate-900 font-sans">
      <Seo 
        title="Software Showcase — WonderCave" 
        description="Explore our ready-to-deploy enterprise security tools and architecture blueprints." 
      />
      {/* Hero */}
      <header className="bg-white border-b border-slate-300 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">Enterprise Solutions</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Security Architecture Showcase</h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Production-ready vulnerability management modules, continuous web crawlers, and automated compliance pipelines.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col gap-12">
        {products.map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`bg-white border border-slate-300 p-8 sm:p-10 flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center rounded-none shadow-none`}
          >
            {/* Content Side */}
            <div className="flex-1 space-y-4">
              <div className="inline-block px-3 py-1 bg-[#E9ECEF] text-[#111A4D] font-mono text-xs font-bold border border-slate-300 uppercase tracking-widest rounded-none">
                Module {product.id} / Enterprise
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{product.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
              
              <div className="space-y-2.5 pt-2">
                {product.useCases.map((useCase: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-green-700 border border-slate-300 rounded-none shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {useCase}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 flex flex-wrap gap-3">
                <Link to="/demo" className="bg-[#111A4D] text-white px-5 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider hover:bg-slate-900 transition-colors flex items-center gap-2">
                   <Play size={13} fill="currentColor" /> Live Interactive Demo
                </Link>
                <Link to="/docs" className="text-slate-800 border border-slate-300 bg-[#E9ECEF] px-5 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2">
                   <Code2 size={14} /> API Specs
                </Link>
              </div>
            </div>

            {/* Sandbox / Code Inspection Box */}
            <div className="flex-1 w-full relative">
              <div className="rounded-none border border-slate-800 bg-slate-950 p-6 text-slate-200 font-mono text-xs shadow-none">
                 <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-[11px] text-slate-400">
                   <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 bg-red-500 rounded-none inline-block"></span>
                     <span className="w-2.5 h-2.5 bg-yellow-500 rounded-none inline-block"></span>
                     <span className="w-2.5 h-2.5 bg-green-500 rounded-none inline-block"></span>
                     <span className="ml-2 font-mono text-slate-400">wondercave.nayem.net/{product.title.toLowerCase().replace(/\s+/g, '-')}</span>
                   </div>
                   <span className="text-green-400 font-semibold">200 OK</span>
                 </div>
                 
                 <div className="space-y-2 leading-relaxed">
                   <div className="text-slate-500">// Security Diagnostic Payload</div>
                   <div><span className="text-pink-400">import</span> {'{'} ScannerEngine {'}'} <span className="text-pink-400">from</span> <span className="text-amber-300">"@wondercave/core"</span>;</div>
                   <div className="text-slate-400">const instance = new ScannerEngine({'{'}</div>
                   <div className="pl-4 text-slate-300">target: <span className="text-amber-300">"https://wondercave.nayem.net"</span>,</div>
                   <div className="pl-4 text-slate-300">module: <span className="text-amber-300">"{product.title}"</span>,</div>
                   <div className="pl-4 text-slate-300">heuristicMode: <span className="text-emerald-400">true</span>,</div>
                   <div className="pl-4 text-slate-300">crawlDepth: <span className="text-blue-400">12</span>,</div>
                   <div className="text-slate-400">{'}'});</div>
                   <div className="text-emerald-400 mt-2">&gt; [STATUS] Engine initialized with 0 vulnerability regressions.</div>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
