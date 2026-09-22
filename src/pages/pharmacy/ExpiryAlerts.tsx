import React from "react";
import { Clock, AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

function daysUntilExpiry(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PharmacyExpiryAlerts() {
  const { inventory, updateInventory } = useApp();

  const expiryItems = inventory
    .filter(i => i.status === "expiring_soon" || daysUntilExpiry(i.expiryDate) <= 60)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const handleMarkDisposed = (id: string, name: string) => {
    updateInventory(id, { quantity: 0, status: "out_of_stock", updatedAt: new Date().toISOString() });
    toast.success(`${name} marked as disposed.`);
  };

  const handleExtend = (id: string, name: string) => {
    toast.error(`Cannot extend expiry for ${name}. Please contact supplier.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Expiry Alerts</h1>
        <p className="text-slate-500 text-sm mt-0.5">{expiryItems.length} medicines approaching or past expiry</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Expired", count: expiryItems.filter(i => daysUntilExpiry(i.expiryDate) < 0).length, color: "border-l-red-500 text-red-700" },
          { label: "< 30 Days", count: expiryItems.filter(i => { const d = daysUntilExpiry(i.expiryDate); return d >= 0 && d < 30; }).length, color: "border-l-orange-500 text-orange-700" },
          { label: "< 60 Days", count: expiryItems.filter(i => { const d = daysUntilExpiry(i.expiryDate); return d >= 30 && d < 60; }).length, color: "border-l-amber-400 text-amber-700" },
        ].map(s => (
          <Card key={s.label} className={`p-4 border-l-4 ${s.color.split(" ")[0]}`}>
            <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {expiryItems.length === 0 ? (
        <Card><EmptyState icon={<Clock size={22} />} title="No expiry alerts!" description="All inventory is well within expiry dates." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expiryItems.map(item => {
            const days = daysUntilExpiry(item.expiryDate);
            const isExpired = days < 0;
            const isUrgent = days >= 0 && days < 30;
            return (
              <Card key={item.id} className={`p-5 border-l-4 ${isExpired ? "border-l-red-600" : isUrgent ? "border-l-orange-500" : "border-l-amber-400"}`}>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={isExpired ? "red" : isUrgent ? "orange" : "yellow"}>
                    {isExpired ? "Expired" : `${days} days left`}
                  </Badge>
                  {isExpired && <AlertTriangle size={16} className="text-red-500" />}
                </div>
                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.genericName} · {item.category}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded text-xs">
                  <div><p className="text-[10px] text-slate-400">Qty</p><p className="font-semibold text-slate-800">{item.quantity}</p></div>
                  <div><p className="text-[10px] text-slate-400">Batch</p><p className="text-slate-600">{item.batchNumber}</p></div>
                  <div><p className="text-[10px] text-slate-400">Expires</p><p className={`font-medium ${isExpired ? "text-red-600" : "text-slate-600"}`}>{formatDate(item.expiryDate)}</p></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" size="sm" className="flex-1 justify-center text-xs" onClick={() => handleExtend(item.id, item.name)}>
                    <RefreshCw size={11} className="mr-1" /> Contact Supplier
                  </Button>
                  <Button variant="danger" size="sm" className="flex-1 justify-center text-xs" onClick={() => handleMarkDisposed(item.id, item.name)}>
                    <Trash2 size={11} className="mr-1" /> Mark Disposed
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
