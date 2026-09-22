import React, { useState } from "react";
import { Pill, Syringe, CheckCircle, Clock, Bell, Star } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

const TYPE_ICON: Record<string, React.ReactNode> = {
  medication: <Pill size={16} />,
  vaccination: <Syringe size={16} />,
  follow_up: <CheckCircle size={16} />,
  health_camp: <Star size={16} />,
  referral: <Bell size={16} />,
};

const TYPE_COLOR: Record<string, string> = {
  medication: "bg-purple-100 text-purple-600",
  vaccination: "bg-teal-100 text-teal-600",
  follow_up: "bg-blue-100 text-blue-600",
  health_camp: "bg-emerald-100 text-emerald-600",
  referral: "bg-amber-100 text-amber-600",
};

export default function Reminders() {
  const { session } = useAuth();
  const { reminders, beneficiaries } = useApp();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Bridge: session.userId (u1) → beneficiary record (b1) by name match
  const myBeneficiaryId = beneficiaries.find(b => b.name === session?.name)?.id;

  // Reminder statuses in mock: "active", "sent", "acknowledged", "missed"
  const myReminders = reminders
    .filter((r) => r.beneficiaryId === myBeneficiaryId)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const active = myReminders.filter(
    (r) => (r.status === "active" || r.status === "sent") && !dismissed.has(r.id)
  );
  const done = [
    ...myReminders.filter((r) => r.status === "acknowledged" || r.status === "missed"),
    ...myReminders.filter((r) => dismissed.has(r.id)),
  ];

  const handleMarkDone = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    toast.success("Reminder marked as done!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Reminders</h1>
        <p className="text-slate-500 text-sm mt-0.5">Stay on top of your medications and appointments.</p>
      </div>

      {/* Active */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Clock size={15} className="text-amber-500" /> Pending Reminders ({active.length})
        </h2>

        {active.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CheckCircle size={22} className="text-emerald-500" />}
              title="All Caught Up!"
              description="You have no pending reminders."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((rem) => (
              <Card key={rem.id} className="p-5 border-l-4 border-l-amber-400">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[rem.type] ?? "bg-gray-100 text-gray-500"}`}>
                    {TYPE_ICON[rem.type] ?? <Bell size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="yellow">{rem.type.replace("_", " ")}</Badge>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {rem.dueTime || "—"}
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold mt-2">{rem.title}</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{rem.description}</p>
                    <p className="text-xs text-slate-400 mt-1.5">Due: {formatDate(rem.dueDate)}</p>

                    <div className="flex items-center gap-1 mt-3 flex-wrap">
                      {rem.channels.map((ch) => (
                        <span key={ch} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium uppercase">
                          {ch}
                        </span>
                      ))}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ml-auto font-medium ${rem.frequency === "daily" ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-500"}`}>
                        {rem.frequency}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4 w-full justify-center"
                      onClick={() => handleMarkDone(rem.id)}
                    >
                      ✓ Mark as Done
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Done / Missed */}
      {done.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-500" /> Completed / Missed
          </h2>
          <div className="space-y-2">
            {done.map((rem) => (
              <div
                key={rem.id}
                className={`bg-white border border-slate-100 rounded-lg p-3 flex justify-between items-center opacity-60 ${rem.status === "acknowledged" || dismissed.has(rem.id) ? "" : "line-through decoration-slate-300"}`}
              >
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${TYPE_COLOR[rem.type] ?? "bg-gray-100 text-gray-500"}`}>
                    {TYPE_ICON[rem.type] ?? <Bell size={12} />}
                  </span>
                  <div>
                    <p className="font-medium text-slate-600">{rem.title}</p>
                    <p className="text-[11px] text-slate-400">{rem.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <Badge variant={rem.status === "missed" ? "red" : "green"}>
                    {dismissed.has(rem.id) ? "done" : rem.status}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1">{formatDate(rem.dueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
