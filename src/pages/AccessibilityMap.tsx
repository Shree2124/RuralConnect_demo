import React, { useEffect, useRef, useState } from "react";
import { MapPin, Filter, Layers, Globe, Map, Activity, AlertTriangle, ArrowRight, TrendingUp, Clock, Users, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, Button, Select, Badge } from "../components/ui";
import { cn } from "../lib/utils";
import type { HealthcareFacility } from "../types";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet
let L: any = null;

const FACILITY_COLORS: Record<string, string> = {
  "PHC": "#3B82F6",
  "CHC": "#8B5CF6",
  "District Hospital": "#EF4444",
  "Sub-Centre": "#10B981",
  "Ayushman Arogya Mandir": "#F59E0B",
  "Community Health Centre": "#8B5CF6",
};

const ZONE_COLORS: Record<string, string> = {
  "red": "rgba(239,68,68,0.15)",
  "orange": "rgba(249,115,22,0.15)",
  "yellow": "rgba(245,158,11,0.15)",
  "green": "rgba(16,185,129,0.1)",
};

const FILTER_OPTIONS = [
  { value: "All", label: "All Facilities" },
  { value: "PHC", label: "PHC" },
  { value: "CHC", label: "CHC" },
  { value: "District Hospital", label: "District Hospital" },
  { value: "Sub-Centre", label: "Sub-Centre" },
  { value: "Ayushman Arogya Mandir", label: "Arogya Mandir" },
];

