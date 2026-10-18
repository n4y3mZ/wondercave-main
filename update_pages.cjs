const fs = require('fs');
const path = 'data/pages.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

Object.assign(data, {
  "about": {
    "title": "About WonderCave",
    "subtitle": "Our mission, team, and story.",
    "imageUrl": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    "content": "## About Us\n\nAll cybersecurity content on WonderCave is produced for educational purposes only. Our mission is to help security professionals, students, and developers understand how vulnerabilities work so they can build safer software and defend real systems. We strictly follow responsible disclosure principles and do not condone unauthorized access to computer systems. The techniques described on this platform should only ever be applied to systems you own or have explicit written permission to test.\n\n## What We Do\n\nWe provide interactive labs, extensive documentation, and hands-on scenarios mimicking real-world environments to prepare you for any cyber threats.\n\n## Values\n\n* **Free Access**: We believe security education should be accessible to everyone.\n* **Community**: We foster a community of learning and responsible disclosure.\n* **Expert Content**: Our materials are driven by research from industry professionals.\n* **Ethics**: We emphasize ethical hacking and defensive practices."
  },
  "legal": {
    "title": "Legal Information",
    "subtitle": "Terms of Service and Policies.",
    "imageUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    "content": "## Terms of Service\n\n### 1. Acceptance\nBy using WonderCave, you agree to these terms.\n\n### 2. Use Policy\nAll techniques must be used for educational purposes and only on systems you have permission to test.\n\n### 3. Intellectual Property\nContent on this site is copyrighted by WonderCave.\n\n### 4. Disclaimers\nWe are not responsible for any damage caused by the misuse of provided information.\n\n### 5. Governing Law\nThese terms are governed by applicable global cyber laws."
  },
  "privacy": {
    "title": "Privacy Policy",
    "subtitle": "How we handle your data.",
    "imageUrl": "https://images.unsplash.com/photo-1507925922837-326522bd17b4?auto=format&fit=crop&q=80&w=800",
    "content": "## Privacy Policy\n\n### Data Collection\nWe collect no personal tracking data by default. We do not use third-party tracking or advertising cookies.\n\n### Cookies\nWonderCave uses only essential cookies to remember your session and preferences. \n\n### Third-Party Services\nWe use Unsplash for imagery and Pravatar for avatars.\n\n### Contact\nFor privacy inquiries, email privacy@wondercave.nayem.net."
  },
  "cross-site-scripting": {
    "title": "Cross-Site Scripting (XSS)",
    "subtitle": "Injecting malicious scripts.",
    "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nCross-Site Scripting (XSS) occurs when an application includes untrusted data in a web page without proper validation or escaping.\n\n### Types of XSS\n\n* **Stored XSS**: The malicious script is permanently stored on the target servers.\n* **Reflected XSS**: The injected script reflects off the web server, such as in an error message or search result.\n\n### Prevention\n\nUse proper input validation and context-aware output encoding. Modern web frameworks often have built-in protections against XSS."
  },
  "cross-site-request-forgery": {
    "title": "Cross-Site Request Forgery (CSRF)",
    "subtitle": "Forcing unwanted actions.",
    "imageUrl": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nCSRF exploits the trust a website has in a user's browser. It forces an end user to execute unwanted actions on a web application in which they're currently authenticated.\n\n### Impact\n\nAttackers can trick victims into transferring funds, changing email addresses, and more.\n\n### Prevention\n\nImplement anti-CSRF tokens for all state-changing requests."
  },
  "xxe-injection": {
    "title": "XML External Entity (XXE) Injection",
    "subtitle": "Exploiting XML parsers.",
    "imageUrl": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nXXE attacks occur when XML input containing a reference to an external entity is processed by a weakly configured XML parser.\n\n### Impact\n\nThis leads to confidential data disclosure, denial of service, server side request forgery, port scanning from the perspective of the machine where the parser is located, and other system impacts.\n\n### Prevention\n\nDisable XML external entity and DTD processing in the XML parser completely."
  },
  "web-cache-deception": {
    "title": "Web Cache Deception",
    "subtitle": "Tricking caches.",
    "imageUrl": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nWeb Cache Deception occurs when an attacker tricks a caching server into storing sensitive, user-specific content, which the attacker can then retrieve.\n\n### Prevention\n\nConfigure caching proxies carefully to only cache designated static files and never cache responses containing sensitive information."
  },
  "web-llm-attacks": {
    "title": "Web LLM Attacks",
    "subtitle": "Prompt injection and data poisoning.",
    "imageUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nWith the integration of Large Language Models (LLMs) in web applications, new attack vectors have emerged such as Prompt Injection and Training Data Poisoning.\n\n### Prevention\n\nStrictly limit the privileges and access of the LLM agent and use prompt validation techniques."
  },
  "api-testing": {
    "title": "API Testing",
    "subtitle": "Securing underlying interfaces.",
    "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nAPIs expose core business logic and sensitive data. Attackers often target APIs directly rather than the web UI.\n\n### Common Vulnerabilities\n\nBroken Object Level Authorization (BOLA), Broken User Authentication, and Mass Assignment.\n\n### Prevention\n\nImplement strong authentication, authorization, and rate limiting on all API endpoints."
  },
  "nosql-injection": {
    "title": "NoSQL Injection",
    "subtitle": "Exploiting non-relational databases.",
    "imageUrl": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nNoSQL databases (like MongoDB) don't use SQL, but they still construct queries dynamically based on user input. Attackers can inject malicious operators to bypass authentication or extract data.\n\n### Prevention\n\nCast input to expected types and use parameterized query APIs or object-document mappers."
  },
  "directory-traversal": {
    "title": "Directory Traversal",
    "subtitle": "Accessing restricted files.",
    "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nA directory traversal (or path traversal) attack allows an attacker to read arbitrary files on the server that is running an application.\n\n### Prevention\n\nAvoid passing user-supplied input to filesystem APIs. If necessary, strictly validate the input against an allowed list of valid files."
  },
  "ssrf": {
    "title": "Server-Side Request Forgery",
    "subtitle": "Inducing arbitrary requests.",
    "imageUrl": "https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&q=80&w=800",
    "content": "## Overview\n\nSSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL.\n\n### Prevention\n\nEnforce strict allow lists for domains and IPs the server is permitted to access."
  },
  "blog": {
    "title": "WonderCave Blog",
    "subtitle": "Updates and insights.",
    "imageUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
    "content": "## Latest Articles\n\nExplore our recent discoveries in mobile security, penetration testing automation, and enterprise threat modeling."
  },
  "case-studies": {
    "title": "Case Studies",
    "subtitle": "Real-world security successes.",
    "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    "content": "## Success Stories\n\nLearn how organizations improved their security posture using WonderCave methodologies."
  },
  "documentation": {
    "title": "Documentation",
    "subtitle": "Technical reference and guides.",
    "imageUrl": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
    "content": "## Guides\n\nFrom getting started with the Smartphone Pentest Framework (SPF) to advanced use of local privilege escalations, our documentation covers it all."
  },
  "ethics": {
    "title": "Ethical Hacking",
    "subtitle": "Responsible disclosure and legality.",
    "imageUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    "content": "## Educational Content Ethics Statement\n\nAll cybersecurity content on WonderCave is produced for educational purposes only. Our mission is to help security professionals, students, and developers understand how vulnerabilities work so they can build safer software and defend real systems. We strictly follow responsible disclosure principles and do not condone unauthorized access to computer systems. The techniques described on this platform should only ever be applied to systems you own or have explicit written permission to test.\n\n## What is Ethical Hacking?\nEthical hacking involves testing systems with the explicit permission of the owner to find and fix vulnerabilities."
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
