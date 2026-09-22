import React from "react";
import { Calendar, User, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Card, EmptyState, Badge } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate, formatTime } from "../../lib/utils";
import { Link } from "react-router-dom";

const TYPE_LABELS: Record<string, string> = {
  consultation: "Consultation",
  follow_up: "Follow-up",
  vaccination: "Vaccination",
  health_camp: "Health Camp",
  referral: "Referral Visit",
};

export default function Appointments() {
  const { session } = useAuth();
  const { appointments, beneficiaries } = useApp();

  // Bridge: session.userId (u1) → beneficiary record (b1) by name match
  const myBeneficiaryId = beneficiaries.find(b => b.name === session?.name)?.id;

  const myAppointments = appointments
    .filter((a) => a.beneficiaryId === myBeneficiaryId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcoming = myAppointments.filter((a) => a.status === "scheduled");
  const past = myAppointments.filter((a) => a.status !== "scheduled");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Appointments</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Calendar size={15} className="text-blue-500" /> Upcoming Appointments
        </h2>
        {upcoming.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar size={22} />}
              title="No upcoming appointments"
              description="You have no scheduled appointments at this time."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((apt) => (
              <Card key={apt.id} className="p-5 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base">{apt.facilityName}</h3>
                    {apt.doctorName && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <User size={11} /> {apt.doctorName}
                      </p>
                    )}
                  </div>
                  <Badge variant="blue">{TYPE_LABELS[apt.type] ?? apt.type}</Badge>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar size={13} className="text-blue-500" />
                    {formatDate(apt.date)}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Clock size={13} className="text-blue-500" />
                    {apt.time || formatTime(apt.date)}
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-500 mt-3 bg-amber-50 px-3 py-2 rounded border border-amber-100">
                    📝 {apt.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <CheckCircle size={15} className="text-slate-400" /> Appointment History
        </h2>
        {past.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Clock size={22} />}
              title="No past appointments"
              description="Your appointment history will appear here."
            />
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="rc-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Facility</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div className="font-medium">{formatDate(apt.date)}</div>
                        <div className="text-[10px] text-slate-500">{apt.time}</div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-600">{TYPE_LABELS[apt.type] ?? apt.type}</span>
                      </td>
                      <td>{apt.facilityName ?? "—"}</td>
                      <td>{apt.doctorName ?? "—"}</td>
                      <td>
                        <Badge variant={
                          apt.status === "completed" ? "green" :
                          apt.status === "cancelled" ? "red" :
                          apt.status === "missed" ? "orange" : "gray"
                        }>
                          {apt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
