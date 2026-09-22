import React from "react";
import { Heart, Calendar, MapPin, Clock, Users, Package, CheckCircle } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export default function FieldWorkerHealthCamps() {
  const { healthCamps } = useApp();

  const upcoming = healthCamps.filter(c => c.status === "upcoming" || c.status === "ongoing")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = healthCamps.filter(c => c.status === "completed" || c.status === "cancelled");

  const handleRegister = (name: string) => {
    toast.success(`You've been registered as a volunteer for "${name}"!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Health Camps</h1>
        <p className="text-slate-500 text-sm mt-0.5">{upcoming.length} upcoming camps in your region</p>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> Upcoming Camps</h2>
        {upcoming.length === 0 ? (
          <Card><EmptyState icon={<Heart size={22} />} title="No upcoming camps" description="No health camps scheduled in your region." /></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map(camp => (
              <Card key={camp.id} className="p-5 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={camp.status === "ongoing" ? "green" : "blue"}>{camp.status}</Badge>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{camp.ngoName}</span>
                </div>
                <h3 className="font-semibold text-slate-800 text-base">{camp.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={11} /> {camp.location}, {camp.village}, {camp.district}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded">
                    <Calendar size={12} className="text-blue-500" />
                    <span>{formatDate(camp.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded">
                    <Clock size={12} className="text-blue-500" />
                    <span>{camp.startTime} – {camp.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded">
                    <Users size={12} className="text-emerald-500" />
                    <span>{camp.registeredBeneficiaries ?? 0} / {camp.expectedBeneficiaries} registered</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded">
                    <Heart size={12} className="text-red-500" />
                    <span>{camp.availableDoctors} doctors</span>
                  </div>
                </div>

                {camp.services?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {camp.services.slice(0, 4).map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                    ))}
                    {camp.services.length > 4 && <span className="text-[10px] text-slate-400">+{camp.services.length - 4} more</span>}
                  </div>
                )}

                <Button variant="primary" size="sm" className="mt-4 w-full justify-center" onClick={() => handleRegister(camp.name)}>
                  Register as Volunteer
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Past Camps</h2>
          <Card className="overflow-hidden">
            <table className="rc-table">
              <thead><tr><th>Camp Name</th><th>Location</th><th>Date</th><th>Beneficiaries</th><th>Status</th></tr></thead>
              <tbody>
                {past.map(camp => (
                  <tr key={camp.id}>
                    <td className="font-medium">{camp.name}</td>
                    <td>{camp.village}, {camp.district}</td>
                    <td>{formatDate(camp.date)}</td>
                    <td>{camp.registeredBeneficiaries ?? "—"} / {camp.expectedBeneficiaries}</td>
                    <td><Badge variant={camp.status === "completed" ? "green" : "red"}>{camp.status}</Badge></td>
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
