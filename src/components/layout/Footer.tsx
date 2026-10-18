import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 px-6 border-t border-slate-300">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
        <div>
          <h4 className="font-bold mb-4 text-text-onyx text-sm uppercase tracking-wider">WonderCave Suite</h4>
          <ul className="space-y-3 text-[13px] text-slate-600">
            <li><Link to="/products/vulnerability-scanner" className="hover:text-brand-primary">Web vulnerability scanner</Link></li>
            <li><Link to="/products/suite-editions" className="hover:text-brand-primary">WonderCave Suite Editions</Link></li>
            <li><Link to="/products/enterprise" className="hover:text-brand-primary">Enterprise Security</Link></li>
            <li><Link to="/release-notes" className="hover:text-brand-primary">Release Notes</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-text-onyx text-sm uppercase tracking-wider">Vulnerabilities</h4>
          <ul className="space-y-3 text-[13px] text-slate-600">
            <li><Link to="/topics/cross-site-scripting" className="hover:text-brand-primary">Cross-site scripting (XSS)</Link></li>
            <li><Link to="/topics/sql-injection" className="hover:text-brand-primary">SQL injection</Link></li>
            <li><Link to="/topics/cross-site-request-forgery" className="hover:text-brand-primary">Cross-site request forgery</Link></li>
            <li><Link to="/topics/xxe-injection" className="hover:text-brand-primary">XML external entity injection</Link></li>
            <li><Link to="/topics/directory-traversal" className="hover:text-brand-primary">Directory traversal</Link></li>
            <li><Link to="/topics/ssrf" className="hover:text-brand-primary">Server-side request forgery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-text-onyx text-sm uppercase tracking-wider">Customers</h4>
          <ul className="space-y-3 text-[13px] text-slate-600">
            <li><Link to="/customers/organizations" className="hover:text-brand-primary">Organizations</Link></li>
            <li><Link to="/customers/testers" className="hover:text-brand-primary">Testers</Link></li>
            <li><Link to="/customers/developers" className="hover:text-brand-primary">Developers</Link></li>
            <li><Link to="/solutions/manufacturing" className="hover:text-brand-primary">Manufacturing Solutions</Link></li>
            <li><Link to="/solutions/retail" className="hover:text-brand-primary">Retail Solutions</Link></li>
            <li><Link to="/solutions/healthcare" className="hover:text-brand-primary">Healthcare Security</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-text-onyx text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-[13px] text-slate-600">
            <li><Link to="/support" className="hover:text-brand-primary">Support</Link></li>
            <li><Link to="/about" className="hover:text-brand-primary">About</Link></li>
            <li><Link to="/careers" className="hover:text-brand-primary">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-brand-primary">Contact</Link></li>
            <li><Link to="/legal" className="hover:text-brand-primary">Legal</Link></li>
            <li><Link to="/privacy" className="hover:text-brand-primary">Privacy Notice</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-text-onyx text-sm uppercase tracking-wider">Insights</h4>
          <ul className="space-y-3 text-[13px] text-slate-600">
            <li><Link to="/academy" className="hover:text-brand-primary">WonderCave Labs</Link></li>
            <li><Link to="/blog" className="hover:text-brand-primary">Blog</Link></li>
            <li><Link to="/research" className="hover:text-brand-primary">Research</Link></li>
            <li><Link to="/documentation" className="hover:text-brand-primary">Documentation</Link></li>
            <li><Link to="/posts" className="hover:text-brand-primary font-bold text-[#FF5A36]">Security Posts</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-900">
            <a href="https://wondercave.nayem.net" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary underline decoration-slate-400 underline-offset-4">wondercave.nayem.net</a>
          </span>
          <span className="hidden sm:inline text-slate-400" aria-hidden="true">|</span>
          <span>Site managed by <strong className="font-semibold text-slate-800">Nayem Hasan</strong></span>
          <span className="hidden sm:inline text-slate-400" aria-hidden="true">|</span>
          <span>&copy; {new Date().getFullYear()} WonderCave. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <Link to="/about" className="hover:text-brand-primary">About</Link>
          <Link to="/privacy" className="hover:text-brand-primary">Privacy</Link>
          <Link to="/legal" className="hover:text-brand-primary">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

