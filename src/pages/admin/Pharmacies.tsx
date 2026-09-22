import React from "react";
import { Package, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Avatar } from "../../components/ui";

export default function Pharmacies() {
  const { users } = useApp();
  const pharmacies = users.filter(u => u.role === "pharmacy");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pharmacy Partners</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage connected community pharmacies and stores.</p>
        </div>
        <Button variant="primary" size="sm">Add Pharmacy</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Pharmacy Name</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Manager</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map(pharmacy => (
                <tr key={pharmacy.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {pharmacy.organization?.charAt(0) || "P"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{pharmacy.organization || "Independent Pharmacy"}</p>
                        <p className="text-xs text-slate-500">{pharmacy.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{pharmacy.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{pharmacy.district}, {pharmacy.state}</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${pharmacy.status === "active" ? "green" : "gray"} text-xs`}>{pharmacy.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {pharmacies.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-slate-400">No pharmacies found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
