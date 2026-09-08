import React, { useState } from "react";
import { RefreshCw, Wifi, WifiOff, CheckCircle, AlertTriangle, Clock, Database, ArrowRight, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Badge, Tabs, Progress } from "../../components/ui";
import { timeAgo, formatDateTime } from "../../lib/utils";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

type SyncStep = "idle" | "connecting" | "syncing" | "resolving" | "complete";

export default function OfflineSync() {
  const { syncQueue, offlineMode, setOfflineMode, simulateSync, pendingSyncCount, lastSyncTime, syncStatus } = useApp();
  const [activeTab, setActiveTab] = useState("pending");
  const [syncStep, setSyncStep] = useState<SyncStep>("idle");
  const [progress, setProgress] = useState(0);
  const [conflictAction, setConflictAction] = useState<Record<string, string>>({});

  const pending = syncQueue.filter(r => r.status === "pending");
  const synced = syncQueue.filter(r => r.status === "synced");
  const conflicts = syncQueue.filter(r => r.status === "conflict");

  const handleSync = async () => {
    if (offlineMode) {
      toast.error("Go online first to sync records.");
      return;
    }
    setSyncStep("connecting");
    setProgress(15);
    await new Promise(r => setTimeout(r, 700));
    setSyncStep("syncing");
    setProgress(50);
    await new Promise(r => setTimeout(r, 1000));
    setSyncStep("resolving");
    setProgress(80);
    await new Promise(r => setTimeout(r, 600));
    await simulateSync();
    setProgress(100);
    setSyncStep("complete");
    toast.success(`${pending.length} records synchronized successfully.`);
    setTimeout(() => { setSyncStep("idle"); setProgress(0); }, 3000);
  };

  const SYNC_STEPS_LABELS: Record<SyncStep, string> = {
    idle: "Ready to sync",
    connecting: "Connecting to server...",
    syncing: "Syncing records...",
    resolving: "Resolving conflicts...",
    complete: "Sync complete ✓",
  };

  const tabs = [
    { id: "pending", label: "Pending", count: pending.length },
    { id: "synced", label: "Synced", count: synced.length },
    { id: "conflicts", label: "Conflicts", count: conflicts.length },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Sync Center</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage offline records and synchronization</p>
      </div>

      {/* Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", offlineMode ? "bg-red-100" : "bg-emerald-100")}>
              {offlineMode ? <WifiOff size={22} className="text-red-600" /> : <Wifi size={22} className="text-emerald-600" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{offlineMode ? "Offline Mode Active" : "Online — Connected"}</p>
              {lastSyncTime && <p className="text-xs text-slate-500 mt-0.5">Last synchronized: {timeAgo(lastSyncTime)} ({formatDateTime(lastSyncTime)})</p>}
              {pendingSyncCount > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                  <Clock size={11} /> {pendingSyncCount} record{pendingSyncCount !== 1 ? "s" : ""} pending synchronization
                </p>
              )}

              {/* Progress */}
              {syncStep !== "idle" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-600">{SYNC_STEPS_LABELS[syncStep]}</span>
                    <span className="text-xs text-slate-400">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSync}
              disabled={offlineMode || syncStep !== "idle" || pending.length === 0}
              loading={syncStep !== "idle" && syncStep !== "complete"}
            >
              <RefreshCw size={13} />
              {syncStep === "complete" ? "Synced!" : "Sync Now"}
            </Button>
            <Button
              variant={offlineMode ? "secondary" : "outline"}
              size="sm"
              onClick={() => { setOfflineMode(!offlineMode); toast(offlineMode ? "Back online" : "Switched to offline mode"); }}
            >
              {offlineMode ? <Wifi size={13} /> : <WifiOff size={13} />}
              {offlineMode ? "Simulate Connection" : "Go Offline"}
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Sync Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Pending</span>
              <span className="text-sm font-bold text-slate-800">{pending.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Synced</span>
              <span className="text-sm font-bold text-slate-800">{synced.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />Conflicts</span>
              <span className="text-sm font-bold text-slate-800">{conflicts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1.5"><Database size={10} />Total Records</span>
              <span className="text-sm font-bold text-slate-800">{syncQueue.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="divide-y divide-slate-50">
          {activeTab === "pending" && (
            pending.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">All records synchronized</p>
              </div>
            ) : pending.map(r => (
              <div key={r.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 capitalize">{r.type} Record</p>
                  <p className="text-[10px] text-slate-500">Created offline at {formatDateTime(r.createdOfflineAt)}</p>
                </div>
                <span className="badge-yellow text-[10px]">Pending Sync</span>
              </div>
            ))
          )}

          {activeTab === "synced" && (
            synced.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-500">No synced records yet</p>
              </div>
            ) : synced.map(r => (
              <div key={r.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 capitalize">{r.type} Record</p>
                  <p className="text-[10px] text-slate-500">Synced successfully</p>
                </div>
                <span className="badge-green text-[10px]">Synced</span>
              </div>
            ))
          )}

          {activeTab === "conflicts" && (
            conflicts.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No conflicts detected</p>
              </div>
            ) : conflicts.map(r => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={14} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700">Beneficiary record updated on two devices.</p>
                    <p className="text-[10px] text-slate-500">Conflict detected — please choose which version to keep.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-[10px] font-semibold text-blue-700 mb-1">LOCAL VERSION</p>
                    <p className="text-xs text-slate-600">{JSON.stringify(r.data).substring(0, 80)}...</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-[10px] font-semibold text-slate-500 mb-1">SERVER VERSION</p>
                    <p className="text-xs text-slate-600">{JSON.stringify(r.conflictData || r.data).substring(0, 80)}...</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 ml-12">
                  <Button size="sm" variant="primary" onClick={() => { setConflictAction(prev => ({ ...prev, [r.id]: "local" })); toast.success("Kept local version"); }}>
                    Keep Local
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { setConflictAction(prev => ({ ...prev, [r.id]: "server" })); toast.success("Kept server version"); }}>
                    Keep Server
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast("Review mode not available in prototype")}>
                    Review Changes
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
