import React from "react";
import { Heart, Zap, Database, Globe, Shield, Layers, Activity } from "lucide-react";
import { Card } from "../components/ui";
import { Link } from "react-router-dom";

const ARCHITECTURE_BLOCKS = [
  {
    layer: "Frontend Layer",
    color: "bg-blue-50 border-blue-200",
    header: "bg-blue-100 text-blue-800",
    items: [
      "Vite + React 18 + TypeScript",
      "React Router v6 (client-side routing)",
      "React Context API (state management)",
      "Recharts (analytics + charts)",
      "React Leaflet + OpenStreetMap (maps)",
      "Lucide React (icons)",
      "Tailwind CSS (styling)",
    ],
  },
  {
    layer: "State & Persistence",
    color: "bg-purple-50 border-purple-200",
    header: "bg-purple-100 text-purple-800",
    items: [
      "React Context API (global state)",
      "localStorage (session + app state)",
      "Offline queue (pending sync records)",
      "Mock data (static JSON-like objects)",
      "No real backend / database",
    ],
  },
  {
    layer: "Key Features (Simulated)",
    color: "bg-emerald-50 border-emerald-200",
    header: "bg-emerald-100 text-emerald-800",
    items: [
      "Offline-First mode (toggle + sync simulation)",
      "Care Assistant (non-diagnostic routing)",
      "Medicine Finder (availability search)",
      "Accessibility Map (Leaflet markers + zones)",
      "Referral workflow (multi-role)",
      "Health camp management",
      "Analytics dashboard (mock data)",
      "Role-based access control",
    ],
  },
  {
    layer: "Role-Based Access",
    color: "bg-amber-50 border-amber-200",
    header: "bg-amber-100 text-amber-800",
    items: [
      "Beneficiary / Patient",
      "Field Worker / CHW",
      "NGO Administrator",
      "Doctor / Healthcare Provider",
      "Pharmacy / Medicine Inventory",
      "Platform Administrator",
    ],
  },
];

export default function Architecture() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">RuralConnect Architecture</h1>
        </div>
        <p className="text-slate-500 text-sm">Technical overview of the platform prototype</p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm font-semibold text-amber-800">⚠️ Prototype Demo Only</p>
        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
          RuralConnect is a <strong>frontend-only prototype</strong> using simulated data. There is no real backend, authentication system, 
          medical database, or healthcare data integration. All displayed data is mock/demo data for demonstration purposes only.
          <br /><br />
          This is NOT intended for real-world clinical use. No real patient data is stored or transmitted.
        </p>
      </div>

      {/* Architecture Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARCHITECTURE_BLOCKS.map(block => (
          <Card key={block.layer} className={`border ${block.color} overflow-hidden`}>
            <div className={`px-4 py-3 ${block.header}`}>
              <p className="text-xs font-bold uppercase tracking-wide">{block.layer}</p>
            </div>
            <div className="px-4 py-3">
              <ul className="space-y-1.5">
                {block.items.map(item => (
                  <li key={item} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Data Flow */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Layers size={15} />Demo Data Flow</h2>
        <div className="space-y-3">
          {[
            { from: "Login Page", to: "AuthContext", desc: "Session stored in localStorage" },
            { from: "Field Worker", to: "AppContext", desc: "CRUD operations on mock beneficiaries, cases, referrals" },
            { from: "Offline Mode", to: "syncQueue", desc: "Pending records stored locally, simulated sync animation" },
            { from: "Doctor Dashboard", to: "referrals / appointments", desc: "Accept, schedule, create follow-ups via context actions" },
            { from: "Pharmacy", to: "inventory", desc: "Update stock, add medicines, expiry tracking" },
            { from: "Medicine Finder", to: "medicines (read-only)", desc: "Filter and search simulated medicine availability" },
            { from: "Accessibility Map", to: "facilities", desc: "React Leaflet markers with OpenStreetMap tiles" },
          ].map(flow => (
            <div key={flow.from} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="badge-blue text-[10px]">{flow.from}</span>
                <span className="text-slate-400">→</span>
                <span className="badge-purple text-[10px]">{flow.to}</span>
              </div>
              <p className="text-xs text-slate-500">{flow.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Hackathon Demo Flow */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Zap size={15} />19-Step Hackathon Demo Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Login as Field Worker (Priya Sharma)",
            "Register a new Beneficiary",
            "Switch to Offline Mode",
            "Create a healthcare Case",
            "Record saved locally (pending sync badge appears)",
            "Search for medicine availability (Medicine Finder)",
            "View medicine from NGO, Pharmacy & Relief stock",
            "Create a Referral to PHC Palghar",
            "Switch back Online",
            "Click Sync Now — watch sync animation progress",
            "Login as Doctor (Dr. Vikram Singh)",
            "Doctor sees the new referral in Pending queue",
            "Doctor opens Case Overview modal",
            "Doctor schedules a Follow-up appointment",
            "Beneficiary notified in-app",
            "Login as Beneficiary (Meena Patil)",
            "View follow-up in appointments, reminders, referral status",
            "Login as Platform Admin",
            "View updated analytics + audit log + Accessibility Map",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <span className="badge-blue text-[10px] flex-shrink-0">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-3">
        <Link to="/login" className="flex-1">
          <div className="p-4 bg-blue-600 rounded-xl text-center text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Start Demo →
          </div>
        </Link>
        <Link to="/" className="flex-1">
          <div className="p-4 bg-white border border-blue-200 rounded-xl text-center text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors">
            ← Back to Landing
          </div>
        </Link>
      </div>
    </div>
  );
}
