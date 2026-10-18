const fs = require('fs');
const path = require('path');

const pagesPath = path.join(__dirname, '..', 'data', 'pages.json');
let existingPages = {};
try {
  existingPages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
} catch (e) {
  existingPages = {};
}

const additionalPosts = {
  "directory-traversal": {
    "title": "Directory Traversal (Path Traversal) & Arbitrary File Disclosure",
    "subtitle": "Bypassing filesystem sandboxes, exploiting dot-dot-slash sequence anomalies, and extracting server configuration files.",
    "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=85&w=1600",
    "content": `## Executive Threat Profile: Directory Traversal (CWE-22)

Directory traversal (also known as path traversal) is a severe vulnerability that occurs when an application accepts user input and passes it to filesystem APIs without canonicalization or strict path verification. By injecting relative path sequences—such as \`../\`, URL-encoded \`%2e%2e%2f\`, or UTF-8 overlong sequences—an attacker breaks out of the intended web root directory and accesses arbitrary files across the server, including configuration credentials, private RSA keys, and operating system password databases.

![Linux Server Console](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Operating system filesystem tree and process privilege boundaries.*

---

## Real-World Breach Case Study: Apache HTTP Server Path Traversal (CVE-2021-41773)

In late 2021, Apache HTTP Server 2.4.49 introduced a path normalization flaw. While standard \`../\` sequences were caught by validation routines, the normalization code failed to handle single URL-encoded dots:
\`curl -s --path-as-is "http://target.com/icons/.%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd"\`

Because the \`icons/\` alias had default directory mapping enabled, this single-line request successfully bypassed document root restrictions and returned the host's \`/etc/passwd\` file. Within 48 hours of public disclosure, automated cybercrime bots actively weaponized the flaw worldwide to extract internal credentials and trigger remote code execution via mod_cgi.

---

## Code Walkthrough: Vulnerable vs Hardened File Retrieval

### 1. Insecure Express / Node.js Route (Vulnerable to Traversal)
\`\`\`javascript
// INSECURE: Directly resolving user input with path.join
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/download', (req, res) => {
  const filename = req.query.file; // e.g. "../../../../etc/shadow"
  const filepath = path.join(__dirname, 'public/documents', filename);
  
  // Directly pipes arbitrary file to HTTP response!
  res.sendFile(filepath);
});
\`\`\`

### 2. Hardened Implementation (Path Canonicalization & Whitelisting)
\`\`\`typescript
// SECURE: Canonical path verification ensuring target stays inside sandbox root
import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';

const SAFE_ROOT = path.resolve(__dirname, '../public/documents');

export async function secureFileDownload(req: Request, res: Response) {
  const rawFilename = req.query.file as string;

  if (!rawFilename || typeof rawFilename !== 'string') {
    return res.status(400).json({ error: "Missing file parameter." });
  }

  // 1. Strip directory delimiters and extract strictly base name
  const safeBaseName = path.basename(rawFilename);

  // 2. Resolve absolute canonical path
  const absoluteTarget = path.resolve(SAFE_ROOT, safeBaseName);

  // 3. Strict verification that destination starts with the safe root directory
  if (!absoluteTarget.startsWith(SAFE_ROOT + path.sep)) {
    return res.status(403).json({ error: "Access denied: Path traversal detected." });
  }

  try {
    const fileStat = await fs.stat(absoluteTarget);
    if (!fileStat.isFile()) {
      return res.status(400).json({ error: "Target is not a standard file." });
    }
    res.sendFile(absoluteTarget);
  } catch (err) {
    res.status(404).json({ error: "Requested asset not found." });
  }
}
\`\`\`

![Cyber Sandbox Lab](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000)
*Figure 2: Verifying path normalization and symlink resolution inside sandbox containers.*

---

## Point-Based Tiers of Path Traversal Payloads

* **Standard Dot-Dot-Slash**: \`../../../etc/passwd\` or \`..\\..\\..\\windows\\win.ini\`
* **URL-Encoded Sequences**: \`%2e%2e%2f%2e%2e%2f\` or double-encoded \`%252e%252e%252f\`
* **Null Byte Injection (Historic C/C++ & PHP <= 5.3)**: \`../../../etc/passwd%00.jpg\` used to truncate appended file extensions.
* **Non-Recursive Stripping Bypass**: If code strips \`../\` once with string replace, \`....//....//\` collapses directly into valid \`../../\` sequences!

---

## Defense-in-Depth Mitigation Checklist

1. **Avoid Passing User Input to Filesystem APIs**: Prefer serving static assets via immutable content hashes or database object stores (S3, Cloudflare R2).
2. **Canonicalize Paths with path.resolve()**: Always check that \`resolvedPath.startsWith(allowedRootDirectory)\`.
3. **Run Process with Chroot / Unprivileged Containers**: Confine processes to minimal scratch filesystems with no access to \`/etc\` or \`/root\`.
4. **Use path.basename()**: Strip leading directory separators before resolving file paths.

---

## Formal Standards & Academic References

* **OWASP Top 10**: [A01:2021 – Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
* **Common Weakness Enumeration**: [CWE-22: Improper Limitation of a Pathname to a Restricted Directory](https://cwe.mitre.org/data/definitions/22.html)
* **CVE Reference**: CVE-2021-41773 & CVE-2021-42013 (Apache HTTP Server Path Traversal)`
  },

  "social-engineering": {
    "title": "Social Engineering: Psychological Manipulation & Cognitive Exploits",
    "subtitle": "Deconstructing spear-phishing, voice spoofing, pretexting campaigns, and engineering human operational security.",
    "imageUrl": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=85&w=1600",
    "content": `## Executive Threat Profile: Social Engineering & Human Factor Security

Social engineering is the psychological manipulation of people into performing actions or divulging confidential credentials. Regardless of how robust cryptographic ciphers or firewall appliances may be, the human layer remains the most frequently exploited attack vector. Threat actors leverage authority bias, urgency, fear, curiosity, and artificial intimacy to bypass physical access controls, trick helpdesk staff, and execute multimillion-dollar business email compromises (BEC).

![Modern Workspace & Human Interaction](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Corporate operational environments and human trust communication channels.*

---

## Real-World Breach Case Study: The Twitter Internal Admin Tool Compromise

In July 2020, adolescent cybercriminals compromised high-profile Twitter accounts (including Barack Obama, Elon Musk, Apple, and Bill Gates) to promote a cryptocurrency double-your-money scam. The attackers did not exploit zero-day software vulnerabilities. Instead, they executed spear-phishing voice calls (vishing) against Twitter remote customer support employees, posing as Twitter IT department administrators assisting with VPN connection problems.

The attackers directed the employees to a convincing phishing portal, harvested their two-factor credentials, and gained direct access to Twitter's internal administration dashboard, enabling unauthorized password resets and account takeover at global scale.

---

## Core Point-Based Categories of Social Engineering

* **Spear-Phishing & Whaling**: Highly targeted emails tailored with intelligence gathered from LinkedIn, social media, and conference presentations to deceive C-suite executives into authorizing fund transfers.
* **Pretexting**: Creating an invented scenario where the attacker assumes a fabricated persona (such as an auditor, police officer, or bank fraud investigator) to solicit confidential records.
* **Baiting & Malicious Physical Media**: Leaving USB flash drives loaded with weaponized malware in corporate parking lots or reception lobbies, relying on employee curiosity.
* **Tailgating (Piggybacking)**: An unauthorized person closely following an authorized employee through a badge-access security door or turnstile under the guise of carrying heavy packages.
* **AI Deepfake Voice Cloning**: Synthesizing the voice of an organization's CEO using only a few seconds of public earnings call audio to order emergency wire transfers.

---

## Anatomy of a Phishing Simulation & Detection Pipeline

\`\`\`typescript
// Automated header heuristic analysis for incoming employee emails
export function analyzeEmailThreatScore(emailHeaders: Record<string, string>): number {
  let threatScore = 0;

  // 1. SPF / DKIM / DMARC verification
  if (emailHeaders['authentication-results']?.includes('dmarc=fail')) {
    threatScore += 50;
  }

  // 2. Display Name Spoofing: Matches internal executive name with external domain
  const fromHeader = emailHeaders['from'] || '';
  if (fromHeader.includes('Nayem Hasan') && !fromHeader.includes('@wondercave.nayem.net')) {
    threatScore += 40;
  }

  // 3. Urgent Action Callouts (Keywords triggering cognitive panic)
  const subject = emailHeaders['subject'] || '';
  if (/urgent|immediate action required|suspended account|wire transfer/i.test(subject)) {
    threatScore += 20;
  }

  return threatScore;
}
\`\`\`

![Security Operations Center](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000)
*Figure 2: Phishing triage and telemetry monitoring inside the security operations center.*

---

## Defense-in-Depth Organizational Security Checklist

1. **Hardware-Bound FIDO2/WebAuthn Authentication**: Deploy YubiKeys to eliminate credential harvesting; hardware keys cannot be phished by proxy portals.
2. **Dual-Authorization Controls for Financial Transactions**: Mandate out-of-band video or telephonic verification before executing wire disbursements exceeding established thresholds.
3. **Regular Unannounced Phishing Simulations**: Conduct continuous baseline tests and provide immediate empathetic micro-training to employees who click test links.
4. **Strict Visitor Badge Policies**: Enforce physical access security and empower staff to challenge unbadged individuals within corporate facilities.

---

## Formal Standards & Academic References

* **MITRE ATT&CK**: [Technique T1566 (Phishing)](https://attack.mitre.org/techniques/T1566/) and [T1598 (Phishing for Information)](https://attack.mitre.org/techniques/T1598/)
* **NIST SP 800-63B**: Digital Identity Guidelines (Authentication and Lifecycle Management)
* **CISA Alert AA22-264A**: Defending Against Software and Human Social Engineering Campaigns`
  },

  "products": {
    "title": "WonderCave Enterprise Security Suite & Vulnerability Scanners",
    "subtitle": "Commercial-grade automated application auditing, crawler engines, and continuous attack surface monitoring.",
    "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=85&w=1600",
    "content": `## Enterprise Product Portfolio Overview

The WonderCave Enterprise Security Suite delivers high-velocity, automated vulnerability detection and continuous perimeter surveillance for modern software engineering teams. Engineered from the ground up to support modern distributed microservices, single-page web applications (SPAs), GraphQL APIs, and cloud-native containers, our scanners combine deep protocol crawling with mathematically verified exploit payloads to eliminate false positives.

![High Tech Server Racks](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Scalable automated crawler workers running across distributed Kubernetes nodes.*

---

## Real-World Enterprise Deployment Story: Global Fintech CI/CD Integration

"Prior to deploying WonderCave Enterprise Scanner, our security team spent 15 hours every week manually vetting false alarms generated by legacy SAST/DAST tools," explains David Keller, VP of Infrastructure Security. "By integrating the WonderCave headless crawler directly into our GitLab CI pipeline, automated scans execute against ephemeral preview environments on every pull request. Flaws such as BOLA, missing CSRF tokens, and reflected DOM sinks are caught and blocked before reaching staging, reducing our mean-time-to-remediate (MTTR) by 72%."

---

## Core Product Offerings

### 1. WonderCave Headless Dynamic Vulnerability Scanner
* **Deep Single-Page Application (SPA) Crawling**: Executes full Chrome headless browser engines to crawl dynamic React, Vue, Angular, and Next.js applications.
* **Active Payload Verification**: Validates exploitability in a sandbox before alerting developers, reducing false positives to virtually zero.
* **API Specification Ingestion**: Natively ingests OpenAPI/Swagger, Postman collections, and GraphQL introspection schemas to fuzz undocumented endpoints.

### 2. Attack Surface Management (ASM) & Continuous Perimeter Surveillance
* **Autonomous Asset Discovery**: Continuously monitors internet-facing subdomains, SSL/TLS certificates, cloud buckets (AWS S3, GCP Buckets), and DNS records.
* **Zero-Day Exposure Alerts**: Automatically matches newly published CVEs against your organization's fingerprinted software versions.

### 3. Developer Remediation Engine & IDE Plugins
* **Instant Pull Request Comments**: Generates automated code fixes and parameterized queries directly on GitHub and GitLab pull requests.
* **Interactive Sandbox Replay**: Generates one-click sandbox links where developers can replay the exact HTTP request sequence that triggered the vulnerability.

![Code Screen Inspector](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000)
*Figure 2: Real-time vulnerability diagnosis and interactive payload debugging.*

---

## Automated CI/CD Pipeline Configuration Example

\`\`\`yaml
# .github/workflows/wondercave-security-audit.yml
name: WonderCave Security Pipeline
on: [push, pull_request]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: WonderCave Automated Scanner Action
        uses: wondercave/scanner-action@v2
        with:
          target-url: https://staging.internal.net
          api-spec: ./docs/openapi.json
          fail-on-severity: HIGH
          auth-token: \${{ secrets.WONDERCAVE_SCANNER_KEY }}
\`\`\`

---

## Enterprise Support & Cloudflare Worker Compatibility

All WonderCave tooling is built to operate seamlessly with modern serverless architectures, including Cloudflare Workers, Cloudflare Pages, AWS Lambda, and on-premises air-gapped data centers under the leadership of Nayem Hasan at \`wondercave.nayem.net\`.`
  },

  "solutions": {
    "title": "Industry-Specific Cybersecurity Solutions & Compliance Frameworks",
    "subtitle": "Tailored defense-in-depth architectures engineered for financial services, healthcare networks, industrial manufacturing, and retail e-commerce.",
    "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=85&w=1600",
    "content": `## Industry Security Architectures

Modern organizations operate under rigorous regulatory scrutiny and relentless threat actor targeting. A generic, one-size-fits-all security strategy inevitably fails when applied to specialized operational environments—such as healthcare PACS imaging networks, high-frequency banking ledgers, or industrial supervisory control (SCADA) systems. WonderCave designs tailored defensive architectures aligned with industry-specific threat models.

![Industrial Manufacturing Operations](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Converged Operational Technology (OT) and Information Technology (IT) perimeters.*

---

## Sector-Specific Solution Matrix

### 1. Financial Services & FinTech (PCI-DSS 4.0 & SOC 2 Type II)
* **Threat Profile**: Credential stuffing, payment gateway manipulation, account takeover (ATO), and fraudulent wire execution.
* **Architecture Solution**: Continuous API authorization enforcement, zero-trust microsegmentation, and hardware-backed cryptographic signing for transaction mutations.

### 2. Healthcare & Life Sciences (HIPAA & HITECH Compliance)
* **Threat Profile**: Targeted ransomware attacks, electronic health record (EHR) database theft, and medical IoT device tampering.
* **Architecture Solution**: Attribute-based access control (ABAC), automated data-at-rest field-level encryption, and network perimeter isolation for legacy diagnostic appliances.

### 3. Industrial Manufacturing & Energy (IEC 62443 & NIST SP 800-82)
* **Threat Profile**: Air-gap bridging, supply chain firmware tampering, and operational downtime via ICS/SCADA protocol sabotage.
* **Architecture Solution**: Unidirectional security gateways, protocol fuzzing for Modbus/DNP3, and automated anomaly detection on sensor telemetry.

### 4. Retail & E-Commerce Platforms (Magecart & Bot Mitigation)
* **Threat Profile**: Digital credit card skimming, inventory hoarding bots, and web cache deception on user cart checkouts.
* **Architecture Solution**: Strict Content Security Policy (CSP Level 3), Subresource Integrity (SRI) hashing on third-party scripts, and Cloudflare edge rate-limiting.

![Network Architecture Diagram](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000)
*Figure 2: Zero-trust microsegmentation topology across distributed multi-cloud nodes.*

---

## Point-Based Implementation Roadmap

1. **Phase 1: Automated Asset Discovery & Threat Modeling**: Map all external endpoints, third-party connectors, and data ingress points.
2. **Phase 2: Gap Analysis against Regulatory Mandates**: Benchmark existing controls against NIST CSF, ISO 27001, and sector standards.
3. **Phase 3: Remediation & Automated CI/CD Integration**: Deploy automated scanning and zero-trust policies across development pipelines.
4. **Phase 4: Continuous Red-Team Verification**: Validate defensive efficacy through simulated adversary emulation exercises.`
  },

  "resources": {
    "title": "Cybersecurity Knowledge Base, Technical Whitepapers & Research Papers",
    "subtitle": "In-depth technical guides, threat advisories, protocol analysis, and security engineering benchmarks.",
    "imageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=85&w=1600",
    "content": `## Research Library & Technical Knowledge Base

The WonderCave Resources library is a peer-reviewed repository of technical whitepapers, protocol analysis teardowns, and defensive engineering guides. Authored by active security researchers and penetration testers, our research provides rigorous, reproducible methodologies for diagnosing and eliminating vulnerabilities in production web infrastructure.

![Technical Library and Research Data](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000)
*Figure 1: Deep technical literature and empirical vulnerability research records.*

---

## Featured Research Papers & Whitepapers

* **Automating Zero-Trust Authorization in Microservice Meshes**: A 45-page empirical study on attribute-based access control (ABAC) overhead and security guarantees in Istio and Envoy proxy networks.
* **The Evolution of Modern Web Cache Attacks**: Systematic analysis of 12 major CDN providers evaluating path delimiter normalization, unkeyed header reflections, and edge cache poisoning.
* **Securing Autonomous Generative Agents in Enterprise Cloud**: Formal models for preventing indirect prompt injection and unconstrained tool invocation in production LLM workflows.

---

## Recommended Defensive Architecture Books & Standards

1. *The Web Application Hacker's Handbook (2nd Edition)* by Dafydd Stuttard & Marcus Pinto
2. *Designing Data-Intensive Applications* by Martin Kleppmann (Security & Fault Tolerance Chapters)
3. *Zero Trust Networks* by Gilman & Barth
4. *NIST Special Publication 800-53 (Rev. 5)*: Security and Privacy Controls for Information Systems

![Security Engineer at Work](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000)
*Figure 2: Empirical analysis of network anomalies and protocol state machines.*

---

## Point-Based Self-Study Guide for Security Engineers

* **Step 1: Protocol Mastery**: Study RFC 9110 (HTTP Semantics), RFC 6749 (OAuth 2.0), and RFC 7519 (JSON Web Tokens).
* **Step 2: Threat Modeling**: Practice stride threat modeling on simple distributed architectures (Auth, API, DB).
* **Step 3: Laboratory Exploitation**: Complete the WonderCave interactive exploit challenges.
* **Step 4: Defensive Remediation**: Implement secure cryptographic token verification in your favorite language.`
  }
};

for (const [key, data] of Object.entries(additionalPosts)) {
  existingPages[key] = {
    ...(existingPages[key] || {}),
    ...data
  };
}

fs.writeFileSync(pagesPath, JSON.stringify(existingPages, null, 2), 'utf8');

// Also update src/data/fallbackPages.ts
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'fallbackPages.ts'),
  'export const FALLBACK_PAGES: Record<string, any> = ' + JSON.stringify(existingPages, null, 2) + ';\n',
  'utf8'
);

console.log('Successfully updated data/pages.json and src/data/fallbackPages.ts with all rich articles!');
