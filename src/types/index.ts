// ============================================
// RuralConnect — All TypeScript Types
// ============================================

export type UserRole =
  | "beneficiary"
  | "field_worker"
  | "ngo_admin"
  | "doctor"
  | "pharmacy"
  | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state: string;
  district: string;
  village?: string;
  pinCode?: string;
  organization?: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  createdAt: string;
  assignedDistrict?: string;
  assignedVillages?: string[];
  lastSync?: string;
  deviceStatus?: "online" | "offline";
  profilePhoto?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  mobile: string;
  state: string;
  district: string;
  village: string;
  pinCode: string;
  symptoms?: string[];
  conditions?: string[];
  assignedWorker?: string;
  assignedNgo?: string;
  registeredAt: string;
  lastVisit?: string;
  status: "active" | "referred" | "closed";
  ayushmanId?: string;
  aadharLast4?: string;
}

export interface HealthCase {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  village: string;
  district: string;
  state: string;
  symptoms: string[];
  severity: "low" | "moderate" | "high";
  status: "open" | "referred" | "closed" | "pending_sync";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  isOffline?: boolean;
  referralId?: string;
}

export interface Referral {
  id: string;
  caseId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  fromWorkerId?: string;
  toFacilityId: string;
  toFacilityName: string;
  toDoctorId?: string;
  toDoctorName?: string;
  priority: "low" | "moderate" | "high";
  reason: string;
  symptoms: string[];
  status: "pending" | "accepted" | "scheduled" | "completed" | "cancelled";
  createdAt: string;
  scheduledDate?: string;
  completedAt?: string;
  notes?: string;
  district: string;
  state: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stockStatus: "available" | "low_stock" | "out_of_stock" | "expiring_soon";
  quantity: number;
  providerId: string;
  providerName: string;
  providerType: "pharmacy" | "ngo" | "phc" | "chc";
  location: string;
  district: string;
  state: string;
  distance?: number;
  price?: number;
  lastUpdated: string;
  batchNumber?: string;
  expiryDate?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  location: string;
  district: string;
  state: string;
  status: "available" | "low_stock" | "out_of_stock" | "expiring_soon";
  providerId: string;
  updatedAt: string;
  price?: number;
  manufacturer?: string;
}

export interface Appointment {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  doctorId?: string;
  doctorName?: string;
  facilityId?: string;
  facilityName?: string;
  type: "consultation" | "follow_up" | "vaccination" | "health_camp" | "referral";
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  notes?: string;
  district: string;
  state: string;
}

export interface Reminder {
  id: string;
  beneficiaryId: string;
  title: string;
  description: string;
  type: "medication" | "vaccination" | "follow_up" | "health_camp" | "referral";
  dueDate: string;
  dueTime?: string;
  frequency: "once" | "daily" | "weekly" | "monthly";
  channels: ("sms" | "ussd" | "ivr" | "in_app")[];
  status: "active" | "sent" | "acknowledged" | "missed";
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: "appointment" | "medicine" | "referral" | "health_camp" | "system" | "sync";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: "phc" | "chc" | "district_hospital" | "sub_centre" | "arogya_mandir" | "ngo_camp" | "pharmacy" | "private_clinic";
  lat: number;
  lng: number;
  address: string;
  village?: string;
  district: string;
  state: string;
  pinCode: string;
  contactNumber?: string;
  doctors?: number;
  beds?: number;
  operatingHours?: string;
  services?: string[];
  accessibilityScore?: number;
}

export interface HealthCamp {
  id: string;
  name: string;
  ngoId: string;
  ngoName: string;
  location: string;
  village: string;
  district: string;
  state: string;
  date: string;
  startTime: string;
  endTime: string;
  services: string[];
  availableDoctors: number;
  medicineStock: string[];
  expectedBeneficiaries: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  registeredBeneficiaries?: number;
}

export interface NGO {
  id: string;
  name: string;
  regNumber: string;
  focusArea: string[];
  state: string;
  district: string;
  address: string;
  contact: string;
  email: string;
  fieldWorkers: number;
  activeBeneficiaries: number;
  status: "active" | "inactive";
}

export interface SyncRecord {
  id: string;
  type: "beneficiary" | "case" | "referral" | "appointment";
  data: Record<string, unknown>;
  createdOfflineAt: string;
  status: "pending" | "syncing" | "synced" | "conflict";
  conflictData?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  status: "success" | "failure";
  details?: string;
  ipAddress?: string;
}

export interface Permission {
  key: string;
  label: string;
  category: string;
  roles: Partial<Record<UserRole, boolean>>;
}

export interface DemoCredential {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  label: string;
}

export interface AccessibilityZone {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  facilities: number;
  nearestFacilityKm: number;
  travelTimeMin: number;
  accessibilityScore: number; // 0-100
  priority: "high" | "medium" | "low";
}
