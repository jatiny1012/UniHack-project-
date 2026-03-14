"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKinshipStore } from "@/lib/store";
import { saveAuthToOffline } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Lock, Mail, ArrowRight, UserPlus, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

type AuthMode = "choose" | "signup" | "signin";

export default function AuthLandingPage() {
  const router = useRouter();
  const { setToken, setCurrentUser, setCapabilities, setNeeds, setCluster } = useKinshipStore();

  const [mode, setMode] = useState<AuthMode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !name.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
          suburb: "Footscray",
          postcode: "3011",
          lat: -37.7996,
          lng: 144.8994,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Save to Zustand store
      setToken(data.token);
      setCurrentUser(data.profile);

      // Save to Dexie for offline persistence
      await saveAuthToOffline({
        user_id: data.user_id,
        token: data.token,
        email: email.trim().toLowerCase(),
        profile: data.profile,
        onboarding_complete: false,
      });

      // New user always goes to onboarding
      router.push("/onboard");
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Save to Zustand store
      setToken(data.token);
      setCurrentUser(data.profile);
      if (data.capabilities) setCapabilities(data.capabilities);
      if (data.needs) setNeeds(data.needs);
      if (data.cluster) setCluster(data.cluster);

      // Save to Dexie for offline persistence
      await saveAuthToOffline({
        user_id: data.user_id,
        token: data.token,
        email: email.trim().toLowerCase(),
        profile: data.profile,
        onboarding_complete: data.onboarding_complete || false,
      });

      // Route based on onboarding status
      if (data.onboarding_complete) {
        router.push("/dashboard");
      } else {
        router.push("/onboard");
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-warmWhite flex flex-col items-center justify-center px-4">
      {/* Branding */}
      <div className="text-center mb-8 animate-fade-slide-up">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight mb-3">
          Kinship
        </h1>
        <p className="text-lg text-textDark font-semibold">
          Find your people before you need them.
        </p>
        <p className="text-sm text-textMuted mt-1">
          AI-powered neighbourhood emergency resilience
        </p>
      </div>

      {/* Choose mode */}
      {mode === "choose" && (
        <div className="w-full max-w-sm space-y-3 animate-fade-slide-up">
          <Card
            className="p-5 cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-primary/20"
            onClick={() => setMode("signup")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="text-primary" size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-textDark">New User</h3>
                <p className="text-sm text-textMuted">Create an account &amp; join your neighbourhood</p>
              </div>
              <ArrowRight className="text-textMuted" size={18} />
            </div>
          </Card>

          <Card
            className="p-5 cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-primary/20"
            onClick={() => setMode("signin")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <LogIn className="text-success" size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-textDark">Existing User</h3>
                <p className="text-sm text-textMuted">Sign in to your Kinship account</p>
              </div>
              <ArrowRight className="text-textMuted" size={18} />
            </div>
          </Card>

          <p className="text-center text-xs text-textMuted flex items-center justify-center gap-1.5 pt-2">
            <Lock size={12} />
            Privacy by design — we never store your exact address
          </p>
        </div>
      )}

      {/* Sign Up Form */}
      {mode === "signup" && (
        <Card className="w-full max-w-sm p-6 animate-fade-slide-up">
          <h2 className="text-xl font-bold text-textDark mb-1">Create Account</h2>
          <p className="text-sm text-textMuted mb-5">Join your neighbourhood resilience network</p>

          {error && (
            <div className="flex items-start gap-2 bg-danger/10 text-danger rounded-lg px-3 py-2.5 mb-4 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name or nickname"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textDark"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSignUp}
              className="w-full mt-2"
              disabled={loading || !name.trim() || !email.trim() || password.length < 8}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </Button>
          </div>

          <button
            onClick={() => { setMode("choose"); setError(null); }}
            className="text-sm text-primary font-medium hover:underline mt-4 block mx-auto"
          >
            ← Back
          </button>
        </Card>
      )}

      {/* Sign In Form */}
      {mode === "signin" && (
        <Card className="w-full max-w-sm p-6 animate-fade-slide-up">
          <h2 className="text-xl font-bold text-textDark mb-1">Welcome Back</h2>
          <p className="text-sm text-textMuted mb-5">Sign in to your Kinship account</p>

          {error && (
            <div className="flex items-start gap-2 bg-danger/10 text-danger rounded-lg px-3 py-2.5 mb-4 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textDark"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full mt-2"
              disabled={loading || !email.trim() || !password}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </Button>
          </div>

          <button
            onClick={() => { setMode("choose"); setError(null); }}
            className="text-sm text-primary font-medium hover:underline mt-4 block mx-auto"
          >
            ← Back
          </button>
        </Card>
      )}
    </main>
  );
}
