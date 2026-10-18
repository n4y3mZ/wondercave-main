import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Seo from "../components/layout/Seo";

export default function Support() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#E9ECEF] pt-12 pb-20 font-sans text-slate-900 px-4 sm:px-6 lg:px-8">
      <Seo title="Enterprise Support — WonderCave" description="Need help with deployments, certifications, or security labs? Reach our dedicated support engineers." />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">Technical Assistance</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">WonderCave Support & Advisory</h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Need help with your deployment, licensing, or lab environments? Our cybersecurity engineers are ready to assist.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 bg-white border border-slate-300 p-8 md:p-10 rounded-none shadow-none">
          {/* Contact Info (Side) */}
          <div className="lg:w-1/3 flex flex-col gap-6 bg-[#E9ECEF] p-6 border border-slate-300 rounded-none">
            <div>
              <h2 className="text-lg font-bold mb-1">Direct Channels</h2>
              <p className="text-xs text-slate-600">
                Managed centrally for wondercave.nayem.net
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 border border-slate-300 text-[#FF5A36] rounded-none shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-0.5">Email Support</h3>
                  <a href="mailto:support@wondercave.nayem.net" className="text-[#111A4D] hover:underline font-semibold">support@wondercave.nayem.net</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 border border-slate-300 text-[#111A4D] rounded-none shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-0.5">Emergency Line</h3>
                  <a href="tel:+18005550199" className="text-[#111A4D] hover:underline font-semibold">+1 (800) 555-0199</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 border border-slate-300 text-green-700 rounded-none shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-0.5">Headquarters</h3>
                  <address className="text-slate-600 not-italic leading-relaxed">
                    WonderCave Security Operations<br />
                    Managed by Nayem Hasan<br />
                    wondercave.nayem.net
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            {submitted && (
              <div className="bg-green-50 border border-green-300 p-4 mb-6 flex items-center gap-3 text-xs text-green-900 rounded-none">
                <CheckCircle2 size={16} className="text-green-700 shrink-0" />
                <span>Thank you! WonderCave Support has received your dispatch and will respond shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-none border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-800 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-none border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-800 transition-colors"
                    placeholder="jane@organization.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                  Incident or Query Description
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-none border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-800 transition-colors resize-none"
                  placeholder="Detail your request, lab ID, or enterprise architecture question..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111A4D] text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-slate-900 transition-colors"
              >
                <Send size={14} />
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
