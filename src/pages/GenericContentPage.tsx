import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Shield, CheckCircle, Terminal, Clock, Copy, Check, BookOpen, Share2 } from "lucide-react";
import { motion } from "motion/react";
import Seo from "../components/layout/Seo";
import Markdown from "react-markdown";
import { FALLBACK_PAGES } from "../data/fallbackPages";

// High-definition technology and security photography
const HD_FALLBACK_IMAGES: Record<string, string> = {
  products: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=85&w=1600",
  solutions: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=85&w=1600",
  topics: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=85&w=1600",
  resources: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=85&w=1600",
  default: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=85&w=1600",
};

function generateDetailedBody(slug: string, formattedTitle: string, fullPath: string): string {
  const isVulnerability = fullPath.includes("topic") || slug.includes("injection") || slug.includes("xss") || slug.includes("csrf") || slug.includes("cors") || slug.includes("smuggling");
  const isSolution = fullPath.includes("solution") || slug.includes("manufacturing") || slug.includes("retail") || slug.includes("healthcare");
  const isProduct = fullPath.includes("product") || slug.includes("scanner") || slug.includes("suite") || slug.includes("enterprise");

  if (isVulnerability) {
    return `## Executive Threat Profile: ${formattedTitle}

**${formattedTitle}** represents one of the most critical threat vectors in modern distributed software architectures. In enterprise cloud and microservice environments, attackers exploit subtle protocol anomalies, lack of contextual sanitization, or architectural design flaws to bypass defense-in-depth perimeters.

![Security Code Review](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Automated vulnerability auditing and static code analysis.*

---

## Real-World Case Study & Threat Landscape

In high-profile enterprise compromises, adversaries systematically scan perimeter interfaces for unvalidated parameters. Once an entry vector is identified, automated fuzzing payloads are dispatched to alter execution flow, manipulate database queries, or pivot across internal private subnets without triggering perimeter alarms.

---

## Technical Attack Mechanics & Exploitation Flow

When applications ingest untrusted parameters without strict type constraints and origin boundary validation, the execution environment evaluates arbitrary commands:

\`\`\`http
POST /api/v1/auth/exchange HTTP/1.1
Host: target.internal.net
X-Forwarded-Host: attacker.com
Content-Type: application/json

{"grant_type": "authorization_code", "payload": "<exploit_vector_payload>"}
\`\`\`

### Hardened Code Remediation Pattern

\`\`\`typescript
// Secure input validation and contextual encoding
import { z } from 'zod';

const RequestSchema = z.object({
  grant_type: z.enum(['authorization_code', 'client_credentials']),
  payload: z.string().max(256).regex(/^[a-zA-Z0-9_-]+$/)
});

export function handleSafeExchange(reqBody: unknown) {
  const parsed = RequestSchema.parse(reqBody);
  return parsed;
}
\`\`\`

---

## Defense-in-Depth Checklist

1. **Context-Aware Serialization**: Apply deterministic contextual encoding at every serialization boundary.
2. **Cryptographic Nonce Validation**: Never trust incoming headers or client-supplied identifiers without server-side verification.
3. **Automated Continuous Fuzzing**: Integrate active scanner probes into CI/CD pipelines to detect regressions prior to production release.
4. **Strict Least Privilege**: Run all application daemons under unprivileged service accounts with read-only filesystems.

---

## Formal Standards & References

* **OWASP Top 10**: [A03:2021 – Injection & Security Flaws](https://owasp.org/Top10/)
* **Common Weakness Enumeration**: CWE Classification Reference
* **NIST SP 800-53 Rev. 5**: SI-10 Information Input Validation`;
  }

  if (isSolution) {
    return `## Industry Security Blueprint: ${formattedTitle}

Modern **${formattedTitle}** operations rely on converged networks combining IoT sensor telemetry, cloud-native ERP platforms, and third-party vendor integrations. Securing these mission-critical pipelines requires proactive vulnerability management, strict access governance, and continuous audit capability.

![Industry Technology Infrastructure](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Architectural boundary diagram for converged industrial software systems.*

---

## Real-World Enterprise Challenge

Supply-chain interdependence and legacy protocol bridges frequently introduce undocumented trust boundaries. A breach in a third-party billing connector or telemetry broker can cascade into core customer databases within minutes if network segmentation is absent.

---

## WonderCave Implementation Strategy

* **Automated Perimeter Scanning**: Continuous discovery of internet-facing endpoints and shadow APIs.
* **Zero-Trust Network Segmentation**: Enforce strict role-based access control across all human and machine entities.
* **Incident Response Runbooks**: Pre-configured automated quarantine mechanisms for anomalous transaction patterns.
* **Continuous Compliance Auditing**: Real-time evidence collection for PCI-DSS, SOC 2 Type II, and ISO 27001.`;
  }

  if (isProduct) {
    return `## Product Overview & Enterprise Capabilities: ${formattedTitle}

**${formattedTitle}** delivers enterprise-grade automated scanning, deep protocol inspection, and developer-first remediation workflows. Engineered to support high-velocity engineering organizations, it combines automated crawling with surgical precision.

![Enterprise Technology Tools](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000)
*Figure 1: High-concurrency automated vulnerability scanning engine in action.*

---

## Core Product Capabilities

* **Comprehensive Headless Crawler Engine**: Full headless DOM execution capable of parsing Single Page Applications (SPAs), GraphQL APIs, and WebSocket streams.
* **Zero False-Positive Verification**: Built-in validation payloads prove exploitability before alerting security engineers.
* **CI/CD Integration**: Native plugins for GitHub Actions, GitLab CI, and Jenkins to fail builds upon discovery of high-severity flaws.
* **Cloudflare & Edge Compatibility**: Deploy seamlessly as a standalone client portal or air-gapped on-premises appliance.`;
  }

  return `## Module Curriculum & Research Findings: ${formattedTitle}

Welcome to the **${formattedTitle}** section of WonderCave. This curriculum provides comprehensive documentation, hands-on demonstrations, and defensive methodologies vetted by cybersecurity researchers.

![Research and Learning](https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Interactive cybersecurity research and diagnostic methodologies.*

### Core Competencies
* **Threat Analysis**: Identify root causes and understand exploit methodologies from the ground up.
* **Defensive Engineering**: Implement robust, production-tested countermeasures that scale.
* **Live Lab Verification**: Validate security controls against realistic attacker scenarios in safe sandbox environments.`;
}

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 border border-slate-700 bg-[#0B1120] shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1E293B] border-b border-slate-700 text-[11px] font-mono text-slate-300">
        <span className="text-slate-400 font-semibold tracking-wider uppercase text-[10px]">Source / Exploit Payload</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2 py-0.5 text-[11px] font-mono border border-slate-600 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed bg-[#0B1120] text-slate-100 m-0 border-0">
        <code className="!text-[#F8FAFC] font-mono text-xs sm:text-sm leading-relaxed block whitespace-pre font-normal" style={{ color: "#F8FAFC" }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function GenericContentPage() {
  const location = useLocation();
  const rawPath = location.pathname.replace(/^\/+|\/+$/g, "");
  const pathParts = rawPath.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 1] || "overview";

  // Pre-seed with fallback pages for instant rendering on Cloudflare Pages and offline
  const initialPage = FALLBACK_PAGES[rawPath] || FALLBACK_PAGES[slug] || (pathParts.length > 1 ? FALLBACK_PAGES[pathParts[0]] : null);
  
  const [pageData, setPageData] = useState<any>(initialPage || null);
  const [loading, setLoading] = useState(!initialPage);

  useEffect(() => {
    // Attempt live API fetch; if offline or on Cloudflare Pages static hosting, fallback stays active
    fetch("/api/pages")
      .then(res => res.json())
      .then(data => {
        if (data) {
          const resolved = data[rawPath] || data[slug] || (pathParts.length > 1 ? data[pathParts[0]] : null);
          if (resolved) {
            setPageData(resolved);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback already pre-seeded
        setLoading(false);
      });
  }, [rawPath, slug]);

  const defaultTitle = pathParts.length > 0 
    ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    : "WonderCave";

  const title = pageData?.title || defaultTitle;
  const subtitle = pageData?.subtitle || `Commercial-grade security research and technical specifications for ${title}.`;
  const content = (pageData?.content && pageData.content.trim().length > 0)
    ? pageData.content
    : generateDetailedBody(slug, title, rawPath);

  const fallbackCategory = pathParts[0] || "default";
  const imageUrl = pageData?.imageUrl || HD_FALLBACK_IMAGES[fallbackCategory] || HD_FALLBACK_IMAGES.default;

  // Approximate word count and read time
  const wordCount = content.replace(/[#*`_[\]()-]/g, "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="w-full bg-[#E9ECEF] min-h-[75vh] flex flex-col pt-8 pb-20 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans">
      <Seo title={`${title} — WonderCave`} description={subtitle} />
      
      <div className="max-w-5xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-600 mb-6 font-medium flex-wrap gap-y-1">
          <Link to="/" className="hover:text-[#111A4D] transition-colors">Home</Link>
          {pathParts.map((part, index) => {
            const path = `/${pathParts.slice(0, index + 1).join('/')}`;
            const label = part.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            return (
              <React.Fragment key={path}>
                <ChevronRight size={13} className="mx-2 text-slate-400" />
                {index === pathParts.length - 1 ? (
                  <span className="text-slate-900 font-semibold">{label}</span>
                ) : (
                  <Link to={path} className="hover:text-[#111A4D] transition-colors">{label}</Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Page Header - Mobile & Tablet Responsive */}
        <div className="bg-white border border-slate-300 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 rounded-none shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-normal sm:tracking-wider mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <Shield size={13} className="text-[#FF5A36] shrink-0" />
              <span className="font-bold text-slate-900 shrink-0">WonderCave Research</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 break-all">{rawPath.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-sans text-[10px] sm:text-xs flex-wrap">
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                <Clock size={11} className="shrink-0" /> {readingTime} min read ({wordCount} words)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">
                Nayem Hasan <span className="hidden xs:inline text-slate-400">(wondercave.nayem.net)</span>
              </span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2 sm:mb-3 leading-tight break-words">
            {title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal max-w-3xl leading-relaxed break-words">
            {subtitle}
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-300 p-12 text-center rounded-none shadow-none">
            <div 
              className="w-8 h-8 border-4 border-slate-900 border-t-transparent mx-auto mb-4 animate-spin rounded-full"
              style={{ borderRadius: "100%" }}
            ></div>
            <p className="text-xs font-mono text-slate-500">Loading module payload...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Featured Image */}
            {imageUrl && (
              <div className="w-full h-64 md:h-[380px] rounded-none overflow-hidden bg-slate-200 border border-slate-300 mb-8">
                <img 
                  src={imageUrl} 
                  alt={`${title} visual documentation`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-none" 
                />
              </div>
            )}
            
            {/* Body Content Card with Enhanced Markdown */}
            <div className="bg-white border border-slate-300 p-4 sm:p-6 md:p-10 mb-8 rounded-none shadow-none">
              <div className="text-sm md:text-base max-w-none leading-relaxed prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-[#111A4D] hover:prose-a:text-[#FF5A36] prose-code:font-mono prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-pre:p-0 prose-pre:bg-transparent">
                {/<[a-z][\s\S]*>/i.test(content) && !content.trim().startsWith("##") ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: content }} 
                    className="space-y-4"
                  />
                ) : (
                  <Markdown components={{
                    img: ({ node, ...props }) => {
                      return (
                        <div className="my-6 border border-slate-300 bg-slate-50 p-2">
                          <img 
                            {...props} 
                            alt={props.alt || "Research illustration"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-auto max-h-[480px] object-cover rounded-none border border-slate-200"
                          />
                          {props.alt && (
                            <p className="text-[11px] font-mono text-slate-500 mt-2 text-center not-italic font-normal">
                              {props.alt}
                            </p>
                          )}
                        </div>
                      );
                    },
                    pre: ({ node, children, ...props }) => {
                      const codeContent = React.Children.toArray(children)
                        .map((child: any) => child?.props?.children || "")
                        .join("");
                      return <CodeBlock>{codeContent}</CodeBlock>;
                    },
                    code: ({ node, className, children, ...props }: any) => {
                      return (
                        <code className="bg-[#E9ECEF] text-[#0F172A] px-1.5 py-0.5 text-xs font-mono font-semibold border border-slate-300 not-italic rounded-none" {...props}>
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-[#111A4D] bg-[#F1F3F5] p-4 my-5 not-italic text-slate-700 text-xs sm:text-sm font-normal">
                        {props.children}
                      </blockquote>
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-6 border border-slate-300">
                        <table className="w-full text-xs text-left border-collapse" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="bg-slate-100 font-bold p-3 border-b border-slate-300 text-slate-900 uppercase tracking-wider" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="p-3 border-b border-slate-200 text-slate-700" {...props} />
                    ),
                    a: ({ node, ...props }) => {
                      const href = props.href || "";
                      if (href.includes("youtube.com/watch") || href.includes("youtu.be/")) {
                        const videoId = href.includes("youtube.com") 
                          ? new URL(href).searchParams.get("v") 
                          : href.split("youtu.be/")[1]?.split("?")[0];
                        return (
                          <div className="my-8 aspect-video w-full rounded-none overflow-hidden border border-slate-300 bg-slate-950">
                            <iframe 
                              src={`https://www.youtube.com/embed/${videoId}`} 
                              title="YouTube video demonstration" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        );
                      }
                      return (
                        <a {...props} className="text-[#111A4D] font-semibold underline decoration-slate-300 hover:text-[#FF5A36] transition-colors">
                          {props.children}
                        </a>
                      );
                    }
                  }}>
                    {content}
                  </Markdown>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white border border-slate-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none shadow-none">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <span>Verified curriculum maintained at <strong>wondercave.nayem.net</strong> by Nayem Hasan</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link 
                  to="/learning-paths" 
                  className="w-full sm:w-auto text-center px-6 py-3 bg-[#111A4D] text-white text-xs font-bold rounded-none hover:bg-slate-900 transition-colors uppercase tracking-wider"
                >
                  Explore All Labs
                </Link>
                <Link 
                  to="/" 
                  className="w-full sm:w-auto text-center px-6 py-3 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-none hover:bg-slate-200 transition-colors uppercase tracking-wider"
                >
                  WonderCave Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
