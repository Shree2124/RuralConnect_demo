import type { UserRole, Permission } from "../types";

export const PERMISSIONS: Permission[] = [
  // Cases
  { key: "view_cases", label: "View Cases", category: "Cases", roles: { beneficiary: false, field_worker: true, ngo_admin: true, doctor: true, pharmacy: false, admin: true } },
  { key: "create_case", label: "Create Case", category: "Cases", roles: { beneficiary: false, field_worker: true, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
  { key: "edit_case", label: "Edit Case", category: "Cases", roles: { beneficiary: false, field_worker: true, ngo_admin: false, doctor: true, pharmacy: false, admin: true } },
  { key: "close_case", label: "Close Case", category: "Cases", roles: { beneficiary: false, field_worker: false, ngo_admin: false, doctor: true, pharmacy: false, admin: true } },
  // Beneficiaries
  { key: "view_beneficiaries", label: "View Beneficiaries", category: "Beneficiaries", roles: { beneficiary: false, field_worker: true, ngo_admin: true, doctor: true, pharmacy: false, admin: true } },
  { key: "register_beneficiary", label: "Register Beneficiary", category: "Beneficiaries", roles: { beneficiary: false, field_worker: true, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
  { key: "edit_beneficiary", label: "Edit Beneficiary", category: "Beneficiaries", roles: { beneficiary: false, field_worker: true, ngo_admin: true, doctor: false, pharmacy: false, admin: true } },
  // Referrals
  { key: "view_referrals", label: "View Referrals", category: "Referrals", roles: { beneficiary: true, field_worker: true, ngo_admin: true, doctor: true, pharmacy: false, admin: true } },
  { key: "create_referral", label: "Create Referral", category: "Referrals", roles: { beneficiary: false, field_worker: true, ngo_admin: false, doctor: true, pharmacy: false, admin: true } },
  { key: "accept_referral", label: "Accept Referral", category: "Referrals", roles: { beneficiary: false, field_worker: false, ngo_admin: false, doctor: true, pharmacy: false, admin: true } },
  // Inventory
  { key: "view_inventory", label: "View Inventory", category: "Medicine & Inventory", roles: { beneficiary: false, field_worker: true, ngo_admin: true, doctor: false, pharmacy: true, admin: true } },
  { key: "manage_inventory", label: "Manage Inventory", category: "Medicine & Inventory", roles: { beneficiary: false, field_worker: false, ngo_admin: true, doctor: false, pharmacy: true, admin: true } },
  { key: "search_medicine", label: "Search Medicine", category: "Medicine & Inventory", roles: { beneficiary: true, field_worker: true, ngo_admin: true, doctor: true, pharmacy: true, admin: true } },
  // Maps
  { key: "view_heatmaps", label: "View Accessibility Map", category: "Maps & Analytics", roles: { beneficiary: false, field_worker: false, ngo_admin: true, doctor: false, pharmacy: false, admin: true } },
  { key: "view_analytics", label: "View Analytics", category: "Maps & Analytics", roles: { beneficiary: false, field_worker: false, ngo_admin: true, doctor: false, pharmacy: true, admin: true } },
  // User Management
  { key: "manage_users", label: "Manage Users", category: "Administration", roles: { beneficiary: false, field_worker: false, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
  { key: "manage_roles", label: "Manage Roles", category: "Administration", roles: { beneficiary: false, field_worker: false, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
  { key: "view_audit_logs", label: "View Audit Logs", category: "Administration", roles: { beneficiary: false, field_worker: false, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
  { key: "manage_organizations", label: "Manage Organizations", category: "Administration", roles: { beneficiary: false, field_worker: false, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
  // Health Camps
  { key: "view_health_camps", label: "View Health Camps", category: "Health Camps", roles: { beneficiary: true, field_worker: true, ngo_admin: true, doctor: true, pharmacy: false, admin: true } },
  { key: "manage_health_camps", label: "Manage Health Camps", category: "Health Camps", roles: { beneficiary: false, field_worker: false, ngo_admin: true, doctor: false, pharmacy: false, admin: true } },
  // Offline
  { key: "offline_mode", label: "Offline Mode", category: "System", roles: { beneficiary: false, field_worker: true, ngo_admin: false, doctor: false, pharmacy: false, admin: false } },
  { key: "sync_records", label: "Sync Records", category: "System", roles: { beneficiary: false, field_worker: true, ngo_admin: false, doctor: false, pharmacy: false, admin: true } },
];

// Role-level route permission: which roles can access which route prefixes
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/beneficiary": ["beneficiary"],
  "/field-worker": ["field_worker"],
  "/ngo": ["ngo_admin"],
  "/doctor": ["doctor"],
  "/pharmacy": ["pharmacy"],
  "/admin": ["admin"],
  "/notifications": ["beneficiary", "field_worker", "ngo_admin", "doctor", "pharmacy", "admin"],
  "/profile": ["beneficiary", "field_worker", "ngo_admin", "doctor", "pharmacy", "admin"],
  "/medicine-finder": ["beneficiary", "field_worker", "ngo_admin", "doctor", "admin"],
  "/accessibility-map": ["ngo_admin", "admin"],
  "/architecture": ["beneficiary", "field_worker", "ngo_admin", "doctor", "pharmacy", "admin"],
};

export function hasPermission(role: UserRole, key: string): boolean {
  const perm = PERMISSIONS.find((p) => p.key === key);
  if (!perm) return false;
  return perm.roles[role] === true;
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  for (const [prefix, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      return roles.includes(role);
    }
  }
  return true; // public routes
}
