import React, { useState } from "react";
import { ClipboardList, CheckCircle, XCircle, Clock, Search, Package } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

// Simulated medicine requests from beneficiaries/field workers
const MOCK_REQUESTS = [
  { id: "mreq1", requesterName: "Meena Patil", requesterId: "b1", medicineName: "Paracetamol 500mg", quantity: 10, reason: "Fever treatment", status: "pending", createdAt: "2026-09-08T09:00:00", district: "Palghar" },
  { id: "mreq2", requesterName: "Rajesh Kumar (Field Worker)", requesterId: "u2", medicineName: "ORS Sachet", quantity: 20, reason: "Dehydration cases in village", status: "pending", createdAt: "2026-09-08T07:30:00", district: "Palghar" },
  { id: "mreq3", requesterName: "Asha Shinde", requesterId: "b3", medicineName: "Iron Folic Acid", quantity: 30, reason: "Antenatal supplementation", status: "fulfilled", createdAt: "2026-09-07T11:00:00", district: "Nandurbar" },
  { id: "mreq4", requesterName: "Kavita Jadhav", requesterId: "b5", medicineName: "Paracetamol 500mg", quantity: 5, reason: "Fever and body ache", status: "pending", createdAt: "2026-09-08T10:00:00", district: "Gadchiroli" },
  { id: "mreq5", requesterName: "Sunita Yadav (Field Worker)", requesterId: "u7", medicineName: "Chloroquine 250mg", quantity: 15, reason: "Malaria cases — Barmer", status: "declined", createdAt: "2026-09-06T15:00:00", district: "Barmer" },
  { id: "mreq6", requesterName: "Ramesh Pawar", requesterId: "b2", medicineName: "Amoxicillin 500mg", quantity: 7, reason: "Respiratory infection", status: "fulfilled", createdAt: "2026-09-05T08:00:00", district: "Palghar" },
  { id: "mreq7", requesterName: "Pushpa Bai", requesterId: "b7", medicineName: "Metformin 500mg", quantity: 30, reason: "Diabetes management refill", status: "pending", createdAt: "2026-09-08T06:00:00", district: "Barmer" },
];

export default function PharmacyRequests() {
  const { medicines } = useApp();
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = requests
    .filter(r =>
      (filter === "all" || r.status === filter) &&
      (r.requesterName.toLowerCase().includes(search.toLowerCase()) ||
       r.medicineName.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleFulfill = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "fulfilled" } : r));
    toast.success("Request marked as fulfilled!");
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "declined" } : r));
    toast.error("Request declined.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Medicine Requests</h1>
          <p className="text-slate-500 text-sm mt-0.5">{requests.filter(r => r.status === "pending").length} pending · {filtered.length} shown</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search requester or medicine..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "fulfilled", "declined"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && <span className="ml-1 opacity-60">({requests.filter(r => r.status === s).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<ClipboardList size={22} />} title="No requests found" description="No medicine requests match your filter." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(req => {
            const inStock = medicines.find(m => m.name.toLowerCase() === req.medicineName.toLowerCase());
            return (
              <Card key={req.id} className={`p-5 border-l-4 ${req.status === "pending" ? "border-l-amber-400" : req.status === "fulfilled" ? "border-l-emerald-400" : "border-l-red-400"}`}>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={req.status === "pending" ? "yellow" : req.status === "fulfilled" ? "green" : "red"}>
                    {req.status}
                  </Badge>
                  <span className="text-[10px] text-slate-400">{formatDate(req.createdAt)}</span>
                </div>
                <h3 className="font-semibold text-slate-800">{req.medicineName}</h3>
                <p className="text-xs text-slate-500 mt-1">Requested by: <strong>{req.requesterName}</strong></p>
                <p className="text-xs text-slate-500">Qty: <strong>{req.quantity} units</strong> · {req.district}</p>
                <p className="text-xs text-slate-600 bg-slate-50 px-2 py-1.5 rounded mt-2 italic">"{req.reason}"</p>
                {inStock && (
                  <p className="text-xs mt-2 text-emerald-700 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                    <Package size={11} /> In stock: {inStock.quantity} units
                  </p>
                )}
                {req.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" size="sm" className="flex-1 justify-center text-xs" onClick={() => handleFulfill(req.id)}>
                      <CheckCircle size={11} className="mr-1" /> Fulfill
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1 justify-center text-xs" onClick={() => handleDecline(req.id)}>
                      <XCircle size={11} className="mr-1" /> Decline
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
