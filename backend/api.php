<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Security Headers
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$DATA_DIR = __DIR__ . '/data';

if (!is_dir($DATA_DIR)) {
    mkdir($DATA_DIR, 0755, true);
}

class JsonCRUD {
    private $dir;
    
    public function __construct($dir) {
        $this->dir = $dir;
    }
    
    public function read($file) {
        $path = $this->dir . '/' . $file . '.json';
        if (!file_exists($path)) return [];
        
        $fp = fopen($path, 'r');
        flock($fp, LOCK_SH);
        $content = stream_get_contents($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        
        return json_decode($content, true) ?: [];
    }
    

    public function init() {
        if (!file_exists($this->dir . '/users.json')) $this->write('users', json_decode('[{"id":1,"name":"Admin Lead","email":"admin@wondercave.nayem.net","password":"password123","role":"Enterprise"},{"id":2,"name":"Tester","email":"test@wondercave.nayem.net","password":"password123","role":"Pro"}]', true));
        if (!file_exists($this->dir . '/products.json')) $this->write('products', json_decode('[{"id":"1","title":"AI Diagnostics","valueProp":"Unify your enterprise data through trusted AI metadata.","description":"Securely connect every system, API, agent, and workflow with built-in governance at scale.","useCases":["Anomaly Detection","Risk Scoring","Data Semantics"],"icon":"Cpu"},{"id":"2","title":"Cloud Infrastructure","valueProp":"Secure, compliant, and high-performance foundation.","description":"Our infrastructure provides deployable assets for various technical and business use cases.","useCases":["Sandbox Environments","Load Balancing","High Availability"],"icon":"Cloud"},{"id":"3","title":"Enterprise CRM","valueProp":"Run your business from anywhere using modular AI tools.","description":"Our business data cloud makes even more impactful decisions with a fully managed SaaS solution.","useCases":["Lead Tracking","Sales Automation","Customer Success"],"icon":"Users"},{"id":"4","title":"WonderCave","valueProp":"Train your team on real-world vulnerabilities.","description":"Interactive labs, expert research, and tracking for enterprise security teams.","useCases":["Red Teaming","Compliance Training","Skill Tracking"],"icon":"Shield"}]', true));
        if (!file_exists($this->dir . '/leaderboard.json')) $this->write('leaderboard', json_decode('[{"id":"1","name":"Sarah Jenkins","role":"Software Engineer","points":24500,"avatar":"https://i.pravatar.cc/150?u=sarah&alt=avatar-sarah-xk9s"},{"id":"2","name":"Marcus Chen","role":"Culture Champion","points":21200,"avatar":"https://i.pravatar.cc/150?u=marcus&alt=avatar-marcus-mc98"},{"id":"3","name":"Elara Vance","role":"Lead Architect","points":19800,"avatar":"https://i.pravatar.cc/150?u=elara&alt=avatar-elara-ev11"},{"id":"4","name":"Tyrell Wellick","role":"Security Researcher","points":15400,"avatar":"https://i.pravatar.cc/150?u=tyrell&alt=avatar-tyrell-tw56"}]', true));
        if (!file_exists($this->dir . '/activity.json')) $this->write('activity', []);
        if (!file_exists($this->dir . '/announcement.json')) $this->write('announcement', json_decode('{"show":true,"message":"WonderCave — Free Cybersecurity Training, Now Live.","linkText":"Learn more ->","linkUrl":"#","backgroundColor":"bg-brand-primary","textColor":"text-white"}', true));
        if (!file_exists($this->dir . '/theme.json')) $this->write('theme', json_decode('{"brandPrimary":"#2563EB","actionIris":"#484DED","bgPeach":"#F3D9DA"}', true));
        if (!file_exists($this->dir . '/pages.json')) $this->write('pages', json_decode('{\n  "products": {\n    "title": "Hacking Tools & Products",\n    "subtitle": "Popular tools for security assessments",\n    "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&alt=tech-tools",\n    "content": "## Password Cracking Tools\\n\\n*   **Ophcrack** – This tool is used for cracking passwords in Windows applications.\\n*   **Cain and Abel** – Useful for cracking hashes, VNC and Windows passwords, and many other applications.\\n*   **John the Ripper** – Combines a dictionary style of attack before launching a complete brute force attack. Used for cracking LINUX and hashed Windows passwords.\\n\\n## Network Scanning\\n\\n*   **Nmap**: A free open source utility tool for network discovery and security auditing.\\n*   **Wireshark**: A popular packet sniffer to analyze incoming traffic.\\n\\n## Vulnerability Scanners\\n\\n*   **Metasploit**: Provides attack libraries and attack payloads that can be put together in a modular manner.\\n*   **Nessus**: A popular vulnerability scanner with a huge library of vulnerabilities and tests to identify them."\n  },\n  "solutions": {\n    "title": "Industry Solutions",\n    "subtitle": "Security solutions tailored for your specific industry.",\n    "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800&alt=solutions-hero",\n    "content": "## Enterprise Security\\n\\nWe provide advanced malware detection, zero-day threat prevention, and real-time network monitoring. By understanding the hacker\'s methodology, organizations can build proper defenses.\\n\\n### Why Perform Penetration Testing?\\n\\n*   **Identify weaknesses** that malicious hackers may exploit.\\n*   **Justify to management** the need for more resources.\\n*   **Confirm that the internal security team is doing its job**.\\n*   **Training for network staff**."\n  },\n  "resources": {\n    "title": "Resources & Documentation",\n    "subtitle": "Everything you need to succeed.",\n    "imageUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&alt=resources-hero",\n    "content": "## Knowledge Base\\n\\nAccess technical documentation, read our blog for updates, and watch webinars to expand your team\'s knowledge.\\n\\n### Physical Security\\n\\nYou do not have to hack into a network remotely to gain access to data. You can gain physical access to a facility and perform your exploit from within. Factors to consider include:\\n\\n*   **Perimeter Security**: Fences, dogs, surveillance cameras.\\n*   **ID Badges**: Used to monitor and control movement.\\n*   **Intrusion Detection Systems**: Motion detectors and alarms."\n  },\n  "pricing": {\n    "title": "Transparent Pricing",\n    "subtitle": "Flexible plans for any team size.",\n    "imageUrl": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&alt=pricing-hero",\n    "content": "## Plans\\n\\nStart for free or scale up to our enterprise solutions. Pay for what you use, and never deal with hidden fees.\\n\\nOur Free Tier includes:\\n* Access to community forums\\n* Basic malware scanner\\n\\nEnterprise Tier:\\n* Dedicated pentesting\\n* Advance threat modeling\\n* 24/7 Incident response"\n  },\n  "learning-paths": {\n    "title": "Learning Paths",\n    "subtitle": "Guided curriculum for every role.",\n    "imageUrl": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800&alt=learning-paths-hero",\n    "content": "## Curriculum\\n\\nSelect a path tailored for administrators, end users, or developers.\\n\\n### Beginner Track\\n\\n1. Computer skills - command line, basic scripts.\\n2. Working knowledge of Linux - custom OS environments.\\n3. Networking skills - subnets, DNS, protocols.\\n\\n### Advanced Track\\n\\n1. Database enumeration - Oracle, MySQL exploits.\\n2. Scripting & Reverse Engineering.\\n3. Virtualization & Malware Sandbox."\n  },\n  "latest-topics": {\n    "title": "Latest Topics",\n    "subtitle": "Social Engineering & Wireless Attacks",\n    "imageUrl": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800&alt=cyber-security",\n    "content": "## Social Engineering\\n\\nSocial engineering, in the context of information security, refers to psychological manipulation of people into performing actions or divulging confidential information.\\n\\n*   **Phishing**: An e-mail fraud method in which the perpetrator sends out legitimate-looking email in an attempt to gather personal and financial information from recipients.\\n*   **Baiting**: Like the real-world Trojan Horse that uses physical media and relies on the curiosity or greed of the victim.\\n*   **Tailgating**: An attacker, seeking entry to a restricted area secured by unattended, electronic access control, simply walks in behind a person who has legitimate access.\\n\\n## Wireless Network Attacks\\n\\n*   **Unintentional association**: When one wireless network overlaps with another, allowing a user to unintentionally jump from one into the other.\\n*   **MAC spoofing**: Theft of the identity of a computer that has network privileges."\n  },\n  "all-content": {\n    "title": "All Content",\n    "subtitle": "Browse our entire library.",\n    "imageUrl": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800&alt=all-content-hero",\n    "content": "## Library Index\\n\\nA comprehensive index of every lab, article, and tutorial we have written.\\n\\n### Featured Articles\\n\\n- How to Carry Out MAC Spoofing Attacks\\n- Securing a Wireless Network\\n- Smartphone Hacking Countermeasures\\n- Gaining Physical Access: CCTV and Smart Cards"\n  },\n  "hall-of-fame": {\n    "title": "Hall of Fame",\n    "subtitle": "Recognizing our top contributors.",\n    "imageUrl": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=800&alt=hall-of-fame-hero",\n    "content": "## Top Hackers & Security Researchers\\n\\nCheck the leaderboard to discover who has solved the most labs and contributed the highest-rated guides.\\n\\n*   **White Hats**: Those who consistently find zero-days and report them responsibly.\\n*   **Gray Hats**: Occasional rogue exploits but end up patching systems."\n  },\n  "get-started": {\n    "title": "Get Started",\n    "subtitle": "Welcome to the Academy.",\n    "imageUrl": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800&alt=get-started-hero",\n    "content": "## Next Steps\\n\\nA step-by-step guide to setting up your workspace.\\n\\n1.  **Avoid the trap** of buying hacking software from random websites.\\n2.  **Avoid downloading freeware** off the internet. They mostly include keyloggers.\\n3.  **Learn to develop your skills**. Build your foundation in web development and programming."\n  },\n  "get-certified": {\n    "title": "Get Certified",\n    "subtitle": "Prove your skills to the world.",\n    "imageUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800&alt=get-certified-hero",\n    "content": "## Official Exams\\n\\nTake our official exams and earn badges to add to your professional portfolio or share on social media. Demonstrating your knowledge in penetration testing, social engineering, and network security adds immense value to your resume in a world with $6 trillion in cybercrime damages annually."\n  },\n  "learning-materials": {\n    "title": "Learning Materials",\n    "subtitle": "Understanding Malware and Common Attacks",\n    "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&alt=code-screen",\n    "content": "## Malware : A Hackers Henchman\\n\\nMalware is defined by its malicious intent, acting against the requirements of the computer user. \\n\\n### Types of Malware\\n\\n*   **Adware**: Automatically delivers advertisements. Often bundled with spyware.\\n*   **Spyware**: Functions by spying on user activity without their knowledge. Includes activity monitoring, collecting keystrokes, data harvesting.\\n*   **Bot**: Software programs created to automatically perform specific operations. Often used in botnets for DDoS attacks.\\n*   **Ransomware**: Holds a computer system captive while demanding a ransom.\\n*   **Trojan Horse**: Disguises itself as a normal file or program to trick users into downloading and installing malware.\\n*   **Worm**: Spread over computer networks by exploiting operating system vulnerabilities."\n  },\n  "labs": {\n    "title": "Interactive Labs",\n    "subtitle": "Practice in a sandbox environment.",\n    "imageUrl": "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=800&alt=labs-hero",\n    "content": "## Sandbox Environments\\n\\nHone your skills without affecting production data. Try new configurations or explore advanced API usage.\\n\\n### Practical Exercises\\n\\n*   **Password Cracking Tools**: Lab environment using Ophcrack, Cain and Abel, and John the Ripper to extract hashed passwords.\\n*   **Smartphone Hacking**: Tracking GPS locations, intercepting texts using MasterLocate tools in a safe network."\n  },\n  "demo": {\n    "title": "Live Demo",\n    "subtitle": "Experience the toolkit in real time.",\n    "imageUrl": "https://images.unsplash.com/photo-1549487222-d0233486b7e6?auto=format&fit=crop&q=80&w=800&alt=live-demo-hero",\n    "content": "## Live Previews\\n\\nAccess a fully functioning instance of the latest Enterprise software pre-filled with sample data.\\n\\nSee how automated tools intercept HTTP packets, manipulate DOM elements, or sniff open ports in real-time."\n  },\n  "docs": {\n    "title": "API Documentation",\n    "subtitle": "Reference for developers.",\n    "imageUrl": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800&alt=api-docs-hero",\n    "content": "## API References\\n\\nDetailed endpoint references, parameter specifications, and code snippets in multiple languages for our security scanners, monitoring endpoints, and vulnerability reporting interfaces."\n  },\n  "academy": {\n    "title": "Hacking Academy",\n    "subtitle": "The Beginner\'s Complete Guide to Computer Hacking and Penetration Testing",\n    "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800&alt=hacker-matrix",\n    "content": "## Introduction\\n\\nCyber crime is the biggest threat that every organization on the planet faces today! Inside this academy we aim to show you the importance of staying on top of this threat by learning how to hack.\\n\\n## Hacking Defined\\n\\nHacking can be defined as an attempt to solve a problem or improve an application by re-engineering hardware or software. The first recorded \\"hackers\\" were a bunch of MIT geeks who used old telephone equipment to control their model trains way back in the 1950s.\\n\\n## Categories of hackers\\n\\n*   **White Hats** – Also known as \'ethical hackers,\' these hackers operate within the law. They stick to the hacker ethic, which states that a hacker should \\"do no harm.\\"\\n*   **Black Hats** – This type of hacker is often convinced that they are doing a public service, but in reality, their major motivation is power and money.\\n*   **Gray Hats** – Hackers who used to be Black Hats but have reformed and are now working as cyber security experts."\n  },\n  "services": {\n    "title": "Penetration Testing Services",\n    "subtitle": "Professional IT security evaluation",\n    "imageUrl": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=800&alt=server-room",\n    "content": "## What is Penetration Testing?\\n\\nPenetration testing evaluates an organization\'s ability to protect its networks, applications, endpoints and users from external or internal attempts to circumvent its security controls.\\n\\n### Pen Test Strategies\\n\\n1.  **Targeted testing**: Performed by the organization\'s IT team and the penetration testing team working together.\\n2.  **External testing**: Targets a company\'s externally visible servers or devices including domain name servers (DNS), e-mail servers, Web servers or firewalls.\\n3.  **Internal testing**: Mimics an inside attack behind the firewall by an authorized user with standard access privileges.\\n4.  **Blind testing**: Simulates the actions and procedures of a real attacker by severely limiting the information given to the person or team that\'s performing the test beforehand."\n  },\n  "research": {\n    "title": "Research & Reconnaissance",\n    "subtitle": "The Hacker\'s Methodology",\n    "imageUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&alt=hacking-research",\n    "content": "## Target Mapping\\n\\nFinding the perfect target for your attack is not as simple as it sounds. You have to be strategic in the way you conduct your research. The objective of mapping your target is to determine what and who you are attacking before penetrating the system.\\n\\n### Scanning the Target Network\\n\\nYou can begin to use scanning software to find and record any hosts that are accessible online. Tools like Nmap, SuperScan, and NetScan Tools Pro are able to ping the hostname of the domain or multiple IP addresses simultaneously.\\n\\n### Exposing System Vulnerabilities\\n\\nAssuming you find some vulnerability in your target\'s system, you can then start checking if these security gaps are exploitable. The automated method involves the use of tools such as QualysGuard or Nexpose."\n  },\n  "social-engineering": {\n    "title": "Social Engineering",\n    "subtitle": "Hacking the human mind.",\n    "imageUrl": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800&alt=social-engineering",\n    "content": "## Gaining Trust\\n\\nOne of the best ways to build trust for a social engineering hack is through words and actions. You have to be articulate, sharp, and be a good conversationalist.\\n\\n### Common Tactics\\n\\n*   **Phishing**: Spoofing IPs and requesting private information.\\n*   **Shoulder Surfing**: Watching someone enter their password."\n  },\n  "sql-injection": {\n    "title": "SQL Injection",\n    "subtitle": "Manipulating database queries.",\n    "imageUrl": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800&alt=sql-injection",\n    "content": "## Vulnerabilities\\n\\nSQL injection allows attackers to spoof identity, tamper with existing data, cause repudiation issues such as voiding transactions or changing balances, allow the complete disclosure of all data on the system, destroy the data or make it otherwise unavailable, and become administrators of the database server."\n  },\n  "buy": {\n    "title": "Buy WonderCave ERP",\n    "subtitle": "Secure and empower your enterprise today.",\n    "imageUrl": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800&alt=buy-hero",\n    "content": "## Purchase Licenses\\n\\nEquip your enterprise with the WonderCave cyber-secure suite. We offer competitive pricing for volume licensing and complete architectural reviews with each purchase."\n  },\n  "company": {\n    "title": "Our Company",\n    "subtitle": "Pioneering secure ERP software.",\n    "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&alt=company-hero",\n    "content": "## Our Mission\\n\\nWe provide advanced malware detection, zero-day threat prevention, and real-time network monitoring. By understanding the hacker\'s methodology, organizations can build proper defenses."\n  },\n  "contact": {\n    "title": "Contact Us",\n    "subtitle": "We\'re here to secure your business.",\n    "imageUrl": "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=800&alt=contact-hero",\n    "content": "## Get In Touch\\n\\nFor enterprise sales, security audits, or general inquiries, please email our support team. We value your data security above all else."\n  },\n  "webinars": {\n    "title": "Webinars",\n    "subtitle": "Learn directly from security experts.",\n    "imageUrl": "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800&alt=webinars-hero",\n    "content": "## Upcoming Sessions\\n\\nJoin our White Hat hackers for exclusive Q&A sessions on the latest network penetration tools and password encryption logic."\n  },\n  "events": {\n    "title": "Events",\n    "subtitle": "Join our security conferences.",\n    "imageUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&alt=events-hero",\n    "content": "## Security Conventions\\n\\nWonderCave researchers regularly attend and speak at leading security conferences worldwide, detailing the latest in Android exploits, phishing techniques, and cyber countermeasures."\n  },\n  "store": {\n    "title": "Merch Store",\n    "subtitle": "Swag for the ethical hacker.",\n    "imageUrl": "https://images.unsplash.com/photo-1521556662923-4467bd1ec3f7?auto=format&fit=crop&q=80&w=800&alt=store-hero",\n    "content": "## Hack The Planet\\n\\nRepresent the ethical hacking community with our exclusive line of branded T-Shirts, hoodies, and hardware dongles."\n  }\n}', true));
    }

    public function write($file, $data) {
        $path = $this->dir . '/' . $file . '.json';
        $fp = fopen($path, 'c+');
        if (flock($fp, LOCK_EX)) {
            ftruncate($fp, 0);
            fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
            fflush($fp);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
    }
}

$crud = new JsonCRUD($DATA_DIR);
$crud->init();

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    switch ($action) {
        
        case 'theme':
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $crud->write('theme', $input);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode($crud->read('theme'));
            }
            break;

        case 'announcement':
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $crud->write('announcement', $input);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode($crud->read('announcement'));
            }
            break;

