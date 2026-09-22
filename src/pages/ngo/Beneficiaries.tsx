import React from "react";
import { Users, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Avatar } from "../../components/ui";
import { formatDate } from "../../lib/utils";

export default function NGOBeneficiaries() {
  const { beneficiaries } = useApp();
  // Filter for this NGO (using ngo1 for demo)
  const myBeneficiaries = beneficiaries.filter(b => b.assignedNgo === "ngo1");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Beneficiaries</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage patients registered under your NGO.</p>
        </div>
        <Button variant="primary" size="sm">Add Beneficiary</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Patient</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Registration</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Symptoms</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBeneficiaries.map(b => (
                <tr key={b.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={b.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.age} yrs • {b.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{b.village}, {b.district}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{formatDate(b.registeredAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {b.symptoms?.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="badge-blue text-[10px]">{s}</span>
                      ))}
                      {(b.symptoms?.length || 0) > 2 && (
                        <span className="badge-gray text-[10px]">+{b.symptoms!.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge-${b.status === "active" ? "green" : b.status === "referred" ? "purple" : "gray"} text-xs`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {myBeneficiaries.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-slate-400">No beneficiaries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
