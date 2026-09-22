import React from "react";
import { TrendingUp, Database, Activity, Server, RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, StatCard } from "../../components/ui";

export default function SystemHealth() {
  const { syncQueue } = useApp();
  const pendingSync = syncQueue.filter(q => q.status === "pending" || q.status === "syncing");
  const conflicts = syncQueue.filter(q => q.status === "conflict");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">System Health</h1>
        <p className="text-slate-500 text-sm mt-0.5">Real-time infrastructure and database monitoring</p>
      </div>

      <div className="stat-grid">
        <StatCard title="API Latency" value={metrics.latency} icon={<Activity size={20} className="text-blue-600" />} iconBg="bg-blue-100" change="Optimal" changeType="up" />
        <StatCard title="Database Latency" value="45ms" icon={<Database size={20} className="text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard title="Pending Sync" value={pendingSync.length} icon={<RefreshCw size={20} className="text-amber-600" />} iconBg="bg-amber-100" />
        <StatCard title="Sync Conflicts" value={conflicts.length} icon={<Server size={20} className="text-red-500" />} iconBg="bg-red-100" change={conflicts.length > 0 ? "Needs resolution" : "Healthy"} changeType={conflicts.length > 0 ? "down" : "neutral"} />
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Synchronization Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Record ID</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Offline Since</th>
              </tr>
            </thead>
            <tbody>
              {syncQueue.map(sync => (
                <tr key={sync.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{sync.id}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 capitalize">{sync.type}</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${sync.status === "synced" ? "green" : sync.status === "conflict" ? "red" : "yellow"} text-xs`}>
                      {sync.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{new Date(sync.createdOfflineAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {syncQueue.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-sm text-slate-400">Queue is empty</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
