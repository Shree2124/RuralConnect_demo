import React from "react";
import { Heart, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button } from "../../components/ui";
import { formatDate } from "../../lib/utils";

export default function HealthCamps() {
  const { healthCamps } = useApp();
  // Filter for camps of this NGO
  const myCamps = healthCamps.filter(c => c.ngoId === "ngo1");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Health Camps</h1>
          <p className="text-slate-500 text-sm mt-0.5">Plan and manage community health outreach programs.</p>
        </div>
        <Button variant="primary" size="sm">Schedule Camp</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Camp Details</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Date & Time</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Registrations</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCamps.map(c => (
                <tr key={c.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800 text-sm">{c.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.services.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="badge-blue text-[9px]">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {c.village}, {c.district}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-slate-700 font-medium">{formatDate(c.date)}</p>
                    <p className="text-xs text-slate-500">{c.startTime} - {c.endTime}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (c.registeredBeneficiaries || 0) / c.expectedBeneficiaries * 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{c.registeredBeneficiaries}/{c.expectedBeneficiaries}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge-${c.status === "completed" ? "green" : c.status === "upcoming" ? "blue" : "red"} text-xs uppercase`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {myCamps.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-slate-400">No health camps found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
