import React, { useState } from "react";
import { FileText, AlertTriangle, CheckCircle, Search, Activity } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

const SEV_VARIANT: Record<string, "red" | "yellow" | "green"> = {
  high: "red", moderate: "yellow", low: "green",
};

export default function DoctorCases() {
  const { cases, updateCase } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Doctors see all cases assigned to their facility area
  const allCases = cases
    .filter(c =>
      (filter === "all" || c.status === filter) &&
      (c.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
       c.district.toLowerCase().includes(search.toLowerCase()) ||
       c.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleClose = (id: string) => {
    updateCase(id, { status: "closed", updatedAt: new Date().toISOString() });
    toast.success("Case marked as closed.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Case Records</h1>
          <p className="text-slate-500 text-sm mt-0.5">{allCases.length} cases shown</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search patient, symptom..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "open", "referred", "closed"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s === "all" ? "All Cases" : s}
          </button>
        ))}
      </div>

      {allCases.length === 0 ? (
        <Card><EmptyState icon={<FileText size={22} />} title="No Cases Found" description="No cases match your current filter." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Symptoms</th>
                  <th>Severity</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allCases.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.beneficiaryName}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {c.symptoms.slice(0, 2).map(s => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{s}</span>
                        ))}
                        {c.symptoms.length > 2 && <span className="text-[10px] text-slate-400">+{c.symptoms.length - 2}</span>}
                      </div>
                    </td>
                    <td><Badge variant={SEV_VARIANT[c.severity] ?? "gray"}>{c.severity}</Badge></td>
                    <td className="text-slate-500">{c.district}</td>
                    <td>
                      <Badge variant={c.status === "open" ? "blue" : c.status === "referred" ? "yellow" : c.status === "closed" ? "green" : "gray"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="text-slate-500 text-xs">{formatDate(c.createdAt)}</td>
                    <td>
                      {c.status === "open" && (
                        <Button variant="secondary" size="sm" onClick={() => handleClose(c.id)}>Close</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
