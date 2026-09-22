import React from "react";
import { Send, Calendar, AlertCircle, MapPin, User, CheckCircle, Clock } from "lucide-react";
import { Card, EmptyState, Badge } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-50 border-l-red-500 border-l-4",
  moderate: "bg-amber-50 border-l-amber-400 border-l-4",
  low: "bg-slate-50 border-l-slate-300 border-l-4",
};

const STATUS_VARIANT: Record<string, "yellow" | "blue" | "green" | "red" | "gray"> = {
  pending: "yellow",
  accepted: "blue",
  scheduled: "blue",
  completed: "green",
  cancelled: "red",
};

export default function Referrals() {
  const { session } = useAuth();
  const { referrals, beneficiaries } = useApp();

  // Bridge: session.userId (u1) → beneficiary record (b1) by name match
  const myBeneficiaryId = beneficiaries.find(b => b.name === session?.name)?.id;

  const myReferrals = referrals
    .filter((r) => r.beneficiaryId === myBeneficiaryId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const active = myReferrals.filter((r) => r.status !== "completed" && r.status !== "cancelled");
  const past = myReferrals.filter((r) => r.status === "completed" || r.status === "cancelled");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Referrals</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {active.length} active · {past.length} completed
        </p>
      </div>

      {myReferrals.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Send size={22} />}
            title="No Referrals"
            description="You don't have any medical referrals at this time."
          />
        </Card>
      ) : (
        <>
          {/* Active Referrals */}
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock size={15} className="text-amber-500" /> Active Referrals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.map((ref) => (
                  <Card key={ref.id} className={`p-5 flex flex-col ${PRIORITY_COLORS[ref.priority] ?? ""}`}>
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant={STATUS_VARIANT[ref.status] ?? "gray"}>
                        {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                      </Badge>
                      {ref.priority === "high" && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <AlertCircle size={11} /> High Priority
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-800 text-base mb-1">
                      <MapPin size={13} className="inline text-blue-500 mr-1" />
                      {ref.toFacilityName}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{ref.reason}</p>

                    {ref.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {ref.symptoms.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto space-y-1.5 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100">
                      {ref.toDoctorName && (
                        <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-400" />
                          <span>Doctor: <strong className="text-slate-700">{ref.toDoctorName}</strong></span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-slate-400" />
                        <span>Referred: <strong className="text-slate-700">{formatDate(ref.createdAt)}</strong></span>
                      </div>
                      {ref.scheduledDate && (
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-blue-400" />
                          <span>Scheduled: <strong className="text-slate-700">{formatDate(ref.scheduledDate)}</strong></span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Referrals */}
          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500" /> Past Referrals
              </h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="rc-table">
                    <thead>
                      <tr>
                        <th>Facility</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {past.map((ref) => (
                        <tr key={ref.id}>
                          <td className="font-medium">{ref.toFacilityName}</td>
                          <td className="text-slate-500 max-w-xs truncate">{ref.reason}</td>
                          <td>{formatDate(ref.completedAt ?? ref.createdAt)}</td>
                          <td>
                            <Badge variant={ref.status === "completed" ? "green" : "red"}>
                              {ref.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
