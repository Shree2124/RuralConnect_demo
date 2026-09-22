import React from "react";
import { TrendingDown, AlertTriangle, Package, ShoppingCart } from "lucide-react";
import { Card, EmptyState, Badge, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export default function PharmacyLowStock() {
  const { inventory, updateInventory } = useApp();

  const lowItems = inventory
    .filter(i => i.status === "low_stock" || i.status === "out_of_stock")
    .sort((a, b) => a.quantity - b.quantity);

  const handleOrder = (id: string, name: string) => {
    toast.success(`Reorder request submitted for ${name}`);
  };

  const handleEmergencyRestock = (id: string, name: string, qty: number) => {
    updateInventory(id, { quantity: qty + 100, status: "available", updatedAt: new Date().toISOString() });
    toast.success(`Emergency restock of 100 units added for ${name}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Low Stock Alert</h1>
        <p className="text-slate-500 text-sm mt-0.5">{lowItems.length} medicines need immediate attention</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-l-4 border-l-red-500 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Package size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{inventory.filter(i => i.status === "out_of_stock").length}</p>
            <p className="text-xs text-slate-500">Out of Stock</p>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-400 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <TrendingDown size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{inventory.filter(i => i.status === "low_stock").length}</p>
            <p className="text-xs text-slate-500">Low Stock</p>
          </div>
        </Card>
      </div>

      {lowItems.length === 0 ? (
        <Card><EmptyState icon={<TrendingDown size={22} />} title="All stock levels healthy!" description="No items require restocking at this time." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowItems.map(item => (
            <Card key={item.id} className={`p-5 border-l-4 ${item.status === "out_of_stock" ? "border-l-red-500" : "border-l-amber-400"}`}>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={item.status === "out_of_stock" ? "red" : "yellow"}>
                  {item.status === "out_of_stock" ? "Out of Stock" : "Low Stock"}
                </Badge>
                {item.quantity === 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full">
                    <AlertTriangle size={11} /> Critical
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <p className="text-xs text-slate-500">{item.genericName} · {item.category}</p>
              <div className="mt-3 flex items-center gap-4 bg-slate-50 p-2 rounded text-sm">
                <div>
                  <p className="text-[10px] text-slate-400">Current Stock</p>
                  <p className={`font-bold text-lg ${item.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>{item.quantity}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Batch</p>
                  <p className="text-xs text-slate-600">{item.batchNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Expiry</p>
                  <p className="text-xs text-slate-600">{formatDate(item.expiryDate)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" className="flex-1 justify-center text-xs" onClick={() => handleOrder(item.id, item.name)}>
                  <ShoppingCart size={11} className="mr-1" /> Request Order
                </Button>
                <Button variant="primary" size="sm" className="flex-1 justify-center text-xs" onClick={() => handleEmergencyRestock(item.id, item.name, item.quantity)}>
                  + Emergency Restock
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
