import React, { useState } from "react";
import { Send, AlertCircle, CheckCircle, Clock, Calendar, MapPin, User, ChevronDown, ChevronUp } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

const PRIORITY_BORDER: Record<string, string> = {
  high: "border-l-4 border-l-red-500",
  moderate: "border-l-4 border-l-amber-400",
  low: "border-l-4 border-l-slate-300",
};
const STATUS_VARIANT: Record<string, "yellow" | "blue" | "green" | "red" | "gray"> = {
  pending: "yellow", accepted: "blue", scheduled: "blue", completed: "green", cancelled: "red",
};

export default function DoctorReferrals() {
  const { session } = useAuth();
  const { referrals, updateReferral } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  const myReferrals = referrals
    .filter((r) => r.toDoctorId === session?.userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pending = myReferrals.filter(r => r.status === "pending");
  const accepted = myReferrals.filter(r => r.status === "accepted" || r.status === "scheduled");
  const done = myReferrals.filter(r => r.status === "completed" || r.status === "cancelled");

  const handleAccept = (id: string) => {
    updateReferral(id, { status: "accepted" });
    toast.success("Referral accepted!");
  };

  const ReferralCard = ({ ref: r }: { ref: typeof referrals[0] }) => (
    <Card key={r.id} className={`p-5 ${PRIORITY_BORDER[r.priority]}`}>
      <div className="flex justify-between items-start mb-2">
        <Badge variant={STATUS_VARIANT[r.status] ?? "gray"}>{r.status}</Badge>
        {r.priority === "high" && (
          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <AlertCircle size={11} /> High Priority
          </span>
        )}
      </div>
      <h3 className="font-semibold text-slate-800 text-base mt-1">{r.beneficiaryName}</h3>
      <p className="text-sm text-slate-600 mt-1">{r.reason}</p>
      {r.symptoms?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {r.symptoms.map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full">{s}</span>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
        <div className="flex items-center gap-1"><MapPin size={11} /> {r.toFacilityName}</div>
        <div className="flex items-center gap-1"><Calendar size={11} /> {formatDate(r.createdAt)}</div>
      </div>
      {r.status === "pending" && (
        <Button variant="primary" size="sm" className="mt-3 w-full justify-center" onClick={() => handleAccept(r.id)}>
          Accept Referral
        </Button>
      )}
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Patient Referrals</h1>
        <p className="text-slate-500 text-sm mt-0.5">{pending.length} pending · {accepted.length} in progress · {done.length} completed</p>
      </div>

      {myReferrals.length === 0 ? (
        <Card><EmptyState icon={<Send size={22} />} title="No Referrals" description="No patient referrals assigned to you yet." /></Card>
      ) : (
        <>
          {pending.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Clock size={14} className="text-amber-500" /> Pending ({pending.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{pending.map(r => <ReferralCard key={r.id} ref={r} />)}</div>
            </section>
          )}
          {accepted.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> In Progress ({accepted.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{accepted.map(r => <ReferralCard key={r.id} ref={r} />)}</div>
            </section>
          )}
          {done.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Completed ({done.length})</h2>
              <Card className="overflow-hidden">
                <table className="rc-table">
                  <thead><tr><th>Patient</th><th>Facility</th><th>Reason</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>{done.map(r => (
                    <tr key={r.id}>
                      <td className="font-medium">{r.beneficiaryName}</td>
                      <td>{r.toFacilityName}</td>
                      <td className="text-slate-500 max-w-[200px] truncate">{r.reason}</td>
                      <td>{formatDate(r.completedAt ?? r.createdAt)}</td>
                      <td><Badge variant={r.status === "completed" ? "green" : "red"}>{r.status}</Badge></td>
                    </tr>
                  ))}</tbody>
                </table>
              </Card>
            </section>
          )}
        </>
      )}
    </div>
  );
}
