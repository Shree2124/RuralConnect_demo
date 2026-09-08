import React, { useState } from "react";
import { Package, AlertTriangle, Plus, Edit, TrendingDown, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, StatCard, Button, Badge, Modal, Input, Select, Tabs, EmptyState } from "../../components/ui";
import { formatDate, getStockStatusColor, getStockStatusLabel } from "../../lib/utils";
import toast from "react-hot-toast";
import type { InventoryItem } from "../../types";

export default function PharmacyDashboard() {
  const { inventory, updateInventory, addInventoryItem } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [updateQty, setUpdateQty] = useState("");
  const [form, setForm] = useState({ name: "", genericName: "", category: "", batchNumber: "", quantity: "", expiryDate: "", location: "Palghar Store", district: "Palghar", state: "Maharashtra", price: "" });
  const [loading, setLoading] = useState(false);

  const myInventory = inventory.filter(i => i.providerId === "ph1");
  const available = myInventory.filter(i => i.status === "available");
  const lowStock = myInventory.filter(i => i.status === "low_stock");
  const outOfStock = myInventory.filter(i => i.status === "out_of_stock");
  const expiring = myInventory.filter(i => i.status === "expiring_soon");

  const tabItems = { all: myInventory, available, low_stock: lowStock, out_of_stock: outOfStock, expiring_soon: expiring };
  const displayed = tabItems[activeTab as keyof typeof tabItems] || myInventory;

  // Expiry warning
  const expiryWarnings = myInventory.filter(i => {
    const days = Math.floor((new Date(i.expiryDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 30;
  });

  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.expiryDate) { toast.error("Please fill required fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    addInventoryItem({ name: form.name, genericName: form.genericName, category: form.category, batchNumber: form.batchNumber, quantity: parseInt(form.quantity), expiryDate: form.expiryDate, location: form.location, district: form.district, state: form.state, status: "available", providerId: "ph1", price: parseInt(form.price) || undefined });
    toast.success("Medicine added to inventory.");
    setShowAdd(false);
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!selected || !updateQty) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newQty = parseInt(updateQty);
    updateInventory(selected.id, { quantity: newQty, status: newQty === 0 ? "out_of_stock" : newQty < 20 ? "low_stock" : "available" });
    toast.success(`Stock updated for ${selected.name}`);
    setShowUpdate(false);
    setLoading(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pharmacy Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Community Pharmacy Palghar · Palghar, Maharashtra</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={14} />Add Medicine</Button>
      </div>

      {/* Expiry Warnings */}
      {expiryWarnings.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={15} className="text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Expiry Alerts — {expiryWarnings.length} items</p>
          </div>
          {expiryWarnings.map(i => {
            const days = Math.floor((new Date(i.expiryDate).getTime() - Date.now()) / 86400000);
            return <p key={i.id} className="text-xs text-amber-700 ml-5">{i.name} stock expires in <strong>{days} days</strong> (Batch: {i.batchNumber})</p>;
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Medicines" value={myInventory.length} icon={<Package size={20} className="text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard title="Available" value={available.length} icon={<Package size={20} className="text-emerald-600" />} iconBg="bg-emerald-100" />
        <StatCard title="Low Stock" value={lowStock.length} icon={<TrendingDown size={20} className="text-amber-600" />} iconBg="bg-amber-100" change={lowStock.length > 0 ? "Needs restock" : ""} changeType="down" />
        <StatCard title="Expiring Soon" value={expiring.length} icon={<AlertTriangle size={20} className="text-red-500" />} iconBg="bg-red-100" />
      </div>

      {/* Inventory Table */}
      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <Tabs
            tabs={[{ id: "all", label: "All", count: myInventory.length }, { id: "available", label: "Available", count: available.length }, { id: "low_stock", label: "Low Stock", count: lowStock.length }, { id: "out_of_stock", label: "Out of Stock", count: outOfStock.length }, { id: "expiring_soon", label: "Expiring", count: expiring.length }]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        {displayed.length === 0 ? (
          <EmptyState title="No medicines found" description="Add medicines to inventory." action={<Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={13} />Add Medicine</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="rc-table">
              <thead><tr><th>Medicine</th><th>Category</th><th>Batch</th><th>Qty</th><th>Expiry</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {displayed.map(i => (
                  <tr key={i.id}>
                    <td>
                      <p className="text-xs font-semibold text-slate-700">{i.name}</p>
                      <p className="text-[10px] text-slate-400">{i.genericName}</p>
                    </td>
                    <td className="text-xs text-slate-500">{i.category}</td>
                    <td className="text-xs text-slate-500 font-mono">{i.batchNumber}</td>
                    <td className="text-xs font-semibold text-slate-700">{i.quantity}</td>
                    <td className="text-xs text-slate-500">{formatDate(i.expiryDate)}</td>
                    <td className="text-xs text-slate-600">{i.price ? `₹${i.price}` : "Free"}</td>
                    <td>
                      <span className={`badge-${i.status === "available" ? "green" : i.status === "low_stock" ? "yellow" : i.status === "out_of_stock" ? "red" : "orange"} text-[10px]`}>
                        {getStockStatusLabel(i.status)}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setSelected(i); setUpdateQty(String(i.quantity)); setShowUpdate(true); }}>
                          <Edit size={11} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => { updateInventory(i.id, { status: "out_of_stock", quantity: 0 }); toast.success("Marked as unavailable."); }}>
                          ✕
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Medicine to Inventory" size="md"
        footer={<><Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" loading={loading} onClick={handleAdd}>Add Medicine</Button></>}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Medicine Name *" id="med-name" placeholder="Paracetamol 500mg" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="Generic Name" id="med-generic" placeholder="Paracetamol" value={form.genericName} onChange={e => setForm(p => ({ ...p, genericName: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Category" id="med-cat" placeholder="Analgesic" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
            <Input label="Batch Number" id="med-batch" placeholder="B2026XXX01" value={form.batchNumber} onChange={e => setForm(p => ({ ...p, batchNumber: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantity *" id="med-qty" type="number" placeholder="100" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date *</label><input type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" id="med-price" type="number" placeholder="25" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            <Input label="Location" id="med-loc" placeholder="Palghar Store" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* Update Stock Modal */}
      <Modal isOpen={showUpdate} onClose={() => setShowUpdate(false)} title={`Update Stock — ${selected?.name}`} size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowUpdate(false)}>Cancel</Button><Button variant="primary" loading={loading} onClick={handleUpdate}>Update</Button></>}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Current stock: <strong>{selected?.quantity} units</strong></p>
          <Input label="New Quantity" id="update-qty" type="number" value={updateQty} onChange={e => setUpdateQty(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
