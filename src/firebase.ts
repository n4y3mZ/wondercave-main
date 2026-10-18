import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Strict Role Determination based on explicit system rules:
// - AnkoreTech@gmail.com: Administrator (Full Admin Console)
// - nxyxmz@gmail.com: Editor (Content & Review permissions)
// - All others: Member (Minimally prepared User Dashboard)
export function determineUserRole(email: string | null | undefined): "admin" | "editor" | "member" {
  if (!email) return "member";
  const normalized = email.trim().toLowerCase();
  if (normalized === "ankoretech@gmail.com") return "admin";
  if (normalized === "nxyxmz@gmail.com") return "editor";
  return "member";
}

// Telemetry recording interface as requested
export interface TelemetryData {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  ip: string;
  timestamp: string;
  formattedDate: string;
  screenResolution: string;
  viewportSize: string;
  devicePixelRatio: number;
  colorDepth: string;
  userAgent: string;
}

// Record login telemetry into Firestore and backend sync
export async function recordLoginTelemetry(user: FirebaseUser, role: string) {
  try {
    let clientIp = "127.0.0.1";
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
      if (ipRes.ok) {
        const ipJson = await ipRes.json();
        clientIp = ipJson.ip || clientIp;
      }
    } catch {
      // Fallback
    }

    const now = new Date();
    const telemetryId = `telemetry_${user.uid}_${Date.now()}`;
    const telemetryPayload: TelemetryData = {
      userId: user.uid,
      userEmail: user.email || "unknown@wondercave.net",
      userName: user.displayName || user.email?.split("@")[0] || "User",
      role,
      ip: clientIp,
      timestamp: now.toISOString(),
      formattedDate: now.toUTCString(),
      screenResolution: `${typeof window !== "undefined" ? window.screen.width : 0}x${typeof window !== "undefined" ? window.screen.height : 0}`,
      viewportSize: `${typeof window !== "undefined" ? window.innerWidth : 0}x${typeof window !== "undefined" ? window.innerHeight : 0}`,
      devicePixelRatio: typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1,
      colorDepth: `${typeof window !== "undefined" ? window.screen.colorDepth : 24}-bit`,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Node/Web"
    };

    // 1. Save to Firestore
    try {
      const telDocRef = doc(db, "telemetry", telemetryId);
      await setDoc(telDocRef, telemetryPayload);
    } catch (fsErr) {
      console.warn("Firestore telemetry notice:", fsErr);
    }

    // 2. Sync to local backend API / sheets sync
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetryPayload)
      });
    } catch {
      // Safe fallback
    }

    return telemetryPayload;
  } catch (err) {
    console.error("Failed to record login telemetry:", err);
    return null;
  }
}

// Sync user to Firestore upon Google / Email authentication
export async function syncUserProfile(user: FirebaseUser, providerType: "google" | "password" = "google") {
  try {
    const userRef = doc(db, "users", user.uid);
    const existing = await getDoc(userRef);
    const calculatedRole = determineUserRole(user.email);
    
    // For email signup, non-admin/editor accounts are held for approval
    const isSpecialAccount = calculatedRole === "admin" || calculatedRole === "editor";
    const initialStatus = providerType === "google" || isSpecialAccount ? "approved" : "pending_approval";

    if (!existing.exists()) {
      const newProfile = {
        id: user.uid,
        email: user.email || "",
        displayName: user.displayName || user.email?.split("@")[0] || "WonderCave Member",
        photoURL: user.photoURL || "",
        role: calculatedRole,
        status: initialStatus,
        approved: initialStatus === "approved",
        onboardingCompleted: isSpecialAccount, // Admin and editor bypass onboarding form
        organization: isSpecialAccount ? "WonderCave Security Labs" : "",
        jobTitle: calculatedRole === "admin" ? "Lead Security Architect" : calculatedRole === "editor" ? "Security Editor" : "",
        interestArea: "Web AppSec",
        country: "Global",
        bio: "",
        contactHandle: "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const data = existing.data();
      // Ensure role stays strictly enforced according to user specification
      if (data.role !== calculatedRole && isSpecialAccount) {
        await updateDoc(userRef, { role: calculatedRole, status: "approved", approved: true });
        data.role = calculatedRole;
        data.status = "approved";
      }
      return data;
    }
  } catch (err) {
    console.error("Failed to sync user profile to Firestore:", err);
    return null;
  }
}

// Save user onboarding form data
export async function completeUserOnboarding(userId: string, formData: any) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...formData,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error("Failed to save onboarding data:", err);
    return false;
  }
}

// Community Post Submissions (User drafts submitted for admin review)
export async function submitPostForReview(postData: {
  authorId: string;
  authorEmail: string;
  authorName: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string;
  content: string;
  heroImage?: string;
}) {
  const submissionId = `submission_${Date.now()}`;
  const payload = {
    ...postData,
    id: submissionId,
    status: "pending_review",
    submittedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, "post_submissions", submissionId);
    await setDoc(docRef, payload);
  } catch (err) {
    console.warn("Firestore post submission error, using backend:", err);
  }

  // Also sync to backend API
  try {
    await fetch("/api/post-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    // Local fallback
  }

  return payload;
}

// Request deletion of a submitted or published post
export async function requestPostDeletion(submissionId: string, reason: string, userEmail: string) {
  const updatePayload = {
    status: "deletion_requested",
    deletionReason: reason,
    deletionRequestedBy: userEmail,
    deletionRequestedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, "post_submissions", submissionId);
    await updateDoc(docRef, updatePayload);
  } catch (err) {
    console.warn("Firestore deletion request warning:", err);
  }

  try {
    await fetch(`/api/post-submissions/${submissionId}/request-deletion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, authorEmail: userEmail })
    });
  } catch {
    // Fallback
  }

  return updatePayload;
}

// Request edit / revision of an existing post
export async function requestPostEdit(submissionId: string, updatedPostData: any) {
  const editPayload = {
    ...updatedPostData,
    status: "edit_requested",
    editRequestedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, "post_submissions", submissionId);
    await updateDoc(docRef, editPayload);
  } catch (err) {
    console.warn("Firestore edit request warning:", err);
  }

  try {
    await fetch(`/api/post-submissions/${submissionId}/request-edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPostData)
    });
  } catch {
    // Fallback
  }

  return editPayload;
}

// Connection Validation as required by Firebase integration
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Client offline or firestore configuration pending.");
    }
  }
}
testConnection();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};

