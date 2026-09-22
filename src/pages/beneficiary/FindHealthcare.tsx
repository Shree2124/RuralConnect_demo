import { useState } from "react";
import { MapPin, Search, Navigation, Phone, Clock, BedDouble, Stethoscope } from "lucide-react";
import { Card, EmptyState, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";

const TYPE_LABELS: Record<string, string> = {
  phc: "PHC",
  chc: "CHC",
  district_hospital: "District Hospital",
  sub_centre: "Sub Centre",
  arogya_mandir: "Arogya Mandir",
  ngo_camp: "NGO Camp",
  pharmacy: "Pharmacy",
  private_clinic: "Private Clinic",
};

const TYPE_COLOR: Record<string, string> = {
  phc: "bg-blue-50 text-blue-700",
  chc: "bg-indigo-50 text-indigo-700",
  district_hospital: "bg-purple-50 text-purple-700",
  sub_centre: "bg-slate-100 text-slate-600",
  arogya_mandir: "bg-teal-50 text-teal-700",
  ngo_camp: "bg-emerald-50 text-emerald-700",
  pharmacy: "bg-amber-50 text-amber-700",
  private_clinic: "bg-rose-50 text-rose-700",
};

// Stable distances seeded by facility id so they don't re-shuffle on re-render
function seedDist(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 140) / 10 + 0.5).toFixed(1);
}

export default function FindHealthcare() {
  const { facilities } = useApp();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const allTypes = ["all", ...Array.from(new Set(facilities.map((f) => f.type)))];

  const filtered = facilities.filter(
    (f) =>
      (filterType === "all" || f.type === filterType) &&
      (f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.district.toLowerCase().includes(search.toLowerCase()) ||
        f.state.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Healthcare Facilities</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
            <MapPin size={13} className="text-blue-400" />
            Showing facilities in Palghar District
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, district or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${filterType === type
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            {type === "all" ? "All Facilities" : TYPE_LABELS[type] ?? type}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MapPin size={22} />}
            title="No facilities found"
            description="Try adjusting your search or clearing the filter."
          />
        </Card>
      ) : (
        <div className="card-grid-3">
          {filtered.map((f) => (
            <Card key={f.id} className="p-0 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* Card header band */}
              <div className={`px-4 py-2 flex items-center justify-between ${TYPE_COLOR[f.type] ?? "bg-slate-50 text-slate-600"}`}>
                <span className="text-xs font-semibold">{TYPE_LABELS[f.type] ?? f.type}</span>
                <span className="text-xs flex items-center gap-1 font-medium">
                  <MapPin size={10} /> {seedDist(f.id)} km
                </span>
              </div>

              <div className="p-4 flex-1">
                <h3 className="font-semibold text-slate-800 leading-tight">{f.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{f.district}, {f.state}</p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {f.doctors !== undefined && f.doctors > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Stethoscope size={12} className="text-blue-400" /> {f.doctors} Doctor{f.doctors !== 1 ? "s" : ""}
                    </div>
                  )}
                  {f.beds !== undefined && f.beds > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <BedDouble size={12} className="text-indigo-400" /> {f.beds} Beds
                    </div>
                  )}
                </div>

                {/* Services */}
                {f.services && f.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {f.services.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {s}
                      </span>
                    ))}
                    {f.services.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        +{f.services.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="mt-3 space-y-1.5">
                  {f.contactNumber && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={11} className="text-slate-400" />
                      <a href={`tel:${f.contactNumber}`} className="text-blue-600 hover:underline">
                        {f.contactNumber}
                      </a>
                    </div>
                  )}
                  {f.operatingHours && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={11} className="text-slate-400" /> {f.operatingHours}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 justify-center text-xs py-1.5">
                  Details
                </Button>
                <Button variant="primary" size="sm" className="flex-1 justify-center text-xs py-1.5">
                  <Navigation size={11} className="mr-1" /> Directions
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
