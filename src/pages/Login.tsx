import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowLeft, User, ShieldCheck, CheckCircle2, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Logo } from "../components/Logo";
import Seo from "../components/layout/Seo";
import { login as apiLogin } from "../services/api";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  syncUserProfile,
  recordLoginTelemetry,
  determineUserRole
} from "../firebase";

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // State for email registration on hold
  const [pendingApprovalAccount, setPendingApprovalAccount] = useState<any | null>(null);

  const navigate = useNavigate();

  // Save session to localStorage and navigate to dashboard
  const establishSession = async (userObj: any, token: string) => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("sc_token", token);
    localStorage.setItem("sc_token_expiry", expiry.toString());
    localStorage.setItem("sc_user", JSON.stringify(userObj));
    navigate("/dashboard");
  };

  // Google Firebase Sign In / Sign Up
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Determine exact role according to strict specification:
      // - AnkoreTech@gmail.com: Admin
      // - nxyxmz@gmail.com: Editor
      // - All others: Member (Minimally prepared user dashboard)
      const role = determineUserRole(user.email);
      const profile = await syncUserProfile(user, "google");

      const token = await user.getIdToken();
      const userSession = {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "WonderCave Member",
        email: user.email,
        photoURL: user.photoURL,
        role,
        status: "approved",
        approved: true,
        onboardingCompleted: profile?.onboardingCompleted || (role === "admin" || role === "editor"),
        provider: "google.com"
      };

      // Record login telemetry (IP, display size, timestamp)
      try {
        await recordLoginTelemetry(user, role);
      } catch (telErr) {
        console.warn("Telemetry notice:", telErr);
      }

      await establishSession(userSession, token);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please complete the Google account prompt.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups for this site.");
      } else {
        setError(err.message || "Failed to sign in with Google Firebase.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email & Password Auth (Firebase with backend fallback)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const role = determineUserRole(normalizedEmail);
      const isPrivileged = role === "admin" || role === "editor";

      if (mode === "signup") {
        // Firebase Signup
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const profile = await syncUserProfile(cred.user, "password");
        const token = await cred.user.getIdToken();

        const isApprovedImmediately = isPrivileged;
        const initialStatus = isApprovedImmediately ? "approved" : "pending_approval";

        const userSession = {
          id: cred.user.uid,
          name: name.trim() || email.split("@")[0],
          email: cred.user.email,
          role,
          status: initialStatus,
          approved: isApprovedImmediately,
          onboardingCompleted: isPrivileged,
          provider: "password"
        };

        // Record telemetry
        try {
          await recordLoginTelemetry(cred.user, role);
        } catch {
          // Continue
        }

        if (!isApprovedImmediately) {
          // User account held for admin approval per specification
          setPendingApprovalAccount({
            session: userSession,
            token
          });
        } else {
          await establishSession(userSession, token);
        }
      } else {
        // Firebase Sign In
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const profile = await syncUserProfile(cred.user, "password");
          const token = await cred.user.getIdToken();

          const isUserApproved = profile?.status === "approved" || isPrivileged || cred.user.email?.toLowerCase() === "ankoretech@gmail.com";

          const userSession = {
            id: cred.user.uid,
            name: profile?.displayName || cred.user.displayName || email.split("@")[0],
            email: cred.user.email,
            role,
            status: isUserApproved ? "approved" : (profile?.status || "pending_approval"),
            approved: isUserApproved,
            onboardingCompleted: profile?.onboardingCompleted || isPrivileged,
            provider: "password"
          };

          // Record telemetry
          try {
            await recordLoginTelemetry(cred.user, role);
          } catch {
            // Continue
          }

          await establishSession(userSession, token);
        } catch (firebaseErr: any) {
          // If Firebase account not found, fallback to local backend API
          try {
            const res = await apiLogin(email, password);
            const userRole = determineUserRole(res.user?.email);
            const userSession = {
              ...res.user,
              role: userRole
            };
            await establishSession(userSession, res.token);
          } catch (apiErr: any) {
            throw new Error(firebaseErr.message || apiErr.message || "Invalid login credentials.");
          }
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please switch to Sign In.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please verify and try again.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceedPendingAccount = async () => {
    if (pendingApprovalAccount) {
      await establishSession(pendingApprovalAccount.session, pendingApprovalAccount.token);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#E9ECEF] font-sans text-slate-900">
      <Seo 
        title={`${mode === "signin" ? "Sign In" : "Create Account"} — WonderCave`} 
        description="Access your WonderCave cybersecurity lab dashboard, diagnostics, and certification tracking." 
      />

      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col justify-center relative px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        {/* Back Button */}
        <div className="absolute top-8 left-4 sm:left-6 lg:left-12">
          <button
            onClick={() => window.history.length > 2 ? navigate(-1) : navigate("/")}
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} className="mr-2" />
            Back to WonderCave
          </button>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md mt-12 lg:mt-0 bg-white border border-slate-300 p-8 sm:p-10 rounded-none shadow-none">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Logo className="w-10 h-10 text-[#111A4D]" />
          </div>

          {/* Pending Approval Screen after Email Registration */}
          {pendingApprovalAccount ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto">
                <Clock size={24} />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-mono font-bold tracking-widest text-amber-700 uppercase block mb-1">
                  Security Hold In Effect
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Account Created & On Hold
                </h2>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  Per WonderCave security protocol, all accounts created by email are placed on hold for Administrator review.
                </p>
              </div>

              <div className="bg-[#E9ECEF] border border-slate-300 p-4 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Account:</span>
                  <span className="font-bold text-slate-900">{pendingApprovalAccount.session.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Role:</span>
                  <span className="font-bold text-slate-900 uppercase">{pendingApprovalAccount.session.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approval Lead:</span>
                  <span className="font-bold text-slate-900">AnkoreTech@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 font-bold uppercase text-[10px]">
                    Pending Approval
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-normal">
                You may now enter your minimally prepared dashboard to explore the curriculum and prepare research drafts while approval is pending.
              </p>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleProceedPendingAccount}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-none text-xs font-bold uppercase tracking-wider text-white bg-[#111A4D] hover:bg-slate-900 transition-colors"
                >
                  <span>Proceed to Researcher Workspace</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingApprovalAccount(null)}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 text-center"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center lg:text-left">
                <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A36] uppercase block mb-1">
                  Google Firebase Authentication
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {mode === "signin" ? "Sign in to WonderCave" : "Create Free Account"}
                </h2>
                <p className="text-slate-600 text-xs mt-1">
                  {mode === "signin" 
                    ? "Enter your credentials or use one-click Google login." 
                    : "Join the ethical hacking and cybersecurity community."}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex border-b border-slate-300 mb-6">
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(""); }}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-colors border-b-2 -mb-px ${
                    mode === "signin" 
                      ? "border-[#111A4D] text-[#111A4D]" 
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); }}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-colors border-b-2 -mb-px ${
                    mode === "signup" 
                      ? "border-[#111A4D] text-[#111A4D]" 
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Google Sign-in Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading || loading}
                  className="w-full flex justify-center items-center gap-3 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {googleLoading ? (
                    <div 
                      className="w-4 h-4 border-2 border-slate-800 border-t-transparent animate-spin rounded-full"
                      style={{ borderRadius: "100%" }}
                    ></div>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{mode === "signin" ? "Sign in with Google" : "Sign up with Google"}</span>
                </button>
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-300"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-400 uppercase">or email</span>
                  <div className="flex-grow border-t border-slate-300"></div>
                </div>
              </div>

              {/* Email / Password Form */}
              <form className="space-y-4" onSubmit={handleEmailAuth}>
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-none bg-white placeholder-slate-400 focus:outline-none focus:border-slate-800 text-xs transition-colors"
                        placeholder="Security Researcher Name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-none bg-white placeholder-slate-400 focus:outline-none focus:border-slate-800 text-xs transition-colors"
                      placeholder="e.g. researcher@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-none bg-white placeholder-slate-400 focus:outline-none focus:border-slate-800 text-xs transition-colors"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 rounded-none p-3 text-xs leading-relaxed">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-none text-xs font-bold uppercase tracking-wider text-white bg-[#111A4D] hover:bg-slate-900 focus:outline-none disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div 
                          className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"
                          style={{ borderRadius: "100%" }}
                        ></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{mode === "signin" ? "Sign in to Workspace" : "Register with Email"}</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Pane - Architectural Dark Brand Block */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between bg-[#111A4D] text-white px-16 py-12 relative">
        <div className="relative z-10 flex items-center gap-3">
          <Logo className="w-8 h-8 text-white rounded-none" />
          <span className="text-lg font-bold tracking-tight">WonderCave</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-16">
          <div className="text-xs font-mono font-bold text-[#FF5A36] uppercase tracking-widest mb-3">
            Enterprise Security Cloud & Training
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Security Intelligence for Modern Web Infrastructure.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
            Access commercial-grade solutions, automated vulnerability crawlers, and comprehensive hands-on labs hosted at wondercave.nayem.net.
          </p>
          <div className="flex flex-col gap-2 text-xs text-slate-300 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#FF5A36]" />
              <span>Role Enforcement: AnkoreTech@gmail.com (Admin) & nxyxmz@gmail.com (Editor)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Mandatory onboarding, captcha & session telemetry stored in DB & Sheet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
