import React from "react";
import { Stethoscope, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button } from "../../components/ui";

export default function Providers() {
  const { facilities } = useApp();

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Healthcare Providers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage clinics, hospitals, and primary health centres.</p>
        </div>
        <Button variant="primary" size="sm">Add Facility</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Facility Name</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Contact</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Services</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map(facility => (
                <tr key={facility.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800 text-sm">
                    {facility.name}
                  </td>
                  <td className="px-5 py-3">
                    <span className="badge-purple text-[10px] uppercase">{facility.type}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{facility.district}, {facility.state}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{facility.contactNumber || "N/A"}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {facility.services?.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="badge-blue text-[10px]">{s}</span>
                      ))}
                      {(facility.services?.length || 0) > 2 && (
                        <span className="badge-gray text-[10px]">+{facility.services!.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {facilities.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-slate-400">No facilities found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
