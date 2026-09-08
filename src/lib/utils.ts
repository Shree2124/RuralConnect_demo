import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function formatTime(date: string): string {
  return format(new Date(date), "hh:mm a");
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatMobile(mobile: string): string {
  return mobile.replace(/(\d{2})(\d{5})(\d{5})/, "+91 $2 $3");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    beneficiary: "badge-green",
    field_worker: "badge-blue",
    ngo_admin: "badge-purple",
    doctor: "badge-yellow",
    pharmacy: "badge-orange",
    admin: "badge-red",
  };
  return colors[role] || "badge-gray";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    beneficiary: "Beneficiary",
    field_worker: "Field Worker",
    ngo_admin: "NGO Admin",
    doctor: "Doctor",
    pharmacy: "Pharmacy",
    admin: "Admin",
  };
  return labels[role] || role;
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    high: "badge-red",
    moderate: "badge-yellow",
    low: "badge-green",
  };
  return colors[severity] || "badge-gray";
}

export function getStockStatusColor(status: string): string {
  const colors: Record<string, string> = {
    available: "badge-green",
    low_stock: "badge-yellow",
    out_of_stock: "badge-red",
    expiring_soon: "badge-orange",
  };
  return colors[status] || "badge-gray";
}

export function getStockStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: "Available",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
    expiring_soon: "Expiring Soon",
  };
  return labels[status] || status;
}

export function getAccessibilityColor(score: number): string {
  if (score >= 70) return "#10B981";
  if (score >= 45) return "#F59E0B";
  if (score >= 25) return "#F97316";
  return "#EF4444";
}

export function generateId(): string {
  return `rc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const STATES = [
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Karnataka",
  "Odisha",
  "Haryana",
  "Himachal Pradesh",
  "Punjab",
  "Madhya Pradesh",
  "Uttar Pradesh",
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  Maharashtra: ["Palghar", "Nandurbar", "Gadchiroli", "Nashik", "Pune", "Mumbai Suburban", "Raigad", "Thane"],
  Gujarat: ["Banaskantha", "Kutch", "Dahod", "Patan", "Narmada", "Bharuch"],
  Rajasthan: ["Barmer", "Jaisalmer", "Udaipur", "Dungarpur", "Banswara", "Bikaner"],
  Karnataka: ["Bidar", "Raichur", "Koppal", "Yadgir", "Gadag", "Bagalkot"],
  Odisha: ["Kalahandi", "Koraput", "Malkangiri", "Nabarangpur", "Nuapada", "Bolangir"],
  Haryana: ["Mewat", "Palwal", "Sirsa", "Fatehabad", "Hisar", "Bhiwani"],
  "Himachal Pradesh": ["Kinnaur", "Lahaul & Spiti", "Chamba", "Kullu", "Mandi", "Kangra"],
  Punjab: ["Gurdaspur", "Pathankot", "Amritsar", "Tarn Taran", "Kapurthala", "Jalandhar"],
  "Madhya Pradesh": ["Sheopur", "Shivpuri", "Guna", "Ashok Nagar", "Betul", "Chhindwara"],
  "Uttar Pradesh": ["Shravasti", "Balrampur", "Bahraich", "Lakhimpur Kheri", "Sitapur", "Hardoi"],
};
