import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Wifi, Package, Map, Bell, Users, ArrowRight,
  ChevronRight, Activity, Globe, Shield, Zap, Clock
} from "lucide-react";
import { DEMO_CREDENTIALS, ROLE_DASHBOARD_ROUTES } from "../lib/demo-credentials";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";
import type { UserRole } from "../types";

const FEATURES = [
  { icon: <Wifi size={20} />, title: "Offline-First", desc: "Field workers capture data without connectivity. Auto-syncs when online.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: <Heart size={20} />, title: "Smart Care Routing", desc: "Non-diagnostic urgency assessment routes patients to appropriate services.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: <Package size={20} />, title: "Medicine Finder", desc: "Real-time medicine availability from pharmacies, NGOs, and relief stock.", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: <Map size={20} />, title: "Accessibility Heatmaps", desc: "Visualize healthcare gaps and underserved zones across India.", color: "text-orange-600", bg: "bg-orange-50" },
  { icon: <Bell size={20} />, title: "Care Reminders", desc: "SMS, USSD, IVR and in-app reminders for medications, vaccinations, follow-ups.", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: <Users size={20} />, title: "Community Coordination", desc: "NGOs, field workers and providers collaborate on shared patient records.", color: "text-teal-600", bg: "bg-teal-50" },
];

const STATS = [
  { value: "12+", label: "States Covered" },
  { value: "3,000+", label: "Beneficiaries" },
  { value: "180+", label: "Health Facilities" },
  { value: "45+", label: "NGO Partners" },
];

export default function LandingPage() {
  const { session, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleExplore = () => {
    if (session) navigate(ROLE_DASHBOARD_ROUTES[session.role]);
    else navigate("/login");
  };

  const handleRoleLogin = (role: UserRole) => {
    loginAsRole(role);
    navigate(ROLE_DASHBOARD_ROUTES[role]);
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-blue-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">RuralConnect</p>
              <p className="text-[10px] text-blue-600">Healthcare Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/architecture" className="text-sm text-slate-500 hover:text-slate-700 hidden sm:block">Architecture</Link>
            <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
            <Button variant="primary" size="sm" onClick={handleExplore}>Explore Demo</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} />
              Hackathon Prototype Demo — Simulated Data Only
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Healthcare access,<br />
              <span className="hero-gradient bg-clip-text text-transparent">even when connectivity</span><br />
              isn't.
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              RuralConnect connects beneficiaries, field workers, NGOs, healthcare providers and medicine inventories across underserved communities in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" onClick={handleExplore} className="group">
                Explore Demo
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/login")}>
                Demo Login
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              No registration required · All data is simulated
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {STATS.map((s) => (
              <div key={s.label} className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white shadow-sm">
                <p className="text-2xl font-extrabold text-blue-600">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* India Map Illustration */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 mb-16 overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white/30" style={{
                  width: `${100 + i * 60}px`, height: `${100 + i * 60}px`,
                  top: `${i * 12}%`, right: `${i * 8}%`
                }} />
              ))}
            </div>
            <div className="relative">
              <Globe size={48} className="text-blue-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Designed for Rural India</h2>
              <p className="text-blue-200 text-sm max-w-lg mx-auto">
                Serving underserved communities across Maharashtra, Gujarat, Rajasthan, Karnataka, Odisha, Haryana, Himachal Pradesh, Punjab, Madhya Pradesh and Uttar Pradesh.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {["Palghar", "Nandurbar", "Gadchiroli", "Barmer", "Jaisalmer", "Banaskantha", "Kutch", "Kalahandi", "Koraput", "Shravasti"].map(d => (
                  <span key={d} className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Platform Capabilities</h2>
              <p className="text-slate-500">Built for the last mile. Works offline. Saves lives.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-xl border border-blue-50 p-5 hover:shadow-card-hover transition-all duration-200 group">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4 ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Role Demo Cards */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Six Role Experiences</h2>
              <p className="text-slate-500">Click any role to instantly explore its dashboard</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => handleRoleLogin(cred.role)}
                  className="text-left p-4 bg-white rounded-xl border border-blue-50 hover:shadow-card-hover hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{cred.label}</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-[10px] text-slate-500">{cred.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Flow */}
          <div className="bg-white rounded-2xl border border-blue-50 p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Hackathon Demo Flow</h2>
            <p className="text-slate-500 text-sm mb-6">19-step integrated workflow demonstrating the full platform</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "1. Login as Field Worker",
                "2. Register a new Beneficiary",
                "3. Switch to Offline Mode",
                "4. Create a healthcare Case",
                "5. Record saved locally (pending sync)",
                "6. Search for medicine availability",
                "7. View medicine from NGO, Pharmacy & Relief",
                "8. Create a Referral",
                "9. Switch back Online",
                "10. Click Sync Now — watch animation",
                "11. Login as Doctor",
                "12. Doctor sees the new referral",
                "13. Doctor reviews the full case",
                "14. Doctor schedules a follow-up",
                "15. Login as Beneficiary",
                "16. View follow-up, reminders, referral status",
                "17. Login as Admin",
                "18. View updated analytics and audit log",
                "19. Open Healthcare Accessibility Map",
              ].map((step) => (
                <div key={step} className="flex items-start gap-2.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                  <span className="text-slate-600">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-50 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Heart size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">RuralConnect</span>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Prototype using simulated healthcare data. Not intended for clinical diagnosis or real-world medical decision making.
          </p>
          <div className="flex gap-4">
            <Link to="/architecture" className="text-xs text-slate-500 hover:text-slate-700">Architecture</Link>
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-700">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
