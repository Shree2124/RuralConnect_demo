import React, { useState } from "react";
import { User, Phone, MapPin, Calendar, Edit, Save, X, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Card, Button, Input, Select, Avatar, Badge } from "../components/ui";
import { STATES, DISTRICTS_BY_STATE, getRoleLabel, formatDate } from "../lib/utils";
import toast from "react-hot-toast";

export default function Profile() {
  const { session } = useAuth();
  const { currentUser } = useAuth();
  const { updateUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: session?.name || "", mobile: "9876543210", state: "Maharashtra", district: "Palghar", village: "Safale" });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success("Profile updated successfully.");
    setEditing(false);
    setLoading(false);
  };

  const DEMO_USER_DATA: Record<string, { joined: string; id: string }> = {
    beneficiary: { joined: "2024-03-15", id: "AY-MH-20240041" },
    field_worker: { joined: "2024-01-10", id: "CHW-MH-2024-18" },
    ngo_admin: { joined: "2023-11-01", id: "NGO-MH-2023-05" },
    doctor: { joined: "2024-02-20", id: "REG-MH-MCI-4872" },
    pharmacy: { joined: "2024-01-05", id: "PH-MH-LIC-8823" },
    admin: { joined: "2023-09-01", id: "ADM-001" },
  };

  const userMeta = session ? DEMO_USER_DATA[session.role] : null;

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        {!editing ? (
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}><Edit size={13} />Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(false)}><X size={13} />Cancel</Button>
            <Button variant="primary" size="sm" loading={loading} onClick={handleSave}><Save size={13} />Save Changes</Button>
          </div>
        )}
      </div>

      {/* Avatar & Role */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={session?.name || "User"} size="lg" className="w-16 h-16 text-xl" />
            {editing && (
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <Camera size={11} />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{session?.name}</h2>
            <p className="text-xs text-slate-500">{session?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge-blue text-xs">{session && getRoleLabel(session.role)}</span>
              {userMeta && <span className="badge-gray text-[10px]">{userMeta.id}</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Details */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Profile Details</h2>
        {editing ? (
          <div className="space-y-4">
            <Input label="Full Name" id="profile-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="Mobile Number" id="profile-mobile" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="State" id="profile-state" options={STATES.map(s => ({ value: s, label: s }))} value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} />
              <Select label="District" id="profile-district" options={(DISTRICTS_BY_STATE[form.state] || []).map(d => ({ value: d, label: d }))} value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} />
            </div>
            <Input label="Village" id="profile-village" value={form.village} onChange={e => setForm(p => ({ ...p, village: e.target.value }))} />
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { icon: <User size={14} />, label: "Full Name", value: session?.name },
              { icon: <Phone size={14} />, label: "Mobile", value: "9876543210" },
              { icon: <MapPin size={14} />, label: "Location", value: "Safale, Palghar, Maharashtra" },
              { icon: <Calendar size={14} />, label: "Member Since", value: userMeta ? formatDate(userMeta.joined) : "—" },
            ].map(field => (
              <div key={field.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 flex-shrink-0">{field.icon}</span>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-medium">{field.label}</p>
                  <p className="text-sm text-slate-800 font-medium">{field.value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Demo notice */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700 text-center">
          🔒 Demo environment — profile changes are not persisted to any server
        </p>
      </div>
    </div>
  );
}
