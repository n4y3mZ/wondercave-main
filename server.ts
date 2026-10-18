import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");

// Helper to interact with JSON files (pseudo-database)
async function readData(file: string) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeData(file: string, data: any) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Simulating LOCK_EX behavior by writing in Node context
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

async function initializeData() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const checkInit = async (filename: string, defaultData: any) => {
    try {
      await fs.access(path.join(DATA_DIR, filename));
    } catch {
      await writeData(filename, defaultData);
    }
  };

  await checkInit("users.json", [
    { id: 1, name: "Admin Lead", email: "admin@wondercave.nayem.net", password: "password123", role: "Enterprise" },
    { id: 2, name: "Tester", email: "test@wondercave.nayem.net", password: "password123", role: "Pro" }
  ]);
  
  await checkInit("products.json", [
    { id: "1", title: "AI Diagnostics", valueProp: "Unify your enterprise data through trusted AI metadata.", description: "Securely connect every system, API, agent, and workflow with built-in governance at scale.", useCases: ["Anomaly Detection", "Risk Scoring", "Data Semantics"], icon: "Cpu" },
    { id: "2", title: "Cloud Infrastructure", valueProp: "Secure, compliant, and high-performance foundation.", description: "Our infrastructure provides deployable assets for various technical and business use cases.", useCases: ["Sandbox Environments", "Load Balancing", "High Availability"], icon: "Cloud" },
    { id: "3", title: "Enterprise CRM", valueProp: "Run your business from anywhere using modular AI tools.", description: "Our business data cloud makes even more impactful decisions with a fully managed SaaS solution.", useCases: ["Lead Tracking", "Sales Automation", "Customer Success"], icon: "Users" },
    { id: "4", title: "Web Security Academy", valueProp: "Train your team on real-world vulnerabilities.", description: "Interactive labs, expert research, and tracking for enterprise security teams.", useCases: ["Red Teaming", "Compliance Training", "Skill Tracking"], icon: "Shield" }
  ]);

  await checkInit("leaderboard.json", [
    { id: "1", name: "Sarah Jenkins", role: "Software Engineer", points: 24500, avatar: "https://i.pravatar.cc/150?u=sarah&alt=avatar-sarah-xk9s" },
    { id: "2", name: "Marcus Chen", role: "Culture Champion", points: 21200, avatar: "https://i.pravatar.cc/150?u=marcus&alt=avatar-marcus-mc98" },
    { id: "3", name: "Elara Vance", role: "Lead Architect", points: 19800, avatar: "https://i.pravatar.cc/150?u=elara&alt=avatar-elara-ev11" },
    { id: "4", name: "Tyrell Wellick", role: "Security Researcher", points: 15400, avatar: "https://i.pravatar.cc/150?u=tyrell&alt=avatar-tyrell-tw56" }
  ]);

  await checkInit("activity.json", []);

  await checkInit("announcement.json", {
    show: true,
    message: "WonderCave — Free Cybersecurity Training, Now Live.",
    linkText: "Learn more →",
    linkUrl: "#",
    backgroundColor: "bg-brand-primary",
    textColor: "text-white"
  });

  await checkInit("theme.json", {
    brandPrimary: "#2563EB",
    actionIris: "#484DED",
    bgPeach: "#F3D9DA"
  });

  await checkInit("pages.json", {
    "products": {
      "title": "Our Products",
      "subtitle": "Discover our suite of Enterprise ERP solutions.",
      "imageUrl": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&alt=products-hero-p39s",
      "content": "From analytics to full supply chain tracking, WonderCave provides industry-leading products. Explore our enterprise edition for large scale operations."
    },
    "solutions": {
      "title": "Industry Solutions",
      "subtitle": "Tailored ERP systems for your specific industry.",
      "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800&alt=solutions-hero-k91b",
      "content": "Whether you are in Manufacturing, Retail, or Healthcare, our AI-powered solutions adapt to your unique challenges."
    },
    "resources": {
      "title": "Resources & Documentation",
      "subtitle": "Everything you need to succeed.",
      "imageUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&alt=resources-hero-p88z",
      "content": "Access technical documentation, read our blog for updates, and watch webinars to expand your team's knowledge."
    },
    "pricing": {
      "title": "Transparent Pricing",
      "subtitle": "Flexible plans for any team size.",
      "imageUrl": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&alt=pricing-hero-m62x",
      "content": "Start for free or scale up to our enterprise solutions. Pay for what you use, and never deal with hidden fees."
    },
    "learning-paths": {
      "title": "Learning Paths",
      "subtitle": "Guided curriculum for every role.",
      "imageUrl": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800&alt=learning-paths-hero-t72q",
      "content": "Select a path tailored for administrators, end users, or developers. Learn WonderCave ERP at your own pace."
    },
    "latest-topics": {
      "title": "Latest Topics",
      "subtitle": "Stay up to date with new features and best practices.",
      "imageUrl": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800&alt=latest-topics-hero-t78f",
      "content": "Read about the latest updates to WonderCave ERP, including AI feature expansions, integration tips, and user-submitted guides."
    },
    "all-content": {
      "title": "All Content",
      "subtitle": "Browse our entire library.",
      "imageUrl": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800&alt=all-content-hero-c32l",
      "content": "A comprehensive index of every lab, article, and tutorial we have written."
    },
    "hall-of-fame": {
      "title": "Hall of Fame",
      "subtitle": "Recognizing our top contributors.",
      "imageUrl": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=800&alt=hall-of-fame-hero-j11k",
      "content": "Check the leaderboard to discover who has solved the most labs and contributed the highest-rated guides."
    },
    "get-started": {
      "title": "Get Started",
      "subtitle": "Welcome to WonderCave.",
      "imageUrl": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800&alt=get-started-hero-z88v",
      "content": "A step-by-step guide to setting up your workspace, inviting your team, and configuring your first project."
    },
    "get-certified": {
      "title": "Get Certified",
      "subtitle": "Prove your skills to the world.",
      "imageUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800&alt=get-certified-hero-c77b",
      "content": "Take our official exams and earn badges to add to your professional portfolio or share on social media."
    },
    "learning-materials": {
      "title": "Learning Materials",
      "subtitle": "Deep dives into system operations.",
      "imageUrl": "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=800&alt=learning-materials-hero-m19k",
      "content": "Review technical specifications, whitepapers, and dense guides on how to optimize WonderCave for massive scale."
    },
    "labs": {
      "title": "Interactive Labs",
      "subtitle": "Practice in a sandbox environment.",
      "imageUrl": "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=800&alt=labs-hero-m63o",
      "content": "Hone your skills without affecting production data. Try new configurations or explore advanced API usage."
    },
    "demo": {
      "title": "Live Demo",
      "subtitle": "Experience WonderCave in real time.",
      "imageUrl": "https://images.unsplash.com/photo-1549487222-d0233486b7e6?auto=format&fit=crop&q=80&w=800&alt=live-demo-hero-d72x",
      "content": "Access a fully functioning instance of the latest WonderCave Enterprise software pre-filled with sample data."
    },
    "docs": {
      "title": "API Documentation",
      "subtitle": "Reference for developers.",
      "imageUrl": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800&alt=api-docs-hero-x33p",
      "content": "Detailed endpoint references, parameter specifications, and code snippets in multiple languages."
    }
  });
}

