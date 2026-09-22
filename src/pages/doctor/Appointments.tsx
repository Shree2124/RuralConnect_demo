import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { Card, EmptyState, Badge } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils";

const TYPE_LABELS: Record<string, string> = {
  consultation: "Consultation", follow_up: "Follow-up",
  vaccination: "Vaccination", health_camp: "Health Camp", referral: "Referral Visit",
};

export default function DoctorAppointments() {
  const { appointments } = useApp();

  const all = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcoming = all.filter(a => a.status === "scheduled");
  const past = all.filter(a => a.status !== "scheduled");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Appointments</h1>
        <p className="text-slate-500 text-sm mt-0.5">{upcoming.length} upcoming · {past.length} past</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> Upcoming</h2>
        {upcoming.length === 0 ? (
          <Card><EmptyState icon={<Calendar size={22} />} title="No upcoming appointments" description="No scheduled appointments at this time." /></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(apt => (
              <Card key={apt.id} className="p-5 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="blue">{TYPE_LABELS[apt.type] ?? apt.type}</Badge>
                </div>
                <h3 className="font-semibold text-slate-800">{apt.beneficiaryName}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin size={11} />{apt.facilityName}</p>
                <div className="flex gap-3 mt-3 p-2 bg-blue-50 rounded text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-1"><Calendar size={11} className="text-blue-500" />{formatDate(apt.date)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} className="text-blue-500" />{apt.time}</span>
                </div>
                {apt.notes && <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded mt-2">📝 {apt.notes}</p>}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-slate-400" /> History</h2>
        {past.length === 0 ? (
          <Card><EmptyState icon={<Clock size={22} />} title="No history" description="Past appointments will appear here." /></Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="rc-table">
                <thead><tr><th>Date</th><th>Patient</th><th>Type</th><th>Facility</th><th>Status</th></tr></thead>
                <tbody>
                  {past.map(apt => (
                    <tr key={apt.id}>
                      <td><div className="font-medium">{formatDate(apt.date)}</div><div className="text-[10px] text-slate-400">{apt.time}</div></td>
                      <td>{apt.beneficiaryName}</td>
                      <td><span className="text-xs text-slate-600">{TYPE_LABELS[apt.type] ?? apt.type}</span></td>
                      <td>{apt.facilityName ?? "—"}</td>
                      <td><Badge variant={apt.status === "completed" ? "green" : apt.status === "cancelled" ? "red" : "gray"}>{apt.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
