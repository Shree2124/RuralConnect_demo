import React, { useState } from "react";
import { Users, ClipboardList, RefreshCw, MapPin, Activity, UserPlus, AlertTriangle, Wifi, WifiOff, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Card, StatCard, Button, Badge, Avatar } from "../../components/ui";
import { formatDate, timeAgo, getSeverityColor } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function FieldWorkerDashboard() {
  const { session } = useAuth();
  const { beneficiaries, cases, referrals, syncQueue, offlineMode, setOfflineMode, simulateSync, pendingSyncCount, lastSyncTime, syncStatus } = useApp();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const myBeneficiaries = beneficiaries.filter(b => b.assignedWorker === "u2");
  const myCases = cases.filter(c => c.createdBy === "u2");
  const pendingCases = myCases.filter(c => c.status === "open");
  const highPriority = myCases.filter(c => c.severity === "high");
  const pendingSync = syncQueue.filter(r => r.status === "pending");

  const handleSync = async () => {
    if (offlineMode) {
      toast.error("Cannot sync while offline. Please go online first.");
      return;
    }
    setSyncing(true);
    await simulateSync();
    setSyncing(false);
    toast.success(`${pendingSyncCount > 0 ? pendingSyncCount : "All"} records synchronized successfully.`);
  };

  const recentBeneficiaries = myBeneficiaries.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Field Worker Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{session?.name} · Seva Health NGO, Palghar</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate("/field-worker/beneficiaries")}>
          <UserPlus size={14} />
          Register Beneficiary
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard title="My Families" value={myBeneficiaries.length} icon={<Users size={20} className="text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard title="Offline Drafts" value={offlineDrafts} icon={<WifiOff size={20} className="text-amber-600" />} iconBg="bg-amber-100" />
        <StatCard title="Pending Sync" value={pendingSyncCount} icon={<RefreshCw size={20} className="text-purple-600" />} iconBg="bg-purple-100" change={pendingSyncCount > 0 ? "Needs sync" : "All synced"} changeType={pendingSyncCount > 0 ? "down" : "up"} />
        <StatCard title="Today's Visits" value={Math.min(myBeneficiaries.length, Math.floor(Math.random() * 5) + 1)} icon={<MapPin size={20} className="text-teal-600" />} iconBg="bg-teal-100" />
        <StatCard title="High Priority" value={highPriority.length} icon={<AlertTriangle size={20} className="text-red-500" />} iconBg="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Offline Sync Widget */}
        <div className="lg:col-span-1">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              {offlineMode ? <WifiOff size={18} className="text-red-500" /> : <Wifi size={18} className="text-emerald-500" />}
              <h2 className="text-sm font-semibold text-slate-700">
                {offlineMode ? "OFFLINE MODE" : "ONLINE"}
              </h2>
              {offlineMode && <span className="badge-red text-[10px]">Local mode</span>}
            </div>

            {offlineMode ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-xs font-semibold text-red-800">Working Offline</p>
                <p className="text-[10px] text-red-600 mt-0.5">
                  {pendingSyncCount} record{pendingSyncCount !== 1 ? "s" : ""} stored locally.
                  {lastSyncTime && ` Last sync: ${timeAgo(lastSyncTime)}`}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg mb-4">
                <p className="text-xs font-semibold text-emerald-800">Connected</p>
                {lastSyncTime && <p className="text-[10px] text-emerald-600 mt-0.5">Last synced: {timeAgo(lastSyncTime)}</p>}
              </div>
            )}

            {pendingSyncCount > 0 && (
              <div className="mb-4 space-y-1.5">
                {pendingSync.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-2 text-xs text-slate-600 p-2 bg-slate-50 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="capitalize">{r.type}</span>
                    <span className="text-slate-400 ml-auto">{timeAgo(r.createdOfflineAt)}</span>
                  </div>
                ))}
                {pendingSync.length > 3 && (
                  <p className="text-[10px] text-slate-400 text-center">+{pendingSync.length - 3} more pending</p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!offlineMode && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={handleSync}
                  loading={syncStatus === "syncing"}
                  disabled={pendingSyncCount === 0}
                >
                  <RefreshCw size={13} />
                  {syncStatus === "syncing" ? "Syncing..." : `Sync Now ${pendingSyncCount > 0 ? `(${pendingSyncCount})` : ""}`}
                </Button>
              )}
              <Button
                variant={offlineMode ? "secondary" : "outline"}
                size="sm"
                className="w-full justify-center"
                onClick={() => { setOfflineMode(!offlineMode); toast(offlineMode ? "✅ Back online" : "📶 Switched to offline mode"); }}
              >
                {offlineMode ? <Wifi size={13} /> : <WifiOff size={13} />}
                {offlineMode ? "Go Online" : "Simulate Offline"}
              </Button>
              <Link to="/field-worker/offline-sync" className="text-xs text-blue-600 hover:underline text-center">
                Open Sync Center →
              </Link>
            </div>
          </Card>
        </div>

        {/* Assigned Cases Table */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Recent Cases</h2>
              <Link to="/field-worker/beneficiaries" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="rc-table">
                <thead>
                  <tr>
                    <th>Beneficiary</th>
                    <th>Village</th>
                    <th>Severity</th>
                    <th>Last Visit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myCases.slice(0, 6).map(c => (
                    <tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/field-worker/beneficiaries`)}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={c.beneficiaryName} size="sm" />
                          <span className="font-medium text-slate-700">{c.beneficiaryName}</span>
                        </div>
                      </td>
                      <td className="text-slate-500">{c.village}</td>
                      <td>
                        <span className={`badge-${c.severity === "high" ? "red" : c.severity === "moderate" ? "yellow" : "green"} text-[10px]`}>
                          {c.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-slate-500 text-xs">{formatDate(c.updatedAt)}</td>
                      <td>
                        <span className={`badge-${c.status === "open" ? "blue" : c.status === "referred" ? "purple" : c.status === "pending_sync" ? "yellow" : "green"} text-[10px]`}>
                          {c.isOffline ? "Offline — Pending sync" : c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Register Beneficiary", to: "/field-worker/beneficiaries", icon: <UserPlus size={18} />, color: "bg-blue-600 text-white" },
          { label: "New Case", to: "/field-worker/new-case", icon: <ClipboardList size={18} />, color: "bg-purple-600 text-white" },
          { label: "Create Referral", to: "/field-worker/referrals", icon: <Activity size={18} />, color: "bg-emerald-600 text-white" },
          { label: "Find Medicine", to: "/medicine-finder", icon: <MapPin size={18} />, color: "bg-amber-600 text-white" },
        ].map(a => (
          <Link key={a.label} to={a.to} className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium transition-all hover:opacity-90 ${a.color}`}>
            {a.icon}
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
