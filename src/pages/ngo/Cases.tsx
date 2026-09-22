import React from "react";
import { FileText, Eye, Edit } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Avatar } from "../../components/ui";
import { formatDate } from "../../lib/utils";

export default function NGOCases() {
  const { cases } = useApp();
  // Filter for cases in Maharashtra (simulate NGO area filter)
  const myCases = cases.filter(c => c.state === "Maharashtra");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Health Cases</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage and monitor health cases in your jurisdiction.</p>
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Case / Patient</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Created</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Severity</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCases.map(c => (
                <tr key={c.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.beneficiaryName} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{c.beneficiaryName}</p>
                        <p className="text-xs text-slate-500">ID: {c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{c.village}, {c.district}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${c.severity === "high" ? "red" : c.severity === "moderate" ? "yellow" : "green"} text-xs uppercase`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge-${c.status === "open" ? "blue" : c.status === "referred" ? "purple" : "green"} text-xs uppercase`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Eye size={14} /></Button>
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {myCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-slate-400">No cases found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
