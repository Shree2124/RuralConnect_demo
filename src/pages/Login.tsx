import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Heart, Eye, EyeOff, Globe, ChevronDown, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { DEMO_CREDENTIALS, ROLE_DASHBOARD_ROUTES } from "../lib/demo-credentials";
import { Button } from "../components/ui";
import { cn, getRoleLabel } from "../lib/utils";
import type { UserRole } from "../types";

const LANGUAGES = ["English", "हिन्दी", "मराठी", "ગુજરાતી", "ಕನ್ನಡ", "ଓଡ଼ିଆ"];

export default function LoginPage() {
  const { session, login, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [lang, setLang] = useState("English");
  const [showLang, setShowLang] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (session) return <Navigate to={ROLE_DASHBOARD_ROUTES[session.role]} replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.success && result.redirectTo) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate(result.redirectTo!), 500);
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    navigate(ROLE_DASHBOARD_ROUTES[role]);
  };

  const ROLE_COLORS: Record<UserRole, string> = {
    beneficiary: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    field_worker: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    ngo_admin: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    doctor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    pharmacy: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    admin: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{
              width: `${200 + i * 80}px`, height: `${200 + i * 80}px`,
              top: `${i * 15}%`, left: `${i * 10 - 20}%`, opacity: 0.5 - i * 0.08
            }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Heart className="text-white" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-xl">RuralConnect</p>
              <p className="text-blue-200 text-xs">Healthcare Platform</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Healthcare access,<br />even when connectivity isn't.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Connecting beneficiaries, field workers, NGOs, healthcare providers and medicine inventories across underserved communities.
          </p>
        </div>

        {/* Features */}
        <div className="relative grid grid-cols-2 gap-3">
          {[
            "Offline-First Healthcare",
            "Smart Care Routing",
            "Medicine Finder",
            "Accessibility Heatmaps",
            "Care Reminders",
            "Community Coordination",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <CheckCircle size={14} className="text-blue-200 flex-shrink-0" />
              <span className="text-sm text-blue-100 font-medium">{f}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <p className="text-blue-200 text-xs">
            Designed for rural and underserved communities across India.
          </p>
          <p className="text-blue-300/60 text-[10px] mt-1">
            Prototype using simulated healthcare data. Not intended for clinical diagnosis or real-world medical decision making.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center p-6 lg:p-12 bg-white/60 backdrop-blur-sm">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
          <p className="text-lg font-bold text-slate-800">RuralConnect</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
              >
                <Globe size={12} />
                {lang}
                <ChevronDown size={10} />
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-10 w-32">
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => { setLang(l); setShowLang(false); }} className={cn("w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 transition-colors", lang === l && "text-blue-600 font-medium")}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-500 text-sm">Sign in to your RuralConnect account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              <CheckCircle size={14} className="flex-shrink-0" />
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number / Email</label>
            <input
              type="text"
              id="login-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="demo.patient@ruralconnect.in"
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                id="login-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-3.5 h-3.5 accent-blue-600 rounded" />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <button type="button" className="text-sm text-blue-600 hover:underline">Forgot password?</button>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full justify-center py-2.5">
            Sign In
          </Button>
        </form>

        {/* Demo Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-500 font-medium">Quick Demo Login</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                onClick={() => handleQuickLogin(cred.role)}
                className={cn(
                  "text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all",
                  ROLE_COLORS[cred.role]
                )}
              >
                <p className="font-semibold">{cred.label}</p>
                <p className="opacity-70 text-[10px] mt-0.5">{cred.email}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-3">
            Password for all demo accounts: <strong>demo123</strong>
          </p>
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[10px] text-blue-600 text-center font-medium">
            🔒 Demo Environment — Not real credentials
          </p>
          <p className="text-[10px] text-slate-500 text-center mt-0.5">
            Prototype using simulated data. Not for clinical use.
          </p>
        </div>
      </div>
    </div>
  );
}