export default function AccessibilityMap() {
  const { facilities } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [filterType, setFilterType] = useState("All");
  const [showZones, setShowZones] = useState(true);
  const [selected, setSelected] = useState<HealthcareFacility | null>(null);
  const [loading, setLoading] = useState(true);

  const filtered = filterType === "All" ? facilities : facilities.filter(f => f.type === filterType);

  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then(leaflet => {
      L = leaflet.default;
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      // Ensure CSS is loaded natively
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (mapRef.current && !mapInstance.current) {
        const map = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);
        mapInstance.current = map;

        // Force Leaflet to recalculate map size to fix tile loading issue
        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        }, 300);

        setLoading(false);
      }
    }).catch(() => setLoading(false));
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add markers when facilities or filter changes
  useEffect(() => {
    if (!mapInstance.current || !L) return;
    mapInstance.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // 1. Draw zones first (bottom layer)
    filtered.forEach(facility => {
      const isHub = facility.type.includes("Hospital") || facility.type.includes("CHC");
      const baseRadius = isHub ? 25 : 12;

      const mockZone = {
        radius: baseRadius + Math.random() * 5,
        color: isHub ? "green" : ["green", "yellow", "orange", "red"][Math.floor(Math.random() * 4)] as any,
      };

      if (showZones && mockZone) {
        // Multi-layer circles for a "gradient" heatmap look
        const layers = 3;
        for (let i = 1; i <= layers; i++) {
          const zoneColor = mockZone.color === "red" ? "rgba(239,68,68,0.2)" : mockZone.color === "orange" ? "rgba(249,115,22,0.2)" : mockZone.color === "yellow" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.15)";
          const strokeColor = mockZone.color === "red" ? "#EF4444" : mockZone.color === "orange" ? "#F97316" : mockZone.color === "yellow" ? "#F59E0B" : "#10B981";

          L.circle([facility.lat, facility.lng], {
            radius: (mockZone.radius * 1000) * (i / layers),
            fillColor: zoneColor,
            color: strokeColor,
            weight: i === layers ? 1 : 0,
            opacity: 0.4,
            fillOpacity: 0.3 / i,
            interactive: false,
          }).addTo(mapInstance.current);
        }
      }
    });

    // 2. Draw facility markers on top
    filtered.forEach(facility => {
      const color = FACILITY_COLORS[facility.type] || "#3B82F6";
      const circle = L.circleMarker([facility.lat, facility.lng], {
        radius: 8,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(mapInstance.current);

      circle.bindTooltip(`<b>${facility.name}</b><br/>${facility.type}<br/>${facility.district}, ${facility.state}`, {
        permanent: false,
        className: "leaflet-tooltip-custom",
      });

      circle.on("click", () => {
        const fac = facilities.find(f => f.id === facility.id);
        if (fac) setSelected(fac);
      });
    });
  }, [filtered, showZones, L]);

  return (
    <div className="space-y-4 animate-fade-in h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Healthcare Accessibility Map</h1>
          <p className="text-slate-500 text-sm mt-0.5">{facilities.length} facilities across India</p>
        </div>
        <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
          Prototype — Simulated facility data
        </div>
      </div>

      {/* Legend & Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select id="map-filter" options={FILTER_OPTIONS} value={filterType} onChange={e => setFilterType(e.target.value)} className="min-w-36 text-xs" />
        <Button variant={showZones ? "primary" : "secondary"} size="sm" onClick={() => setShowZones(!showZones)}>
          <Layers size={13} /> {showZones ? "Hide" : "Show"} Zones
        </Button>
        <div className="flex flex-wrap gap-2 ml-2">
          {Object.entries(FACILITY_COLORS).slice(0, 5).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: color }} />
              <span className="text-[10px] text-slate-500">{type === "Ayushman Arogya Mandir" ? "Arogya Mandir" : type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Legend */}
      {showZones && (
        <div className="flex gap-3 flex-wrap text-[10px] text-slate-500 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
          <span className="font-medium">Accessibility Zones:</span>
          {[{ color: "bg-emerald-200", label: "Good access (0-5km)" }, { color: "bg-amber-200", label: "Limited (5-10km)" }, { color: "bg-orange-300", label: "Poor (10-20km)" }, { color: "bg-red-300", label: "Very limited (>20km)" }].map(z => (
            <div key={z.label} className="flex items-center gap-1">
              <span className={cn("w-3 h-3 rounded-full opacity-60", z.color)} />
              {z.label}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 relative h-[500px] rounded-xl overflow-hidden border border-blue-50 shadow-sm">
          {loading && (
            <div className="absolute inset-0 bg-slate-100 z-[1000] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500">Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Data Flow Panel */}
          <Card className="p-4 bg-slate-800 text-slate-100 border-slate-700 shadow-md">
            <h3 className="text-sm font-semibold mb-4 flex items-center justify-between text-slate-200">
              Data Flow <Activity size={14} className="text-blue-400" />
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-blue-400" />
                  <span className="text-slate-300">WorldPop</span>
                </div>
                <ArrowRight size={14} className="text-slate-500" />
                <span className="text-slate-200 font-medium">Population Distribution</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-emerald-400" />
                  <span className="text-slate-300">OpenStreetMap</span>
                </div>
                <ArrowRight size={14} className="text-slate-500" />
                <span className="text-slate-200 font-medium">Roads + Facilities</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-400" />
                  <span className="text-slate-300">Modified 2SFCA</span>
                </div>
                <ArrowRight size={14} className="text-slate-500" />
                <span className="text-slate-200 font-medium text-right leading-tight max-w-[120px]">Supply vs Demand + Travel Accessibility</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-purple-400" />
                  <span className="text-slate-300">Final Output</span>
                </div>
                <ArrowRight size={14} className="text-slate-500" />
                <span className="text-slate-200 font-semibold text-right">Accessibility Heatmap</span>
              </div>
            </div>
          </Card>

          {/* Modified 2SFCA Analysis */}
          <Card className="p-4 bg-white border-slate-200 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-700 mb-4">Modified 2SFCA Accessibility Analysis</h3>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mb-2">
              <div className="flex flex-col items-center gap-1 text-center">
                <Users size={16} className="text-blue-500" />
                <span className="text-[9px] font-medium text-slate-600">Population<br />Demand</span>
              </div>
              <Plus size={12} className="text-slate-400" />
              <div className="flex flex-col items-center gap-1 text-center">
                <MapPin size={16} className="text-emerald-500" />
                <span className="text-[9px] font-medium text-slate-600">Healthcare<br />Supply</span>
              </div>
              <Plus size={12} className="text-slate-400" />
              <div className="flex flex-col items-center gap-1 text-center">
                <Clock size={16} className="text-amber-500" />
                <span className="text-[9px] font-medium text-slate-600">Travel<br />Time</span>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
              <div className="flex flex-col items-center gap-1 text-center">
                <Activity size={16} className="text-purple-500" />
                <span className="text-[9px] font-bold text-slate-800">Accessibility<br />Score</span>
              </div>
            </div>
          </Card>

          {/* Underserved Zone Alert */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertTriangle size={64} className="text-red-500 rotate-12 scale-150 transform transition-transform group-hover:scale-110" />
            </div>
            <div className="flex items-start gap-3 relative z-10">
              <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-red-700 mb-1 tracking-wide uppercase">Underserved Zone Detected</h4>
                <p className="text-[11px] text-red-800/80 leading-relaxed font-medium pr-4">
                  High population demand + Limited nearby healthcare capacity.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Facility Details (Keep at bottom just in case) */}
          {selected && (
            <Card className="p-4 border-blue-100 bg-blue-50/50">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-800">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 ml-2">✕</button>
              </div>
              <div className="text-[10px] text-slate-600 space-y-1.5">
                <div className="flex justify-between"><span>Type:</span> <span className="font-medium text-slate-800">{selected.type}</span></div>
                <div className="flex justify-between"><span>District:</span> <span>{selected.district}</span></div>
                <div className="flex justify-between"><span>Status:</span> <span className={`font-medium ${selected.operationalStatus === "operational" ? "text-emerald-600" : "text-amber-600"}`}>{selected.operationalStatus}</span></div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
