import React from "react";
import { Calendar, User, Clock, MapPin, CheckCircle } from "lucide-react";
import { Card, EmptyState, Badge } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils";

export default function DoctorFollowUps() {
  const { appointments } = useApp();

  const followUps = appointments
    .filter(a => a.type === "follow_up")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcoming = followUps.filter(a => a.status === "scheduled");
  const completed = followUps.filter(a => a.status === "completed");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Follow-Ups</h1>
        <p className="text-slate-500 text-sm mt-0.5">{upcoming.length} pending · {completed.length} completed</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Clock size={14} className="text-amber-500" /> Pending Follow-Ups</h2>
        {upcoming.length === 0 ? (
          <Card><EmptyState icon={<CheckCircle size={22} />} title="All follow-ups complete!" description="No pending follow-ups at this time." /></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(apt => (
              <Card key={apt.id} className="p-5 border-l-4 border-l-amber-400">
                <h3 className="font-semibold text-slate-800">{apt.beneficiaryName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={11} /> {apt.facilityName}</p>
                <div className="flex gap-3 mt-3 p-2 bg-amber-50 rounded text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-1"><Calendar size={11} className="text-amber-600" />{formatDate(apt.date)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} className="text-amber-600" />{apt.time}</span>
                </div>
                {apt.notes && <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-2 py-1.5 rounded">{apt.notes}</p>}
              </Card>
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Completed</h2>
          <Card className="overflow-hidden">
            <table className="rc-table">
              <thead><tr><th>Patient</th><th>Date</th><th>Facility</th><th>Status</th></tr></thead>
              <tbody>
                {completed.map(apt => (
                  <tr key={apt.id}>
                    <td className="font-medium">{apt.beneficiaryName}</td>
                    <td>{formatDate(apt.date)}</td>
                    <td>{apt.facilityName ?? "—"}</td>
                    <td><Badge variant="green">completed</Badge></td>
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