        case 'pages':
            echo json_encode($crud->read('pages'));
            break;

        case 'products':
            echo json_encode($crud->read('products'));
            break;
            
        case 'leaderboard':
            echo json_encode($crud->read('leaderboard'));
            break;

        case 'activity':
            echo json_encode($crud->read('activity'));
            break;

        case 'login':
            if ($method !== 'POST') {
                http_response_code(405);
                echo json_encode(['error' => 'Method Not Allowed']);
                break;
            }
            $input = json_decode(file_get_contents('php://input'), true);
            $email = isset($input['email']) ? htmlspecialchars($input['email']) : '';
            $password = isset($input['password']) ? $input['password'] : '';
            
            $users = $crud->read('users');
            $found = null;
            foreach ($users as $u) {
                if ($u['email'] === $email && $u['password'] === $password) {
                    $found = $u;
                    break;
                }
            }
            
            if ($found) {
                // Log activity
                $activity = $crud->read('activity');
                array_unshift($activity, [
                    'id' => time(),
                    'user' => $found['name'],
                    'action' => 'Login',
                    'date' => date('c')
                ]);
                $crud->write('activity', array_slice($activity, 0, 100)); // Keep 100
                
                unset($found['password']);
                echo json_encode([
                    'token' => 'csrf_token_' . bin2hex(random_bytes(16)),
                    'user' => $found
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error']);
}
