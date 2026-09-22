import React from "react";
import { Package, Edit, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button } from "../../components/ui";
import { formatDate } from "../../lib/utils";

export default function NGOInventory() {
  const { inventory } = useApp();
  // We can filter by NGO ID if we had one assigned. Let's just show all for NGO demo, or mock it.
  const myInventory = inventory.slice(0, 10); // just taking a subset to mock NGO inventory

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">NGO Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage medicines and supplies for distribution and health camps.</p>
        </div>
        <Button variant="primary" size="sm">Add Stock</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="rc-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Item Name</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Batch Number</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Expiry Date</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myInventory.map(item => (
                <tr key={item.id} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.genericName}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{item.category}</td>
                  <td className="px-5 py-3 text-xs text-slate-600 font-mono">{item.batchNumber}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-700">{item.quantity}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{formatDate(item.expiryDate)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${item.status === "available" ? "green" : item.status === "low_stock" ? "yellow" : "red"} text-xs uppercase`}>
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {myInventory.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-slate-400">No inventory found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
