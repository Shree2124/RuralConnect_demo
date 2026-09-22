import React, { useState } from "react";
import { Navigation, MapPin, User, Calendar, Clock, CheckCircle, Plus } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

// Visit schedule based on assigned beneficiaries
const MOCK_VISITS = [
  { id: "v1", beneficiaryId: "b1", beneficiaryName: "Meena Patil", village: "Safale", district: "Palghar", purpose: "Follow-up after fever treatment", scheduledDate: "2026-09-09", scheduledTime: "09:00 AM", status: "scheduled", priority: "high" },
  { id: "v2", beneficiaryId: "b2", beneficiaryName: "Ramesh Pawar", village: "Kasa", district: "Palghar", purpose: "Post-referral check-up", scheduledDate: "2026-09-09", scheduledTime: "11:00 AM", status: "scheduled", priority: "moderate" },
  { id: "v3", beneficiaryId: "b6", beneficiaryName: "Dinesh Jagtap", village: "Talasari", district: "Palghar", purpose: "Wound dressing and injury follow-up", scheduledDate: "2026-09-10", scheduledTime: "10:00 AM", status: "scheduled", priority: "low" },
  { id: "v4", beneficiaryId: "b31", beneficiaryName: "Rita Verma", village: "Safale", district: "Palghar", purpose: "General health check", scheduledDate: "2026-09-10", scheduledTime: "02:00 PM", status: "scheduled", priority: "low" },
  { id: "v5", beneficiaryId: "b5", beneficiaryName: "Kavita Jadhav", village: "Chamorshi", district: "Gadchiroli", purpose: "Fever monitoring", scheduledDate: "2026-09-08", scheduledTime: "09:00 AM", status: "completed", priority: "moderate" },
  { id: "v6", beneficiaryId: "b12", beneficiaryName: "Rahul Gond", village: "Etapalli", district: "Gadchiroli", purpose: "Suspected malaria — blood sample collection", scheduledDate: "2026-09-08", scheduledTime: "08:00 AM", status: "completed", priority: "high" },
  { id: "v7", beneficiaryId: "b35", beneficiaryName: "Kiran Bedi", village: "Etapalli", district: "Gadchiroli", purpose: "Headache and preliminary assessment", scheduledDate: "2026-09-08", scheduledTime: "11:00 AM", status: "completed", priority: "low" },
];

const PRIORITY_BORDER: Record<string, string> = {
  high: "border-l-red-500", moderate: "border-l-amber-400", low: "border-l-slate-300",
};

export default function FieldWorkerVisits() {
  const { session } = useAuth();
  const { beneficiaries } = useApp();
  const [visits, setVisits] = useState(MOCK_VISITS);

  const upcoming = visits.filter(v => v.status === "scheduled").sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  const completed = visits.filter(v => v.status === "completed");

  const handleComplete = (id: string) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status: "completed" } : v));
    toast.success("Visit marked as completed!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Visit Schedule</h1>
          <p className="text-slate-500 text-sm mt-0.5">{upcoming.length} upcoming · {completed.length} completed today</p>
        </div>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Clock size={14} className="text-amber-500" /> Upcoming Visits</h2>
        {upcoming.length === 0 ? (
          <Card><EmptyState icon={<Navigation size={22} />} title="No upcoming visits" description="All visits completed for today." /></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map(v => (
              <Card key={v.id} className={`p-5 border-l-4 ${PRIORITY_BORDER[v.priority]}`}>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={v.priority === "high" ? "red" : v.priority === "moderate" ? "yellow" : "gray"}>
                    {v.priority} priority
                  </Badge>
                  <span className="text-[10px] text-slate-400">{v.scheduledTime}</span>
                </div>
                <h3 className="font-semibold text-slate-800">{v.beneficiaryName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={11} /> {v.village}, {v.district}</p>
                <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">{v.purpose}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(v.scheduledDate)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {v.scheduledTime}</span>
                </div>
                <Button variant="primary" size="sm" className="mt-3 w-full justify-center" onClick={() => handleComplete(v.id)}>
                  ✓ Mark Visit Complete
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Completed Visits</h2>
          <Card className="overflow-hidden">
            <table className="rc-table">
              <thead><tr><th>Patient</th><th>Village</th><th>Purpose</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {completed.map(v => (
                  <tr key={v.id}>
                    <td className="font-medium">{v.beneficiaryName}</td>
                    <td className="text-slate-500">{v.village}</td>
                    <td className="text-slate-500 max-w-[200px] truncate">{v.purpose}</td>
                    <td>{formatDate(v.scheduledDate)}</td>
                    <td><Badge variant="green">Completed</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      )}
    </div>
  );
}
