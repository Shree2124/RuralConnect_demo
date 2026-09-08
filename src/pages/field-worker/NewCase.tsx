import React, { useState } from "react";
import { ClipboardList, AlertTriangle, WifiOff, Save } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Input, Select, Textarea } from "../../components/ui";
import { DISTRICTS_BY_STATE, STATES } from "../../lib/utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SYMPTOM_OPTIONS = ["Fever", "Cough", "Headache", "Difficulty breathing", "Stomach pain", "Weakness", "Vomiting", "Chest pain", "Dizziness", "Injury", "Skin problems", "Other"];

export default function NewCase() {
  const { addCase, beneficiaries, offlineMode } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    beneficiaryId: "",
    symptoms: [] as string[],
    severity: "moderate" as "low" | "moderate" | "high",
    notes: "",
    state: "Maharashtra",
    district: "Palghar",
    village: "",
  });
  const [loading, setLoading] = useState(false);

  const myBeneficiaries = beneficiaries.filter(b => b.assignedWorker === "u2");
  const selectedBene = myBeneficiaries.find(b => b.id === form.beneficiaryId);

  const toggleSymptom = (s: string) => {
    setForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s.toLowerCase()) ? prev.symptoms.filter(x => x !== s.toLowerCase()) : [...prev.symptoms, s.toLowerCase()]
    }));
  };

  const handleSubmit = async () => {
    if (!form.beneficiaryId || form.symptoms.length === 0) {
      toast.error("Please select a beneficiary and at least one symptom.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    addCase({
      beneficiaryId: form.beneficiaryId,
      beneficiaryName: selectedBene?.name || "Unknown",
      village: selectedBene?.village || form.village,
      district: selectedBene?.district || form.district,
      state: selectedBene?.state || form.state,
      symptoms: form.symptoms,
      severity: form.severity,
      status: offlineMode ? "pending_sync" : "open",
      createdBy: "u2",
      notes: form.notes,
    });
    setLoading(false);
    toast.success(
      offlineMode
        ? "Case saved locally — waiting for synchronization."
        : "Case created successfully!"
    );
    navigate("/field-worker/dashboard");
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">New Healthcare Case</h1>
        <p className="text-slate-500 text-sm mt-0.5">Record a new health case for a beneficiary</p>
      </div>

      {offlineMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-700">
          <WifiOff size={14} />
          <span><strong>Offline mode:</strong> This case will be saved locally and synchronized when connectivity is restored.</span>
        </div>
      )}

      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Beneficiary Information</h2>
        <Select
          label="Select Beneficiary *"
          id="case-bene"
          options={[{ value: "", label: "— Select beneficiary —" }, ...myBeneficiaries.map(b => ({ value: b.id, label: `${b.name} — ${b.village}` }))]}
          value={form.beneficiaryId}
          onChange={e => setForm(p => ({ ...p, beneficiaryId: e.target.value }))}
        />
        {selectedBene && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-semibold">{selectedBene.name}</p>
            <p className="text-[10px] text-slate-500">{selectedBene.age} yrs · {selectedBene.gender} · {selectedBene.village}, {selectedBene.district}</p>
            <p className="text-[10px] text-slate-500">📱 {selectedBene.mobile}</p>
          </div>
        )}
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Symptoms</h2>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${form.symptoms.includes(s.toLowerCase()) ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Urgency Level</label>
          <div className="flex gap-2">
            {(["low", "moderate", "high"] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setForm(p => ({ ...p, severity: s }))}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border-2 transition-all capitalize ${
                  form.severity === s
                    ? s === "high" ? "border-red-500 bg-red-50 text-red-700"
                      : s === "moderate" ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                {s === "high" && <AlertTriangle size={10} className="inline mr-1" />}
                {s}
              </button>
            ))}
          </div>
          {form.severity === "high" && (
            <p className="text-xs text-red-600 mt-2 font-medium">⚠️ High severity cases require urgent referral to CHC or District Hospital.</p>
          )}
        </div>

        <Textarea label="Clinical Notes" id="case-notes" placeholder="Additional observations, context, or notes..." rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button variant="primary" loading={loading} onClick={handleSubmit} className="flex-1 justify-center">
          <Save size={14} />
          {offlineMode ? "Save Locally" : "Create Case"}
        </Button>
      </div>
    </div>
  );
}
