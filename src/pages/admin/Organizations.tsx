import React from "react";
import { Building2, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Avatar } from "../../components/ui";

export default function Organizations() {
  const { ngos } = useApp();

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Organizations</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage NGOs and healthcare organizations.</p>
        </div>
        <Button variant="primary" size="sm">Add NGO</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Organization</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Registration</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Focus Area</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngos.map(ngo => (
                <tr key={ngo.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={ngo.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{ngo.name}</p>
                        <p className="text-xs text-slate-500">{ngo.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{ngo.regNumber}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{ngo.district}, {ngo.state}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ngo.focusArea.map((area, idx) => (
                        <span key={idx} className="badge-blue text-[10px]">{area}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge-${ngo.status === "active" ? "green" : "gray"} text-xs`}>{ngo.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
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
