import React, { useState } from "react";
import { UserPlus, Search, Filter, Eye, MapPin, Phone, Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Card, Button, Avatar, Badge, Modal, Input, Select, Tabs, EmptyState } from "../../components/ui";
import { formatDate, STATES, DISTRICTS_BY_STATE, generateId } from "../../lib/utils";
import toast from "react-hot-toast";
import type { Beneficiary } from "../../types";

const SYMPTOMS_LIST = ["Fever", "Cough", "Headache", "Difficulty breathing", "Stomach pain", "Weakness", "Vomiting", "Chest pain", "Dizziness", "Injury", "Skin problems"];

export default function FieldWorkerBeneficiaries() {
  const { beneficiaries, addBeneficiary, offlineMode } = useApp();
  const { session } = useAuth();
  const [search, setSearch] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [form, setForm] = useState({ name: "", age: "", gender: "female" as "male" | "female" | "other", mobile: "", state: "Maharashtra", district: "Palghar", village: "", pinCode: "", symptoms: [] as string[] });
  const [loading, setLoading] = useState(false);

  const myBeneficiaries = beneficiaries.filter(b => b.assignedWorker === "u2");
  const filtered = myBeneficiaries.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.village.toLowerCase().includes(search.toLowerCase()) ||
    b.mobile.includes(search)
  );
  const tabData = {
    all: filtered,
    active: filtered.filter(b => b.status === "active"),
    referred: filtered.filter(b => b.status === "referred"),
  };

  const handleRegister = async () => {
    if (!form.name || !form.mobile || !form.village) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    addBeneficiary({
      ...form,
      age: parseInt(form.age) || 25,
      status: "active",
      assignedWorker: "u2",
      assignedNgo: "ngo1",
      pinCode: form.pinCode || "400001",
    });
    toast.success(offlineMode
      ? "Beneficiary saved locally — waiting for synchronization."
      : "Beneficiary registered successfully!"
    );
    setShowRegister(false);
    setForm({ name: "", age: "", gender: "female", mobile: "", state: "Maharashtra", district: "Palghar", village: "", pinCode: "", symptoms: [] });
    setLoading(false);
  };

  const toggleSymptom = (s: string) => {
    setForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) ? prev.symptoms.filter(x => x !== s) : [...prev.symptoms, s]
    }));
  };

  const districts = DISTRICTS_BY_STATE[form.state] || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Beneficiaries</h1>
          <p className="text-slate-500 text-sm mt-0.5">{myBeneficiaries.length} assigned to you</p>
        </div>
        <Button variant="primary" onClick={() => setShowRegister(true)}>
          <UserPlus size={14} />
          Register New
        </Button>
      </div>

      {offlineMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-700">
          <span className="font-semibold">Offline Mode:</span>
          New registrations will be saved locally and synced when online.
        </div>
      )}

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, village, mobile..." className="w-full pl-8 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <Tabs tabs={[{ id: "all", label: "All", count: filtered.length }, { id: "active", label: "Active" }, { id: "referred", label: "Referred" }]} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {tabData[activeTab as keyof typeof tabData].length === 0 ? (
          <EmptyState title="No beneficiaries found" description="Try adjusting your search or register a new beneficiary." action={<Button variant="primary" onClick={() => setShowRegister(true)}><UserPlus size={13} />Register</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="rc-table">
              <thead>
                <tr><th>Beneficiary</th><th>Age / Gender</th><th>Village</th><th>Mobile</th><th>Last Visit</th><th>Status</th></tr>
              </thead>
              <tbody>
                {tabData[activeTab as keyof typeof tabData].map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={b.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-700">{b.name}</p>
                          {b.ayushmanId && <p className="text-[10px] text-slate-400">{b.ayushmanId}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-500 text-xs">{b.age} · {b.gender}</td>
                    <td>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin size={10} className="text-blue-400" />
                        {b.village}, {b.district}
                      </div>
                    </td>
                    <td className="text-xs text-slate-500">{b.mobile}</td>
                    <td className="text-xs text-slate-500">{b.lastVisit ? formatDate(b.lastVisit) : "—"}</td>
                    <td>
                      <span className={`text-[10px] badge-${b.status === "active" ? "green" : b.status === "referred" ? "purple" : "gray"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Register Modal */}
      <Modal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        title="Register New Beneficiary"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRegister(false)}>Cancel</Button>
            <Button variant="primary" loading={loading} onClick={handleRegister}>
              {offlineMode ? "Save Locally" : "Register"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {offlineMode && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              📶 Offline mode: This record will be saved locally and synced when online.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name *" id="bene-name" placeholder="Ramesh Pawar" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="Age *" id="bene-age" type="number" placeholder="35" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Gender *" id="bene-gender" options={[{ value: "female", label: "Female" }, { value: "male", label: "Male" }, { value: "other", label: "Other" }]} value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value as "male" | "female" | "other" }))} />
            <Input label="Mobile Number *" id="bene-mobile" placeholder="9876543210" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="State *" id="bene-state" options={STATES.map(s => ({ value: s, label: s }))} value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value, district: "" }))} />
            <Select label="District *" id="bene-district" options={districts.map(d => ({ value: d, label: d }))} value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Village *" id="bene-village" placeholder="Village name" value={form.village} onChange={e => setForm(p => ({ ...p, village: e.target.value }))} />
            <Input label="PIN Code" id="bene-pin" placeholder="401404" value={form.pinCode} onChange={e => setForm(p => ({ ...p, pinCode: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Symptoms (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS_LIST.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s.toLowerCase())}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${form.symptoms.includes(s.toLowerCase()) ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
