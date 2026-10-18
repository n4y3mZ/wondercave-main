import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, CornerDownRight } from "lucide-react";
import Seo from "../components/layout/Seo";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const target = searchParams.get("to") || "/";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      navigate(target);
      return;
    }
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, target, navigate]);

  return (
    <div className="min-h-[70vh] bg-[#E9ECEF] flex flex-col items-center justify-center p-6 text-slate-900">
      <Seo title="301 — Moved Permanently" description="HTTP 301 Moved Permanently redirect handler." />
      <div className="w-full max-w-md bg-white border border-slate-300 p-8 text-center shadow-none">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">HTTP 301 Redirect</span>
        <h1 className="text-5xl font-black text-[#111A4D] mb-4">301</h1>
        <h2 className="text-xl font-bold mb-3">Resource Moved Permanently</h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          The requested document has been relocated to a permanent new destination. You will be redirected in <strong className="text-slate-900">{countdown}</strong> seconds.
        </p>

        <div className="bg-[#E9ECEF] border border-slate-300 p-3 mb-6 text-left text-xs font-mono text-slate-700 flex items-center gap-2 overflow-x-auto">
          <CornerDownRight size={14} className="text-[#111A4D] shrink-0" />
          <span className="truncate">Destination: <strong>{target}</strong></span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate(target)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111A4D] text-white text-xs font-semibold rounded-none hover:bg-slate-900 transition-colors"
          >
            Redirect Now <ArrowRight size={14} />
          </button>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-none hover:bg-slate-200 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
