import type { DemoCredential, UserRole } from "../types";

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: "demo.patient@ruralconnect.in",
    password: "demo123",
    role: "beneficiary",
    name: "Meena Patil",
    label: "Beneficiary / Patient",
  },
  {
    email: "demo.worker@ruralconnect.in",
    password: "demo123",
    role: "field_worker",
    name: "Rajesh Kumar",
    label: "Field Worker",
  },
  {
    email: "demo.ngo@ruralconnect.in",
    password: "demo123",
    role: "ngo_admin",
    name: "Priya Sharma",
    label: "NGO Admin",
  },
  {
    email: "demo.doctor@ruralconnect.in",
    password: "demo123",
    role: "doctor",
    name: "Dr. Vikram Singh",
    label: "Doctor / Provider",
  },
  {
    email: "demo.pharmacy@ruralconnect.in",
    password: "demo123",
    role: "pharmacy",
    name: "Suresh Mehta",
    label: "Pharmacy Manager",
  },
  {
    email: "demo.admin@ruralconnect.in",
    password: "demo123",
    role: "admin",
    name: "Anita Desai",
    label: "Platform Admin",
  },
];

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  beneficiary: "/beneficiary/dashboard",
  field_worker: "/field-worker/dashboard",
  ngo_admin: "/ngo/dashboard",
  doctor: "/doctor/dashboard",
  pharmacy: "/pharmacy/dashboard",
  admin: "/admin/dashboard",
};

export function validateCredentials(
  email: string,
  password: string
): DemoCredential | null {
  return (
    DEMO_CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    ) || null
  );
}
