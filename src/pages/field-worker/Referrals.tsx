import React, { useState } from "react";
import { Send, Plus, MapPin, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Select, Textarea, Modal } from "../../components/ui";
import { formatDate, getSeverityColor } from "../../lib/utils";
import toast from "react-hot-toast";
import { Avatar, Badge } from "../../components/ui";

const FACILITIES = [
  { id: "hf1", name: "PHC Palghar" },
  { id: "hf2", name: "CHC Nandurbar" },
  { id: "hf3", name: "District Hospital Barmer" },
  { id: "hf5", name: "Sub-Centre Chamorshi" },
  { id: "hf10", name: "CHC Gadchiroli" },
];

export default function FieldWorkerReferrals() {
  const { referrals, beneficiaries, addReferral, updateCase, offlineMode } = useApp();
  const myReferrals = referrals.filter(r => r.fromWorkerId === "u2");
  const myBeneficiaries = beneficiaries.filter(b => b.assignedWorker === "u2");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ beneficiaryId: "", facilityId: "", priority: "moderate" as "low" | "moderate" | "high", reason: "", preferredDate: "" });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.beneficiaryId || !form.facilityId || !form.reason) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const bene = myBeneficiaries.find(b => b.id === form.beneficiaryId);
    const facility = FACILITIES.find(f => f.id === form.facilityId);
    await new Promise(r => setTimeout(r, 500));
    addReferral({
      caseId: "",
      beneficiaryId: form.beneficiaryId,
      beneficiaryName: bene?.name || "Unknown",
      fromWorkerId: "u2",
      toFacilityId: form.facilityId,
      toFacilityName: facility?.name || "Unknown",
      priority: form.priority,
      reason: form.reason,
      symptoms: [],
      status: "pending",
      scheduledDate: form.preferredDate || undefined,
      district: bene?.district || "Palghar",
      state: bene?.state || "Maharashtra",
    });
    setLoading(false);
    toast.success(offlineMode ? "Referral saved locally — pending sync." : "Referral created successfully!");
    setShowCreate(false);
    setForm({ beneficiaryId: "", facilityId: "", priority: "moderate", reason: "", preferredDate: "" });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Referrals</h1>
          <p className="text-slate-500 text-sm mt-0.5">{myReferrals.length} referrals created</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}><Plus size={14} />Create Referral</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table">
            <thead><tr><th>Beneficiary</th><th>Facility</th><th>Priority</th><th>Reason</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {myReferrals.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.beneficiaryName} size="sm" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{r.beneficiaryName}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={9} />{r.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-slate-600">{r.toFacilityName}</td>
                  <td>
                    <span className={`badge-${r.priority === "high" ? "red" : r.priority === "moderate" ? "yellow" : "green"} text-[10px]`}>
                      {r.priority === "high" && <AlertTriangle size={9} />}
                      {r.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500 max-w-[180px] truncate">{r.reason}</td>
                  <td className="text-xs text-slate-500">{formatDate(r.createdAt)}</td>
                  <td>
                    <span className={`badge-${r.status === "completed" ? "green" : r.status === "accepted" ? "blue" : r.status === "scheduled" ? "purple" : r.status === "cancelled" ? "red" : "gray"} text-[10px]`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Referral" size="md"
        footer={<><Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button><Button variant="primary" loading={loading} onClick={handleCreate}>Create Referral</Button></>}
      >
        <div className="space-y-4">
          <Select label="Beneficiary *" id="ref-bene" options={[{ value: "", label: "Select beneficiary" }, ...myBeneficiaries.map(b => ({ value: b.id, label: `${b.name} — ${b.village}` }))]} value={form.beneficiaryId} onChange={e => setForm(p => ({ ...p, beneficiaryId: e.target.value }))} />
          <Select label="Refer to Facility *" id="ref-facility" options={[{ value: "", label: "Select facility" }, ...FACILITIES.map(f => ({ value: f.id, label: f.name }))]} value={form.facilityId} onChange={e => setForm(p => ({ ...p, facilityId: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="flex gap-2">
              {(["low", "moderate", "high"] as const).map(p => (
                <button key={p} type="button" onClick={() => setForm(prev => ({ ...prev, priority: p }))} className={`flex-1 py-2 text-xs font-semibold rounded-lg border-2 capitalize transition-all ${form.priority === p ? p === "high" ? "border-red-500 bg-red-50 text-red-700" : p === "moderate" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Textarea label="Reason for Referral *" id="ref-reason" placeholder="Describe the clinical reason for referral..." rows={3} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
            <input type="date" value={form.preferredDate} onChange={e => setForm(p => ({ ...p, preferredDate: e.target.value }))} className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
