import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Seo from "../components/layout/Seo";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#E9ECEF] flex flex-col items-center justify-center p-6 text-slate-900">
      <Seo title="404 — Page Not Found" description="The requested resource could not be found." />
      <div className="w-full max-w-md bg-white border border-slate-300 p-8 text-center shadow-none">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">HTTP 404 Error</span>
        <h1 className="text-5xl font-black text-[#111A4D] mb-4">404</h1>
        <h2 className="text-xl font-bold mb-3">Resource Not Found</h2>
        <p className="text-xs text-slate-600 mb-8 leading-relaxed">
          The requested path does not exist or may have been permanently moved to another endpoint on WonderCave.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111A4D] text-white text-xs font-semibold rounded-none hover:bg-slate-900 transition-colors"
          >
            <Home size={14} /> Return Home
          </Link>
          <Link 
            to="/301" 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-none hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={14} /> 301 Redirects
          </Link>
        </div>
      </div>
    </div>
  );
}
