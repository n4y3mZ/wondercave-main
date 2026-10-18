import fs from 'fs/promises';
import path from 'path';

const pagesData = {
  "solutions": {
    "title": "Industry Solutions",
    "subtitle": "Security solutions tailored for your specific industry.",
    "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800&alt=solutions-hero",
    "content": "## Enterprise Security\n\nWe provide advanced malware detection, zero-day threat prevention, and real-time network monitoring. By understanding the hacker's methodology, organizations can build proper defenses.\n\n### Why Perform Penetration Testing?\n\n*   **Identify weaknesses** that malicious hackers may exploit.\n*   **Justify to management** the need for more resources.\n*   **Confirm that the internal security team is doing its job**.\n*   **Training for network staff**."
  },
  "resources": {
    "title": "Resources & Documentation",
    "subtitle": "Everything you need to succeed.",
    "imageUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&alt=resources-hero",
    "content": "## Knowledge Base\n\nAccess technical documentation, read our blog for updates, and watch webinars to expand your team's knowledge.\n\n### Physical Security\n\nYou do not have to hack into a network remotely to gain access to data. You can gain physical access to a facility and perform your exploit from within. Factors to consider include:\n\n*   **Perimeter Security**: Fences, dogs, surveillance cameras.\n*   **ID Badges**: Used to monitor and control movement.\n*   **Intrusion Detection Systems**: Motion detectors and alarms."
  },
  "pricing": {
    "title": "Transparent Pricing",
    "subtitle": "Flexible plans for any team size.",
    "imageUrl": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&alt=pricing-hero",
    "content": "## Plans\n\nStart for free or scale up to our enterprise solutions. Pay for what you use, and never deal with hidden fees.\n\nOur Free Tier includes:\n* Access to community forums\n* Basic malware scanner\n\nEnterprise Tier:\n* Dedicated pentesting\n* Advance threat modeling\n* 24/7 Incident response"
  },
  "learning-paths": {
    "title": "Learning Paths",
    "subtitle": "Guided curriculum for every role.",
    "imageUrl": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800&alt=learning-paths-hero",
    "content": "## Curriculum\n\nSelect a path tailored for administrators, end users, or developers.\n\n### Beginner Track\n\n1. Computer skills - command line, basic scripts.\n2. Working knowledge of Linux - custom OS environments.\n3. Networking skills - subnets, DNS, protocols.\n\n### Advanced Track\n\n1. Database enumeration - Oracle, MySQL exploits.\n2. Scripting & Reverse Engineering.\n3. Virtualization & Malware Sandbox."
  },
  "all-content": {
    "title": "All Content",
    "subtitle": "Browse our entire library.",
    "imageUrl": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800&alt=all-content-hero",
    "content": "## Library Index\n\nA comprehensive index of every lab, article, and tutorial we have written.\n\n### Featured Articles\n\n- How to Carry Out MAC Spoofing Attacks\n- Securing a Wireless Network\n- Smartphone Hacking Countermeasures\n- Gaining Physical Access: CCTV and Smart Cards"
  },
  "hall-of-fame": {
    "title": "Hall of Fame",
    "subtitle": "Recognizing our top contributors.",
    "imageUrl": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=800&alt=hall-of-fame-hero",
    "content": "## Top Hackers & Security Researchers\n\nCheck the leaderboard to discover who has solved the most labs and contributed the highest-rated guides.\n\n*   **White Hats**: Those who consistently find zero-days and report them responsibly.\n*   **Gray Hats**: Occasional rogue exploits but end up patching systems."
  },
  "get-started": {
    "title": "Get Started",
    "subtitle": "Welcome to the Academy.",
    "imageUrl": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800&alt=get-started-hero",
    "content": "## Next Steps\n\nA step-by-step guide to setting up your workspace.\n\n1.  **Avoid the trap** of buying hacking software from random websites.\n2.  **Avoid downloading freeware** off the internet. They mostly include keyloggers.\n3.  **Learn to develop your skills**. Build your foundation in web development and programming."
  },
  "get-certified": {
    "title": "Get Certified",
    "subtitle": "Prove your skills to the world.",
    "imageUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800&alt=get-certified-hero",
    "content": "## Official Exams\n\nTake our official exams and earn badges to add to your professional portfolio or share on social media. Demonstrating your knowledge in penetration testing, social engineering, and network security adds immense value to your resume in a world with $6 trillion in cybercrime damages annually."
  },
  "labs": {
    "title": "Interactive Labs",
    "subtitle": "Practice in a sandbox environment.",
    "imageUrl": "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=800&alt=labs-hero",
    "content": "## Sandbox Environments\n\nHone your skills without affecting production data. Try new configurations or explore advanced API usage.\n\n### Practical Exercises\n\n*   **Password Cracking Tools**: Lab environment using Ophcrack, Cain and Abel, and John the Ripper to extract hashed passwords.\n*   **Smartphone Hacking**: Tracking GPS locations, intercepting texts using MasterLocate tools in a safe network."
  },
  "demo": {
    "title": "Live Demo",
    "subtitle": "Experience the toolkit in real time.",
    "imageUrl": "https://images.unsplash.com/photo-1549487222-d0233486b7e6?auto=format&fit=crop&q=80&w=800&alt=live-demo-hero",
    "content": "## Live Previews\n\nAccess a fully functioning instance of the latest Enterprise software pre-filled with sample data.\n\nSee how automated tools intercept HTTP packets, manipulate DOM elements, or sniff open ports in real-time."
  },
  "docs": {
    "title": "API Documentation",
    "subtitle": "Reference for developers.",
    "imageUrl": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800&alt=api-docs-hero",
    "content": "## API References\n\nDetailed endpoint references, parameter specifications, and code snippets in multiple languages for our security scanners, monitoring endpoints, and vulnerability reporting interfaces."
  },
  "social-engineering": {
    "title": "Social Engineering",
    "subtitle": "Hacking the human mind.",
    "imageUrl": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800&alt=social-engineering",
    "content": "## Gaining Trust\n\nOne of the best ways to build trust for a social engineering hack is through words and actions. You have to be articulate, sharp, and be a good conversationalist.\n\n### Common Tactics\n\n*   **Phishing**: Spoofing IPs and requesting private information.\n*   **Shoulder Surfing**: Watching someone enter their password."
  },
  "sql-injection": {
    "title": "SQL Injection",
    "subtitle": "Manipulating database queries.",
    "imageUrl": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800&alt=sql-injection",
    "content": "## Vulnerabilities\n\nSQL injection allows attackers to spoof identity, tamper with existing data, cause repudiation issues such as voiding transactions or changing balances, allow the complete disclosure of all data on the system, destroy the data or make it otherwise unavailable, and become administrators of the database server."
  },
  "buy": {
    "title": "Buy WonderCave ERP",
    "subtitle": "Secure and empower your enterprise today.",
    "imageUrl": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800&alt=buy-hero",
    "content": "## Purchase Licenses\n\nEquip your enterprise with the WonderCave cyber-secure suite. We offer competitive pricing for volume licensing and complete architectural reviews with each purchase."
  },
  "company": {
    "title": "Our Company",
    "subtitle": "Pioneering secure ERP software.",
    "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&alt=company-hero",
    "content": "## Our Mission\n\nWe provide advanced malware detection, zero-day threat prevention, and real-time network monitoring. By understanding the hacker's methodology, organizations can build proper defenses."
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "We're here to secure your business.",
    "imageUrl": "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=800&alt=contact-hero",
    "content": "## Get In Touch\n\nFor enterprise sales, security audits, or general inquiries, please email our support team. We value your data security above all else."
  },
  "webinars": {
    "title": "Webinars",
    "subtitle": "Learn directly from security experts.",
    "imageUrl": "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800&alt=webinars-hero",
    "content": "## Upcoming Sessions\n\nJoin our White Hat hackers for exclusive Q&A sessions on the latest network penetration tools and password encryption logic."
  },
  "events": {
    "title": "Events",
    "subtitle": "Join our security conferences.",
    "imageUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&alt=events-hero",
    "content": "## Security Conventions\n\nWonderCave researchers regularly attend and speak at leading security conferences worldwide, detailing the latest in Android exploits, phishing techniques, and cyber countermeasures."
  },
  "store": {
    "title": "Merch Store",
    "subtitle": "Swag for the ethical hacker.",
    "imageUrl": "https://images.unsplash.com/photo-1521556662923-4467bd1ec3f7?auto=format&fit=crop&q=80&w=800&alt=store-hero",
    "content": "## Hack The Planet\n\nRepresent the ethical hacking community with our exclusive line of branded T-Shirts, hoodies, and hardware dongles."
  }
};

async function seed() {
  const filePath = path.join(process.cwd(), 'data', 'pages.json');
  let current = {};
  try {
    current = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch (e) {}
  
  const merged = { ...current, ...pagesData };
  await fs.writeFile(filePath, JSON.stringify(merged, null, 2));
  console.log('Seeded more pages.json successfully.');
}

seed();
