import React from "react";
import { Users, UserPlus, FileText, Package, Heart, BarChart3, MapPin, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, StatCard, Button, Avatar, Badge } from "../../components/ui";
import { formatDate, getSeverityColor } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CASE_DATA = [
  { month: "Apr", cases: 28 }, { month: "May", cases: 45 }, { month: "Jun", cases: 52 },
  { month: "Jul", cases: 38 }, { month: "Aug", cases: 61 }, { month: "Sep", cases: 47 },
];

const STATUS_DATA = [
  { name: "Active", value: 48, color: "#3B82F6" },
  { name: "Referred", value: 22, color: "#8B5CF6" },
  { name: "Closed", value: 30, color: "#10B981" },
];

export default function NGODashboard() {
  const { beneficiaries, cases, inventory, healthCamps, referrals, users } = useApp();
  const navigate = useNavigate();

  const fieldWorkers = users.filter(u => u.role === "field_worker" && u.organization === "Seva Health NGO");
  const ngoCases = cases.filter(c => c.state === "Maharashtra");
  const lowStockItems = inventory.filter(i => i.status === "low_stock" || i.status === "out_of_stock");
  const upcomingCamps = healthCamps.filter(c => c.status === "upcoming").slice(0, 3);
  const openReferrals = referrals.filter(r => r.status === "pending" || r.status === "accepted").slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">NGO Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1"><MapPin size={13} className="text-blue-400" />Seva Health NGO · Maharashtra</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate("/ngo/health-camps")}>Health Camps</Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/ngo/analytics")}>View Analytics</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Active Beneficiaries" value="1,240" icon={<Users size={20} className="text-blue-600" />} iconBg="bg-blue-100" change="+12 this month" changeType="up" />
        <StatCard title="Field Workers" value={fieldWorkers.length} icon={<UserPlus size={20} className="text-teal-600" />} iconBg="bg-teal-100" subtitle="2 offline" />
        <StatCard title="Open Cases" value={ngoCases.filter(c => c.status === "open").length} icon={<FileText size={20} className="text-purple-600" />} iconBg="bg-purple-100" />
        <StatCard title="Medicine Items" value={inventory.length} icon={<Package size={20} className="text-amber-600" />} iconBg="bg-amber-100" change={`${lowStockItems.length} low stock`} changeType={lowStockItems.length > 0 ? "down" : "neutral"} />
        <StatCard title="Upcoming Camps" value={upcomingCamps.length} icon={<Heart size={20} className="text-red-500" />} iconBg="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cases Chart */}
        <Card className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Cases — Last 6 Months</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CASE_DATA} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="cases" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Case Status */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Case Status</h2>
          </div>
          <div className="p-5 flex flex-col items-center">
            <PieChart width={160} height={160}>
              <Pie data={STATUS_DATA} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="mt-3 space-y-2 w-full">
              {STATUS_DATA.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-slate-600">{s.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Open Referrals */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Open Referrals</h2>
            <Link to="/ngo/cases" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {openReferrals.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                <Avatar name={r.beneficiaryName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{r.beneficiaryName}</p>
                  <p className="text-[10px] text-slate-500">{r.toFacilityName}</p>
                </div>
                <span className={`badge-${r.priority === "high" ? "red" : r.priority === "moderate" ? "yellow" : "green"} text-[10px]`}>
                  {r.priority === "high" && <AlertTriangle size={9} />}
                  {r.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Camps */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Upcoming Health Camps</h2>
            <Link to="/ngo/health-camps" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingCamps.map(camp => (
              <div key={camp.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{camp.name}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={9} /> {camp.village}, {camp.district}
                    </p>
                    <p className="text-[10px] text-blue-600 mt-0.5">{formatDate(camp.date)} · {camp.startTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500">{camp.registeredBeneficiaries}/{camp.expectedBeneficiaries}</p>
                    <p className="text-[10px] text-slate-400">registered</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">Low Stock Alert — {lowStockItems.length} items need attention</p>
            </div>
            <Link to="/ngo/inventory" className="text-xs text-amber-700 hover:underline font-medium">View Inventory →</Link>
          </div>
        </Card>
      )}
    </div>
  );
}
