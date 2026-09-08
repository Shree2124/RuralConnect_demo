import React, { useState } from "react";
import { Send, CheckCircle, Calendar, ArrowUpRight, AlertTriangle, Eye, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, StatCard, Button, Avatar, Badge, Modal, Tabs, Textarea, Input } from "../../components/ui";
import { formatDate, getSeverityColor } from "../../lib/utils";
import toast from "react-hot-toast";

export default function DoctorDashboard() {
  const { referrals, cases, appointments, updateReferral, addAppointment, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReferral, setSelectedReferral] = useState<typeof referrals[0] | null>(null);
  const [showCase, setShowCase] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00 AM");
  const [guidance, setGuidance] = useState("");
  const [loading, setLoading] = useState(false);

  const myReferrals = referrals.filter(r => r.toDoctorId === "u4" || r.toFacilityId === "hf1");
  const pendingReferrals = myReferrals.filter(r => r.status === "pending");
  const acceptedReferrals = myReferrals.filter(r => r.status === "accepted" || r.status === "scheduled");
  const completedReferrals = myReferrals.filter(r => r.status === "completed");
  const highPriority = myReferrals.filter(r => r.priority === "high");
  const todayAppts = appointments.filter(a => a.doctorId === "u4" && a.status === "scheduled");

  const tabReferrals = { pending: pendingReferrals, accepted: acceptedReferrals, completed: completedReferrals };

  const handleAccept = async (ref: typeof referrals[0]) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    updateReferral(ref.id, { status: "accepted" });
    addNotification({ userId: ref.beneficiaryId === "b1" ? "u1" : "u2", title: "Referral Accepted", message: `Dr. Vikram Singh has accepted the referral for ${ref.beneficiaryName}.`, category: "referral", isRead: false });
    toast.success(`Referral accepted for ${ref.beneficiaryName}`);
    setLoading(false);
  };

  const handleScheduleFollowUp = async () => {
    if (!scheduleDate || !selectedReferral) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    updateReferral(selectedReferral.id, { status: "scheduled", scheduledDate: scheduleDate });
    addAppointment({ beneficiaryId: selectedReferral.beneficiaryId, beneficiaryName: selectedReferral.beneficiaryName, doctorId: "u4", doctorName: "Dr. Vikram Singh", facilityId: "hf1", facilityName: "PHC Palghar", type: "follow_up", date: scheduleDate, time: scheduleTime, status: "scheduled", district: selectedReferral.district, state: selectedReferral.state });
    addNotification({ userId: "u1", title: "Follow-up Scheduled", message: `Your follow-up with Dr. Vikram Singh is scheduled for ${formatDate(scheduleDate)} at ${scheduleTime}.`, category: "appointment", isRead: false });
    toast.success("Follow-up scheduled. Beneficiary notified.");
    setShowSchedule(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Dr. Vikram Singh · PHC Palghar, Maharashtra</p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium">
          Non-diagnostic care guidance only
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Pending Referrals" value={pendingReferrals.length} icon={<Send size={20} className="text-red-500" />} iconBg="bg-red-100" change="Needs review" changeType="down" />
        <StatCard title="Today's Appointments" value={todayAppts.length} icon={<Calendar size={20} className="text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard title="Follow-ups Due" value={acceptedReferrals.length} icon={<Clock size={20} className="text-amber-600" />} iconBg="bg-amber-100" />
        <StatCard title="High Priority" value={highPriority.length} icon={<AlertTriangle size={20} className="text-red-500" />} iconBg="bg-red-100" />
      </div>

      {/* Referral Queue */}
      <Card>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Referral Queue</h2>
          <Tabs tabs={[{ id: "pending", label: "Pending", count: pendingReferrals.length }, { id: "accepted", label: "Accepted/Scheduled" }, { id: "completed", label: "Completed" }]} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="overflow-x-auto">
          <table className="rc-table">
            <thead>
              <tr><th>Patient</th><th>Location</th><th>Priority</th><th>Symptoms</th><th>Referred By</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {(tabReferrals[activeTab as keyof typeof tabReferrals] || []).map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.beneficiaryName} size="sm" />
                      <span className="font-medium text-slate-700 text-xs">{r.beneficiaryName}</span>
                    </div>
                  </td>
                  <td className="text-xs text-slate-500">{r.district}, {r.state}</td>
                  <td>
                    <span className={`badge-${r.priority === "high" ? "red" : r.priority === "moderate" ? "yellow" : "green"} text-[10px]`}>
                      {r.priority === "high" && <AlertTriangle size={9} />}
                      {r.priority.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.symptoms.slice(0, 2).map(s => <span key={s} className="badge-blue text-[10px]">{s}</span>)}
                      {r.symptoms.length > 2 && <span className="badge-gray text-[10px]">+{r.symptoms.length - 2}</span>}
                    </div>
                  </td>
                  <td className="text-xs text-slate-500">{r.fromWorkerId ? "Field Worker" : "Self"}</td>
                  <td className="text-xs text-slate-500">{formatDate(r.createdAt)}</td>
                  <td>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedReferral(r); setShowCase(true); }}>
                        <Eye size={12} />
                      </Button>
                      {r.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleAccept(r)} loading={loading}>
                          Accept
                        </Button>
                      )}
                      {(r.status === "accepted") && (
                        <Button size="sm" variant="primary" onClick={() => { setSelectedReferral(r); setShowSchedule(true); }}>
                          Schedule
                        </Button>
                      )}
                      {r.status === "scheduled" && (
                        <Button size="sm" variant="secondary" onClick={() => toast.success("Escalation noted.")}>Escalate</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(tabReferrals[activeTab as keyof typeof tabReferrals] || []).length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-400">No referrals in this category</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Case Detail Modal */}
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title="Case Overview" size="lg"
        footer={<><Button variant="secondary" onClick={() => setShowCase(false)}>Close</Button><Button variant="primary" onClick={() => { setShowCase(false); setShowSchedule(true); }}>Schedule Follow-up</Button></>}
      >
        {selectedReferral && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-800">⚠️ Non-Diagnostic Triage Summary</p>
              <p className="text-xs text-blue-700 mt-1">This information is provided for care coordination only. All clinical decisions must be made by a qualified healthcare provider.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Patient</p>
                <p className="text-sm font-medium text-slate-800">{selectedReferral.beneficiaryName}</p>
                <p className="text-xs text-slate-500">{selectedReferral.district}, {selectedReferral.state}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Priority</p>
                <span className={`badge-${selectedReferral.priority === "high" ? "red" : selectedReferral.priority === "moderate" ? "yellow" : "green"}`}>
                  {selectedReferral.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Reported Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {selectedReferral.symptoms.map(s => <span key={s} className="badge-blue">{s}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Referral Reason</p>
              <p className="text-sm text-slate-700">{selectedReferral.reason}</p>
            </div>
            {selectedReferral.notes && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-slate-700">{selectedReferral.notes}</p>
              </div>
            )}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-800">Human Review Recommended</p>
              <p className="text-xs text-amber-700 mt-0.5">Please evaluate this case based on your clinical expertise. The information above is for coordination purposes only.</p>
            </div>
            <div>
              <Textarea label="Care Guidance / Notes (Optional)" id="guidance-notes" placeholder="Add clinical observations or care guidance..." rows={3} value={guidance} onChange={e => setGuidance(e.target.value)} />
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Modal */}
      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule Follow-up" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowSchedule(false)}>Cancel</Button><Button variant="primary" loading={loading} onClick={handleScheduleFollowUp}>Schedule</Button></>}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Schedule a follow-up appointment for <strong>{selectedReferral?.beneficiaryName}</strong></p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Input label="Time" id="sched-time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