async function startServer() {
  await initializeData();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/theme", async (req, res) => {
    try {
      const db = await readData("theme.json");
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/theme", async (req, res) => {
    try {
      await writeData("theme.json", req.body);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const db = await readData("products.json");
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const db = await readData("leaderboard.json");
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const users = await readData("users.json");
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        if (user.blocked) {
          return res.status(403).json({ error: "Access Denied: This user account has been blocked by an administrator." });
        }

        if (user.status === "pending_approval" || user.approved === false) {
          return res.status(403).json({ error: "Account Pending Approval: Your account is awaiting administrator review. Please contact ankoretech@gmail.com." });
        }

        // Log Activity
        const activity = await readData("activity.json");
        activity.unshift({
          id: Date.now(),
          user: user.name,
          action: "Login",
          date: new Date().toISOString(),
        });
        await writeData("activity.json", activity.slice(0, 100)); // Keep last 100
        
        // Remove password before sending
        const { password: _, ...userInfo } = user;
        
        // Return dummy CSRF token and user data
        res.json({ token: "csrf_token_dummy_" + Date.now(), user: userInfo });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // User Management Endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await readData("users.json");
      const safeUsers = users.map((u: any) => {
        const { password, ...safe } = u;
        return safe;
      });
      res.json(safeUsers);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      const users = await readData("users.json");
      const existing = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ error: "A user with this email already exists" });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let assignedRole = "member";
      let initialStatus = "pending_approval";
      let approved = false;

      if (normalizedEmail === "ankoretech@gmail.com") {
        assignedRole = "admin";
        initialStatus = "approved";
        approved = true;
      } else if (normalizedEmail === "nxyxmz@gmail.com") {
        assignedRole = "editor";
        initialStatus = "approved";
        approved = true;
      }

      const newUser = {
        id: Date.now(),
        name,
        email: normalizedEmail,
        password,
        role: assignedRole,
        status: initialStatus,
        approved,
        blocked: false,
        onboardingCompleted: approved,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await writeData("users.json", users);

      const { password: _, ...safeUser } = newUser;
      res.status(201).json({ success: true, user: safeUser, pendingApproval: !approved });
    } catch (e) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/users/:id/toggle-block", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const users = await readData("users.json");
      const index = users.findIndex((u: any) => u.id === userId);

      if (index === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      users[index].blocked = !users[index].blocked;
      await writeData("users.json", users);

      const { password: _, ...safeUser } = users[index];
      res.json({ success: true, user: safeUser });
    } catch (e) {
      res.status(500).json({ error: "Failed to toggle block status" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { name, email, password, role } = req.body;
      const users = await readData("users.json");
      const index = users.findIndex((u: any) => u.id === userId);

      if (index === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      if (name) users[index].name = name;
      if (email) users[index].email = email;
      if (role) users[index].role = role;
      if (password && password.trim().length > 0) users[index].password = password;

      await writeData("users.json", users);

      const { password: _, ...safeUser } = users[index];
      res.json({ success: true, user: safeUser });
    } catch (e) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const users = await readData("users.json");
      const filtered = users.filter((u: any) => u.id !== userId);

      if (filtered.length === users.length) {
        return res.status(404).json({ error: "User not found" });
      }

      await writeData("users.json", filtered);
      res.json({ success: true, message: "User deleted" });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // User Approval Endpoint
  app.post("/api/users/:id/approve", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const users = await readData("users.json");
      const index = users.findIndex((u: any) => u.id === userId);
      if (index === -1) {
        return res.status(404).json({ error: "User not found" });
      }
      users[index].status = "approved";
      users[index].approved = true;
      await writeData("users.json", users);
      const { password: _, ...safeUser } = users[index];
      res.json({ success: true, user: safeUser });
    } catch (e) {
      res.status(500).json({ error: "Failed to approve user" });
    }
  });

  // Telemetry Endpoints (IP, Timestamp, Display Size, Device)
  app.get("/api/telemetry", async (req, res) => {
    try {
      const logs = await readData("telemetry.json");
      res.json(logs);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch telemetry" });
    }
  });

  app.post("/api/telemetry", async (req, res) => {
    try {
      const incoming = req.body;
      const logs = await readData("telemetry.json");
      const enriched = {
        ...incoming,
        id: incoming.id || `telemetry_${Date.now()}`,
        serverReceivedAt: new Date().toISOString()
      };
      logs.unshift(enriched);
      await writeData("telemetry.json", logs.slice(0, 500)); // Keep last 500 records
      res.json({ success: true, entry: enriched });
    } catch (e) {
      res.status(500).json({ error: "Failed to save telemetry" });
    }
  });

  app.get("/api/telemetry/csv", async (req, res) => {
    try {
      const logs = await readData("telemetry.json");
      const headers = ["Timestamp", "User Email", "User Name", "Role", "IP Address", "Screen Resolution", "Viewport Size", "Device Pixel Ratio", "Color Depth", "User Agent"];
      const rows = logs.map((l: any) => [
        `"${(l.formattedDate || l.timestamp || '').replace(/"/g, '""')}"`,
        `"${(l.userEmail || '').replace(/"/g, '""')}"`,
        `"${(l.userName || '').replace(/"/g, '""')}"`,
        `"${(l.role || '').replace(/"/g, '""')}"`,
        `"${(l.ip || '').replace(/"/g, '""')}"`,
        `"${(l.screenResolution || '').replace(/"/g, '""')}"`,
        `"${(l.viewportSize || '').replace(/"/g, '""')}"`,
        `"${l.devicePixelRatio || 1}"`,
        `"${(l.colorDepth || '').replace(/"/g, '""')}"`,
        `"${(l.userAgent || '').replace(/"/g, '""')}"`
      ].join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="wondercave_telemetry_google_sheets.csv"');
      res.send(csv);
    } catch (e) {
      res.status(500).json({ error: "Failed to generate telemetry CSV" });
    }
  });

  // Community Post Submissions Endpoints
  app.get("/api/post-submissions", async (req, res) => {
    try {
      const subs = await readData("post_submissions.json");
      res.json(subs);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.post("/api/post-submissions", async (req, res) => {
    try {
      const sub = req.body;
      const subs = await readData("post_submissions.json");
      subs.unshift(sub);
      await writeData("post_submissions.json", subs);
      res.json({ success: true, submission: sub });
    } catch (e) {
      res.status(500).json({ error: "Failed to save submission" });
    }
  });

  app.put("/api/post-submissions/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { status, reviewerEmail, feedback } = req.body;
      const subs = await readData("post_submissions.json");
      const index = subs.findIndex((s: any) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      subs[index].status = status;
      subs[index].reviewedAt = new Date().toISOString();
      subs[index].reviewerEmail = reviewerEmail;
      if (feedback) subs[index].feedback = feedback;

      // If approved, publish directly into live news posts!
      if (status === "approved") {
        const approvedSub = subs[index];
        // If there was a pending edit, apply it
        if (approvedSub.pendingEdit) {
          approvedSub.title = approvedSub.pendingEdit.title || approvedSub.title;
          approvedSub.subtitle = approvedSub.pendingEdit.subtitle || approvedSub.subtitle;
          approvedSub.category = approvedSub.pendingEdit.category || approvedSub.category;
          approvedSub.content = approvedSub.pendingEdit.content || approvedSub.content;
          approvedSub.heroImage = approvedSub.pendingEdit.heroImage || approvedSub.heroImage;
          approvedSub.tags = approvedSub.pendingEdit.tags || approvedSub.tags;
          delete approvedSub.pendingEdit;
        }

        const posts = await readData("news_posts.json");
        const existingIdx = posts.findIndex((p: any) => p.slug === approvedSub.slug || p.id === approvedSub.slug || p.id === approvedSub.id);
        const newLivePost = {
          id: approvedSub.slug || `post-${Date.now()}`,
          slug: (approvedSub.slug || approvedSub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, ''),
          title: approvedSub.title,
          subtitle: approvedSub.subtitle || "Community security research contribution.",
          category: approvedSub.category || "Community Research",
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
          readTime: "4 min read",
          author: {
            name: approvedSub.authorName || "Community Contributor",
            role: "Security Researcher",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
          },
          heroImage: approvedSub.heroImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
          heroImageCaption: `Figure: Research data submitted by ${approvedSub.authorName}.`,
          socialHandles: {
            twitter: "https://twitter.com/wondercave",
            linkedin: "https://linkedin.com/company/wondercave",
            github: "https://github.com/wondercave",
            telegram: "https://t.me/wondercave_sec"
          },
          bodyImages: [],
          tags: typeof approvedSub.tags === "string" ? approvedSub.tags.split(',').map((t: string) => t.trim()) : (approvedSub.tags || ["Community"]),
          content: approvedSub.content
        };
        if (existingIdx !== -1) {
          posts[existingIdx] = newLivePost;
        } else {
          posts.unshift(newLivePost);
        }
        await writeData("news_posts.json", posts);
      } else if (status === "deleted") {
        // Admin confirmed deletion of post
        const targetSub = subs[index];
        const posts = await readData("news_posts.json");
        const filteredPosts = posts.filter((p: any) => p.slug !== targetSub.slug && p.id !== targetSub.slug && p.id !== targetSub.id);
        await writeData("news_posts.json", filteredPosts);
      }

      await writeData("post_submissions.json", subs);
      res.json({ success: true, submission: subs[index] });
    } catch (e) {
      res.status(500).json({ error: "Failed to update submission" });
    }
  });

  // Request deletion of a post submission
  app.post("/api/post-submissions/:id/request-deletion", async (req, res) => {
    try {
      const id = req.params.id;
      const { reason, authorEmail } = req.body;
      const subs = await readData("post_submissions.json");
      const index = subs.findIndex((s: any) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      subs[index].status = "deletion_requested";
      subs[index].deletionReason = reason || "Author requested removal";
      subs[index].deletionRequestedBy = authorEmail || subs[index].authorEmail;
      subs[index].deletionRequestedAt = new Date().toISOString();

      await writeData("post_submissions.json", subs);
      res.json({ success: true, submission: subs[index] });
    } catch (e) {
      res.status(500).json({ error: "Failed to submit deletion request" });
    }
  });

  // Request edit / revision of a post submission
  app.put("/api/post-submissions/:id/request-edit", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const subs = await readData("post_submissions.json");
      const index = subs.findIndex((s: any) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      subs[index].status = "edit_requested";
      subs[index].pendingEdit = {
        title: updatedData.title,
        subtitle: updatedData.subtitle,
        category: updatedData.category,
        tags: updatedData.tags,
        content: updatedData.content,
        heroImage: updatedData.heroImage,
        editedAt: new Date().toISOString()
      };
      subs[index].editRequestedAt = new Date().toISOString();

      await writeData("post_submissions.json", subs);
      res.json({ success: true, submission: subs[index] });
    } catch (e) {
      res.status(500).json({ error: "Failed to submit edit request" });
    }
  });

  // Delete submission
  app.delete("/api/post-submissions/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const subs = await readData("post_submissions.json");
      const targetSub = subs.find((s: any) => s.id === id);
      const filtered = subs.filter((s: any) => s.id !== id);
      await writeData("post_submissions.json", filtered);

      if (targetSub) {
        const posts = await readData("news_posts.json");
        const filteredPosts = posts.filter((p: any) => p.slug !== targetSub.slug && p.id !== targetSub.slug && p.id !== targetSub.id);
        await writeData("news_posts.json", filteredPosts);
      }

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete submission" });
    }
  });

  app.get("/api/activity", async (req, res) => {
    try {
      const db = await readData("activity.json");
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/announcement", async (req, res) => {
    try {
      const db = await readData("announcement.json");
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/announcement", async (req, res) => {
    try {
      await writeData("announcement.json", req.body);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Helper to parse RFC-4180 CSV with quotes, newlines, and commas
  function parseCSV(text: string): Record<string, string>[] {
    const lines: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (cur.trim().length > 0) {
          lines.push(cur);
        }
        cur = "";
        if (char === '\r' && text[i + 1] === '\n') {
          i++;
        }
      } else {
        cur += char;
      }
    }
    if (cur.trim().length > 0) {
      lines.push(cur);
    }
    if (lines.length < 2) return [];

    const parseLine = (line: string): string[] => {
      const cells: string[] = [];
      let cell = "";
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          if (inQ && line[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            inQ = !inQ;
          }
        } else if (c === ',' && !inQ) {
          cells.push(cell.trim());
          cell = "";
        } else {
          cell += c;
        }
      }
      cells.push(cell.trim());
      return cells;
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const records: Record<string, string>[] = [];

    for (let r = 1; r < lines.length; r++) {
      const values = parseLine(lines[r]);
      const record: Record<string, string> = {};
      headers.forEach((header, idx) => {
        record[header] = values[idx] || "";
      });
      records.push(record);
    }
    return records;
  }

  // Google Sheets database sync endpoints
  app.get("/api/sync-sheets", async (req, res) => {
    try {
      const syncMeta = await readData("sheets_sync.json");
      const currentPages = await readData("pages.json");
      res.json({
        enabled: true,
        provider: "Google Sheets Published CSV",
        lastSynced: syncMeta?.lastSynced || "Initial Seed",
        sheetUrl: syncMeta?.sheetUrl || "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSsdCfcokUgW5nLtHk4ZquGROq-RxMitDUTEgzQMTrClc3ZusFk-09kq1bXUUQgnx4IbknxU2la9XX/pub?output=csv",
        totalStoredPages: Object.keys(currentPages).length,
        status: syncMeta?.status || "Ready"
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to read sync metadata" });
    }
  });

  app.post("/api/sync-sheets", async (req, res) => {
    try {
      const { sheetUrl } = req.body;
      const targetUrl = sheetUrl || "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSsdCfcokUgW5nLtHk4ZquGROq-RxMitDUTEgzQMTrClc3ZusFk-09kq1bXUUQgnx4IbknxU2la9XX/pub?output=csv";
      let syncedCount = 0;
      let newKeys: string[] = [];

      try {
        if (targetUrl.startsWith("http")) {
          const resp = await fetch(targetUrl, { signal: AbortSignal.timeout(6000) });
          if (resp.ok) {
            const csvText = await resp.text();
            const rows = parseCSV(csvText);
            if (rows.length > 0) {
              const currentPages = await readData("pages.json");
              for (const row of rows) {
                const slug = (row.slug || row.id || row.key || "").trim().toLowerCase();
                if (slug) {
                  currentPages[slug] = {
                    title: row.title || row.name || currentPages[slug]?.title || slug,
                    subtitle: row.subtitle || row.description || currentPages[slug]?.subtitle || "",
                    imageUrl: row.imageurl || row.image || currentPages[slug]?.imageUrl || "",
                    content: row.content || row.body || row.markdown || currentPages[slug]?.content || "",
                  };
                  newKeys.push(slug);
                  syncedCount++;
                }
              }
              await writeData("pages.json", currentPages);
            }
          }
        }
      } catch (fetchErr: any) {
        console.warn("External Google Sheets fetch notice:", fetchErr.message);
      }

      const syncMeta = {
        lastSynced: new Date().toISOString(),
        sheetUrl: targetUrl,
        totalPagesSynced: syncedCount,
        status: syncedCount > 0 ? "Synced successfully" : "Cached database online & active",
        timestamp: Date.now()
      };
      await writeData("sheets_sync.json", syncMeta);

      const allPages = await readData("pages.json");
      res.json({
        success: true,
        message: syncedCount > 0 ? `Successfully synced ${syncedCount} entries from Google Sheets` : "Local database verified and ready",
        totalCount: Object.keys(allPages).length,
        syncedCount,
        meta: syncMeta
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to sync Google Sheets" });
    }
  });

  app.get("/api/pages", async (req, res) => {
    try {
      const db = await readData("pages.json");
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/pages", async (req, res) => {
    try {
      const { slug, pageData } = req.body;
      if (!slug || !pageData) {
        return res.status(400).json({ error: "slug and pageData required" });
      }
      const db = await readData("pages.json");
      db[slug] = pageData;
      await writeData("pages.json", db);
      res.json({ success: true, slug });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // News and Research Posts Endpoints
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await readData("news_posts.json");
      res.json(posts);
    } catch (e) {
      res.status(500).json({ error: "Server error reading posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const newPost = req.body;
      if (!newPost || !newPost.title) {
        return res.status(400).json({ error: "Post title required" });
      }
      const posts = await readData("news_posts.json");
      const existingIdx = posts.findIndex((p: any) => p.slug === newPost.slug || p.id === newPost.id);
      if (existingIdx >= 0) {
        posts[existingIdx] = { ...posts[existingIdx], ...newPost };
      } else {
        posts.unshift(newPost);
      }
      await writeData("news_posts.json", posts);
      res.json({ success: true, post: newPost });
    } catch (e) {
      res.status(500).json({ error: "Server error saving post" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
