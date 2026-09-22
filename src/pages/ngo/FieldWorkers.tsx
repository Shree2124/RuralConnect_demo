import React from "react";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Avatar } from "../../components/ui";

export default function FieldWorkers() {
  const { users } = useApp();
  // Filter for field workers of this NGO
  const myWorkers = users.filter(u => u.role === "field_worker" && u.organization === "Seva Health NGO");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Field Workers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage the field workforce assigned to your NGO.</p>
        </div>
        <Button variant="primary" size="sm">Add Worker</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Worker</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Contact</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Assigned Area</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myWorkers.map(w => (
                <tr key={w.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={w.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{w.name}</p>
                        <p className="text-xs text-slate-500">{w.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{w.mobile}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-slate-700 font-medium">{w.assignedDistrict}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {w.assignedVillages?.slice(0, 3).map((v, idx) => (
                        <span key={idx} className="badge-gray text-[9px]">{v}</span>
                      ))}
                      {(w.assignedVillages?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-400">+{w.assignedVillages!.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge-${w.deviceStatus === "online" ? "green" : "gray"} text-xs`}>{w.deviceStatus === "online" ? "Online" : "Offline"}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {myWorkers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-slate-400">No field workers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
