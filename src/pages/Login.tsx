import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, Heart, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { DEMO_CREDENTIALS, ROLE_DASHBOARD_ROUTES } from "../lib/demo-credentials";
import { Button } from "../components/ui";
import { cn } from "../lib/utils";
import type { UserRole } from "../types";

export default function LoginPage() {
  const { session, login, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
    beneficiary: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    field_worker: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
    ngo_admin: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100",
    doctor: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
    pharmacy: "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100",
    admin: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header aligned with Gov standards */}
      <header className="bg-white border-b border-slate-200 shadow-sm py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-700 rounded flex items-center justify-center shadow-inner">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">RuralConnect Platform</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider">Ministry of Health & Family Welfare</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <Shield size={24} className="text-slate-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Secure Portal</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-blue-700 p-5 text-center">
            <h2 className="text-xl font-bold text-white">Sign In to Dashboard</h2>
            <p className="text-blue-100 text-sm mt-1">Authorized Personnel Only</p>
          </div>
          
          <div className="p-6 md:p-8">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700">
                  <CheckCircle size={16} className="flex-shrink-0" />
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="login-email">Registered ID / Email</label>
                <input
                  type="text"
                  id="login-email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your ID or email"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="login-password">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    id="login-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 pr-10 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" loading={loading} className="w-full justify-center bg-blue-700 hover:bg-blue-800 rounded">
                  Secure Login
                </Button>
              </div>
            </form>

            {/* Demo Login Options */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest bg-slate-50 px-2">Prototype Access</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {DEMO_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.role}
                    onClick={() => handleQuickLogin(cred.role)}
                    className={cn(
                      "text-left px-3 py-2 rounded border text-xs transition-colors",
                      ROLE_COLORS[cred.role]
                    )}
                  >
                    <p className="font-semibold text-slate-800">{cred.label}</p>
                    <p className="opacity-80 text-[10px] mt-0.5">{cred.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-6 text-center max-w-md">
          This system is a prototype. Unauthorized access or misuse of system data is strictly prohibited and subject to administrative action.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-6 px-6 md:px-12 text-xs border-t-4 border-blue-600">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-white mb-1">RuralConnect Portal</p>
            <p>Designed and developed for improving rural healthcare accessibility.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white underline">Terms of Use</a>
            <a href="#" className="hover:text-white underline">Privacy Policy</a>
            <a href="#" className="hover:text-white underline">Help Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
