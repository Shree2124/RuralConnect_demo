import React, { useState } from "react";
import { Search, Filter, Package, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, Button, Select, Badge, EmptyState, Skeleton } from "../components/ui";
import { getStockStatusColor, getStockStatusLabel, STATES, DISTRICTS_BY_STATE } from "../lib/utils";
import { cn } from "../lib/utils";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Analgesic", "Antibiotic", "Antimalarial", "Antidiabetic", "Antihypertensive", "Electrolyte", "Supplement", "Respiratory", "Antacid", "Vitamin"];

export default function MedicineFinder() {
  const { medicines } = useApp();
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = medicines.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === "All" || m.state === filterState;
    const matchCat = filterCategory === "All" || m.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchStatus = filterStatus === "All" || m.stockStatus === filterStatus;
    return matchSearch && matchState && matchCat && matchStatus;
  });

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const handleRequest = (medName: string, provider: string) => {
    toast.success(`Medicine request sent for ${medName} from ${provider}. You will be notified when confirmed.`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Medicine Finder</h1>
        <p className="text-slate-500 text-sm mt-0.5">Find medicine availability from pharmacies, NGOs, and healthcare facilities</p>
        <p className="text-[10px] text-slate-400 mt-0.5">⚠️ Prototype — all stock data is simulated for demonstration purposes</p>
      </div>

      {/* Search & Filters */}
      <Card className="p-5">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); handleSearch(); }}
              placeholder="Search medicine... e.g. Paracetamol"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <Select
            id="filter-state"
            options={[{ value: "All", label: "All States" }, ...STATES.map(s => ({ value: s, label: s }))]}
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="min-w-36"
          />
          <Select
            id="filter-cat"
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="min-w-36"
          />
          <Select
            id="filter-status"
            options={[{ value: "All", label: "All Status" }, { value: "available", label: "Available" }, { value: "low_stock", label: "Low Stock" }, { value: "out_of_stock", label: "Out of Stock" }, { value: "expiring_soon", label: "Expiring Soon" }]}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="min-w-36"
          />
        </div>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{filtered.length} medicines found</p>
        <div className="flex gap-2">
          {["available", "low_stock", "out_of_stock", "expiring_soon"].map(status => (
            <div key={status} className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", status === "available" ? "bg-emerald-500" : status === "low_stock" ? "bg-amber-500" : status === "out_of_stock" ? "bg-red-500" : "bg-orange-500")} />
              <span className="text-[10px] text-slate-500">{getStockStatusLabel(status)}</span>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Package size={22} />} title="No medicine found" description="Try adjusting your search or filters. Not all medicines are available in all regions." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <Card key={m.id} className="p-4 hover:shadow-card-hover transition-all" hover>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{m.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Generic: {m.genericName}</p>
                  <span className="badge-gray text-[10px] mt-1">{m.category}</span>
                </div>
                <span className={cn(
                  "badge-",
                  m.stockStatus === "available" ? "green" : m.stockStatus === "low_stock" ? "yellow" : m.stockStatus === "out_of_stock" ? "red" : "orange",
                  "text-[10px] ml-1"
                ) + `badge-${m.stockStatus === "available" ? "green" : m.stockStatus === "low_stock" ? "yellow" : m.stockStatus === "out_of_stock" ? "red" : "orange"} text-[10px]`}>
                  {getStockStatusLabel(m.stockStatus)}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Stock</span>
                  <span className={cn("font-semibold", m.quantity === 0 ? "text-red-600" : m.quantity < 20 ? "text-amber-600" : "text-slate-700")}>
                    {m.quantity === 0 ? "Unavailable" : `${m.quantity} units`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Provider</span>
                  <span className="text-slate-700 text-right truncate ml-2">{m.providerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Location</span>
                  <span className="text-slate-700 flex items-center gap-0.5">
                    <MapPin size={9} className="text-blue-400" />{m.district}
                  </span>
                </div>
                {m.distance && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Distance</span>
                    <span className="text-blue-600 font-medium">{m.distance} km</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Price</span>
                  <span className={cn("font-semibold", m.price ? "text-slate-700" : "text-emerald-600")}>
                    {m.price ? `₹${m.price}` : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Last updated</span>
                  <span className="text-slate-400">{new Date(m.lastUpdated).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 justify-center"
                  disabled={m.stockStatus === "out_of_stock"}
                  onClick={() => handleRequest(m.name, m.providerName)}
                >
                  Request Medicine
                </Button>
                <Button variant="secondary" size="sm" onClick={() => toast(`${m.name} — Provider: ${m.providerName}, Location: ${m.location}`)}>
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
