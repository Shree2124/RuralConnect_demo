import React from "react";
import { Activity } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Avatar } from "../../components/ui";

export default function AuditLogs() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">System Audit Logs</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track system usage, events, and administrative actions.</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Resource</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Details</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={log.userName} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{log.userName}</p>
                        <p className="text-xs text-slate-500 capitalize">{log.userRole.replace("_", " ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 font-medium">{log.action}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{log.resource}</td>
                  <td className="px-5 py-3 text-xs text-slate-500 max-w-xs truncate" title={log.details}>{log.details}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{new Date(log.timestamp).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${log.status === "success" ? "green" : "red"} text-xs`}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
