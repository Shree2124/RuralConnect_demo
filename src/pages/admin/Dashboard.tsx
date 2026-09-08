import React, { useState } from "react";
import { Users, UserPlus, Building2, Stethoscope, Package, TrendingUp, Activity, Shield } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, StatCard, Button, Avatar, Badge, Tabs } from "../../components/ui";
import { formatDate, getRoleLabel, getRoleBadgeColor } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const USER_GROWTH = [
  { month: "Apr", beneficiaries: 180, workers: 8, doctors: 6 },
  { month: "May", beneficiaries: 320, workers: 10, doctors: 7 },
  { month: "Jun", beneficiaries: 490, workers: 12, doctors: 8 },
  { month: "Jul", beneficiaries: 680, workers: 14, doctors: 8 },
  { month: "Aug", beneficiaries: 900, workers: 16, doctors: 8 },
  { month: "Sep", beneficiaries: 1240, workers: 18, doctors: 8 },
];

const REFERRAL_DATA = [
  { name: "Pending", value: 5, fill: "#F59E0B" },
  { name: "Accepted", value: 4, fill: "#3B82F6" },
  { name: "Scheduled", value: 3, fill: "#8B5CF6" },
  { name: "Completed", value: 8, fill: "#10B981" },
];

const MEDICINE_TREND = [
  { month: "Apr", available: 85, lowStock: 8, outOfStock: 3 },
  { month: "May", available: 90, lowStock: 6, outOfStock: 2 },
  { month: "Jun", available: 82, lowStock: 10, outOfStock: 4 },
  { month: "Jul", available: 88, lowStock: 7, outOfStock: 3 },
  { month: "Aug", available: 75, lowStock: 12, outOfStock: 5 },
  { month: "Sep", available: 80, lowStock: 8, outOfStock: 4 },
];

export default function AdminDashboard() {
  const { users, beneficiaries, cases, referrals, inventory, healthCamps, ngos, auditLogs } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const fieldWorkers = users.filter(u => u.role === "field_worker");
  const doctors = users.filter(u => u.role === "doctor");
  const pharmacies = users.filter(u => u.role === "pharmacy");
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Platform Administration</h1>
          <p className="text-slate-500 text-sm mt-1">RuralConnect · System Overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate("/admin/users")}>Manage Users</Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/admin/analytics")}>Analytics</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Users" value={users.length} icon={<Users size={18} className="text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard title="Beneficiaries" value={beneficiaries.length} icon={<UserPlus size={18} className="text-emerald-600" />} iconBg="bg-emerald-100" change="+3 today" changeType="up" />
        <StatCard title="Field Workers" value={fieldWorkers.length} icon={<Activity size={18} className="text-teal-600" />} iconBg="bg-teal-100" />
        <StatCard title="Doctors" value={doctors.length} icon={<Stethoscope size={18} className="text-purple-600" />} iconBg="bg-purple-100" />
        <StatCard title="NGOs" value={ngos.length} icon={<Building2 size={18} className="text-amber-600" />} iconBg="bg-amber-100" />
        <StatCard title="Pharmacies" value={pharmacies.length} icon={<Package size={18} className="text-orange-600" />} iconBg="bg-orange-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Growth */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">User Growth — 6 Months</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={USER_GROWTH}>
                <defs>
                  <linearGradient id="colorBene" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="beneficiaries" stroke="#2563EB" fill="url(#colorBene)" strokeWidth={2} name="Beneficiaries" />
                <Line type="monotone" dataKey="workers" stroke="#10B981" strokeWidth={2} dot={false} name="Workers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Medicine Trend */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Medicine Stock Trend</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MEDICINE_TREND} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="available" fill="#10B981" radius={[3, 3, 0, 0]} name="Available" />
                <Bar dataKey="lowStock" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Low Stock" />
                <Bar dataKey="outOfStock" fill="#EF4444" radius={[3, 3, 0, 0]} name="Out of Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Links */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Administration</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "User Management", to: "/admin/users", icon: <Users size={16} />, color: "bg-blue-50 text-blue-700" },
              { label: "Roles & Permissions", to: "/admin/roles", icon: <Shield size={16} />, color: "bg-purple-50 text-purple-700" },
              { label: "Organizations", to: "/admin/organizations", icon: <Building2 size={16} />, color: "bg-emerald-50 text-emerald-700" },
              { label: "Audit Logs", to: "/admin/audit-logs", icon: <Activity size={16} />, color: "bg-amber-50 text-amber-700" },
              { label: "System Health", to: "/admin/system-health", icon: <TrendingUp size={16} />, color: "bg-teal-50 text-teal-700" },
              { label: "Accessibility Map", to: "/accessibility-map", icon: <Building2 size={16} />, color: "bg-orange-50 text-orange-700" },
            ].map(l => (
              <Link key={l.label} to={l.to} className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium border border-transparent hover:border-current transition-all ${l.color}`}>
                {l.icon}{l.label}
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Audit Logs */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent Audit Logs</h2>
            <Link to="/admin/audit-logs" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLogs.map(log => (
              <div key={log.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Avatar name={log.userName} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{log.action}</p>
                      <p className="text-[10px] text-slate-400">{log.userName} · {log.resource}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`badge-${log.status === "success" ? "green" : "red"} text-[10px]`}>{log.status}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
