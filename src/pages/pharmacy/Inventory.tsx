import React, { useState } from "react";
import { Package, Search, TrendingDown, Plus, Edit, BarChart2 } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

const STATUS_VARIANT: Record<string, "green" | "yellow" | "red" | "orange"> = {
  available: "green", low_stock: "yellow", out_of_stock: "red", expiring_soon: "orange",
};
const STATUS_LABELS: Record<string, string> = {
  available: "Available", low_stock: "Low Stock", out_of_stock: "Out of Stock", expiring_soon: "Expiring Soon",
};

export default function PharmacyInventory() {
  const { session } = useAuth();
  const { inventory, updateInventory } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const myInventory = inventory
    .filter(i =>
      (filter === "all" || i.status === filter) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
       i.genericName.toLowerCase().includes(search.toLowerCase()) ||
       i.category.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleRestock = (id: string, current: number) => {
    const added = Math.floor(Math.random() * 50) + 50;
    updateInventory(id, { quantity: current + added, status: "available", updatedAt: new Date().toISOString() });
    toast.success(`Restocked +${added} units!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Full Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5">{myInventory.length} items shown</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Search medicine..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-52"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "available", "low_stock", "out_of_stock", "expiring_soon"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s === "all" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = inventory.filter(i => i.status === key).length;
          return (
            <Card key={key} className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </Card>
          );
        })}
      </div>

      {myInventory.length === 0 ? (
        <Card><EmptyState icon={<Package size={22} />} title="No items found" description="Try adjusting your search or filter." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="rc-table">
              <thead>
                <tr><th>Medicine</th><th>Category</th><th>Qty</th><th>Batch</th><th>Expiry</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {myInventory.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.genericName}</div>
                    </td>
                    <td className="text-slate-500 text-xs">{item.category}</td>
                    <td>
                      <span className={`font-semibold ${item.quantity === 0 ? "text-red-600" : item.quantity < 20 ? "text-amber-600" : "text-slate-800"}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">{item.batchNumber}</td>
                    <td className="text-xs text-slate-500">{formatDate(item.expiryDate)}</td>
                    <td><Badge variant={STATUS_VARIANT[item.status] ?? "gray"}>{STATUS_LABELS[item.status]}</Badge></td>
                    <td>
                      <Button variant="secondary" size="sm" onClick={() => handleRestock(item.id, item.quantity)}>
                        + Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
