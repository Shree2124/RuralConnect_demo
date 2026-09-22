import { useState } from "react";
import { Calendar, Pill, MapPin, Send, Bell, Heart, Search, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Card, StatCard, EmptyState } from "../../components/ui";
import { formatDate, formatTime, getStockStatusLabel } from "../../lib/utils";
import { Link } from "react-router-dom";

const QUICK_ACTIONS = [
  { label: "Check Symptoms", icon: <Heart size={18} />, to: "/beneficiary/care-assistant", color: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100" },
  { label: "Find Medicine", icon: <Pill size={18} />, to: "/medicine-finder", color: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100" },
  { label: "Find Healthcare", icon: <MapPin size={18} />, to: "/beneficiary/find-healthcare", color: "bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100" },
  { label: "My Appointments", icon: <Calendar size={18} />, to: "/beneficiary/appointments", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
  { label: "My Referrals", icon: <Send size={18} />, to: "/beneficiary/referrals", color: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" },
];

export default function BeneficiaryDashboard() {
  const { session } = useAuth();
  const { appointments, referrals, medicines, reminders, notifications, facilities, beneficiaries } = useApp();
  const [medSearch, setMedSearch] = useState("");

  // Bridge: session.userId (u1) → beneficiary record (b1) by name match
  const myBeneficiary = beneficiaries.find(b => b.name === session?.name);
  const myBeneficiaryId = myBeneficiary?.id;

  const myAppointments = appointments.filter(a => a.beneficiaryId === myBeneficiaryId && a.status === "scheduled").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const myReferrals = referrals.filter(r => r.beneficiaryId === myBeneficiaryId);
  const myNotifications = notifications.filter(n => n.userId === session?.userId && !n.isRead).slice(0, 4);
  const filteredMeds = medicines.filter(m =>
    m.name.toLowerCase().includes(medSearch.toLowerCase()) ||
    m.genericName.toLowerCase().includes(medSearch.toLowerCase())
  ).slice(0, 4);

  // Dynamic Care Timeline — reminders use status "active"/"sent" (not "pending")
  const todayReminders = reminders.filter(r => r.beneficiaryId === myBeneficiaryId && (r.status === "active" || r.status === "sent")).slice(0, 2);

  const careTimeline = [
    {
      date: "Today",
      items: [
        ...todayReminders.map(r => ({ time: r.dueTime ?? "—", text: `${r.title}: ${r.description}`, type: "medicine" })),
        ...(myAppointments.length > 0 ? [{ time: myAppointments[0].time ?? formatTime(myAppointments[0].date), text: `Appointment: ${myAppointments[0].facilityName}`, type: "appointment" }] : [])
      ]
    },
    {
      date: "Upcoming",
      items: myAppointments.slice(1, 3).map(a => ({ time: formatDate(a.date), text: `Visit: ${a.facilityName}`, type: "appointment" }))
    }
  ].filter(g => g.items.length > 0);

  // Dynamic Nearby Services
  const nearbyServices = facilities.slice(0, 5).map(f => ({
    name: f.name,
    type: f.type.replace("_", " "),
    distance: (Math.random() * 8 + 1).toFixed(1) + " km",
    status: f.operationalStatus === "operational" ? "Open" : "Limited"
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{greeting}, {session?.name?.split(" ")[0]} 👋</h1>
          <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
            <MapPin size={13} className="text-blue-400" />
            Palghar, Maharashtra
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-blue text-xs hidden sm:block">Ayushman ID: AY-MH-20240041</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard title="Upcoming" value={myAppointments.length > 0 ? formatDate(myAppointments[0].date) : "None"} icon={<Calendar size={20} className="text-blue-600" />} iconBg="bg-blue-100" subtitle={myAppointments[0]?.facilityName || ""} />
        <StatCard title="Reminders" value={`${todayReminders.length} Today`} icon={<Pill size={20} className="text-purple-600" />} iconBg="bg-purple-100" subtitle={todayReminders.length > 0 ? `Next: ${todayReminders[0].dueTime ?? "—"}` : "All caught up"} />
        <StatCard title="Active Referrals" value={myReferrals.filter(r => r.status !== "completed").length.toString()} icon={<Send size={20} className="text-amber-600" />} iconBg="bg-amber-100" />
        <StatCard title="Notifications" value={myNotifications.length.toString()} icon={<Bell size={20} className="text-red-500" />} iconBg="bg-red-100" />
      </div>

      {/* Quick Actions */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.label} to={a.to} className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all text-xs font-medium ${a.color}`}>
              {a.icon}
              {a.label}
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Care Timeline */}
        <div className="lg:col-span-1">
          <Card>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Care Timeline</h2>
              <Link to="/beneficiary/reminders" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="px-5 py-4 space-y-4">
              {careTimeline.length === 0 ? (
                <EmptyState title="No scheduled care" description="You have no upcoming appointments or reminders." />
              ) : careTimeline.map((group) => (
                <div key={group.date}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{group.date}</p>
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 mb-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === "medicine" ? "bg-purple-100 text-purple-600" : item.type === "appointment" ? "bg-blue-100 text-blue-600" : "bg-teal-100 text-teal-600"}`}>
                        {item.type === "medicine" ? <Pill size={12} /> : item.type === "appointment" ? <Calendar size={12} /> : <Heart size={12} />}
                      </div>
                      <div>
                        <p className="text-xs text-slate-700 font-medium">{item.text}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={9} />{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Nearby Services */}
        <div className="lg:col-span-1">
          <Card>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Nearby Services</h2>
              <Link to="/beneficiary/find-healthcare" className="text-xs text-blue-600 hover:underline">View map</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {nearbyServices.length === 0 ? (
                <EmptyState title="No services found" description="Cannot locate nearby healthcare facilities." />
              ) : nearbyServices.map((s) => (
                <div key={s.name} className="px-5 py-3 hover:bg-blue-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 capitalize">{s.type}</span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><MapPin size={8} />{s.distance}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.status === "Open" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1">
          <Card>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Notifications</h2>
              <Link to="/notifications" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {myNotifications.length === 0 ? (
                <EmptyState title="All caught up!" description="No new notifications." />
              ) : myNotifications.map(n => (
                <div key={n.id} className="px-5 py-3 hover:bg-blue-50/40 transition-colors">
                  <p className="text-xs font-semibold text-slate-700">{n.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Medicine Finder Snippet */}
      <Card>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Medicine Finder</h2>
          <Link to="/medicine-finder" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            Full search <ArrowRight size={11} />
          </Link>
        </div>
        <div className="px-5 py-4">
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={medSearch}
              onChange={e => setMedSearch(e.target.value)}
              placeholder="Search medicine... e.g. Paracetamol"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          {medSearch && (
            <div className="space-y-2">
              {filteredMeds.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No medicine found</p>
              ) : filteredMeds.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.providerName} · {m.location} · {m.distance}km</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.price ? <span className="text-xs font-medium text-slate-600">₹{m.price}</span> : <span className="text-xs text-emerald-600 font-medium">Free</span>}
                    <span className={`badge-${m.stockStatus === "available" ? "green" : m.stockStatus === "low_stock" ? "yellow" : m.stockStatus === "out_of_stock" ? "red" : "orange"} text-[10px]`}>
                      {getStockStatusLabel(m.stockStatus)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!medSearch && (
            <p className="text-xs text-slate-400 text-center py-2">Type a medicine name to find availability</p>
          )}
        </div>
      </Card>
    </div>
  );
}
