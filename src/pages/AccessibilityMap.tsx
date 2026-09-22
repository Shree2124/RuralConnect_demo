import React, { useEffect, useRef, useState } from "react";
import { MapPin, Filter, Layers } from "lucide-react";
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

      // Accessibility zones (mocking if not present)
      const mockZone = facility.accessibilityZone || {
        radius: Math.random() * 15 + 5, // 5 to 20 km
        color: ["green", "yellow", "orange", "red"][Math.floor(Math.random() * 4)] as any,
      };

      if (showZones && mockZone) {
        const zoneColor = ZONE_COLORS[mockZone.color] || "rgba(59,130,246,0.1)";
        L.circle([facility.lat, facility.lng], {
          radius: mockZone.radius * 1000,
          fillColor: zoneColor,
          color: mockZone.color === "red" ? "#EF4444" : mockZone.color === "orange" ? "#F97316" : mockZone.color === "yellow" ? "#F59E0B" : "#10B981",
          weight: 1,
          opacity: 0.3,
          fillOpacity: 0.15,
        }).addTo(mapInstance.current);
      }
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
        <div className="space-y-3">
          {/* Selected Facility */}
          {selected ? (
            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800 leading-tight">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 ml-2">✕</button>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-700 font-medium">{selected.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">District</span>
                  <span className="text-slate-700">{selected.district}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">State</span>
                  <span className="text-slate-700">{selected.state}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Services</span>
                  <span className="text-slate-700 text-right text-[10px]">{selected.services?.slice(0, 2).join(", ")}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Status</span>
                  <span className={`badge-${selected.operationalStatus === "operational" ? "green" : "yellow"} text-[10px]`}>{selected.operationalStatus}</span>
                </div>
                {selected.contactNumber && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Phone</span>
                    <a href={`tel:${selected.contactNumber}`} className="text-blue-600 font-medium">{selected.contactNumber}</a>
                  </div>
                )}
                {selected.doctorCount !== undefined && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Doctors</span>
                    <span className="text-slate-700">{selected.doctorCount}</span>
                  </div>
                )}
                {selected.bedCapacity && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Beds</span>
                    <span className="text-slate-700">{selected.bedCapacity}</span>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <p className="text-xs text-slate-500 text-center py-4">Click on a facility to view details</p>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-slate-700 mb-3">Facilities Shown</h3>
            {Object.entries(FACILITY_COLORS).map(([type, color]) => {
              const count = filtered.filter(f => f.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-slate-600 text-[10px]">{type === "Ayushman Arogya Mandir" ? "Arogya Mandir" : type}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{count}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
