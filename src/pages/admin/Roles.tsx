import React from "react";
import { Shield } from "lucide-react";
import { Card, Button } from "../../components/ui";

const MOCK_ROLES = [
  { id: "admin", name: "Super Admin", users: 3, description: "Full system access including user management and system settings." },
  { id: "ngo_admin", name: "NGO Admin", users: 1, description: "Manage NGO operations, field workers, and health camps." },
  { id: "field_worker", name: "Field Worker", users: 3, description: "Register beneficiaries, create cases, and manage offline data." },
  { id: "doctor", name: "Doctor", users: 2, description: "Review referred cases, schedule follow-ups, and provide guidance." },
  { id: "pharmacy", name: "Pharmacy", users: 2, description: "Manage inventory, update stock, and process prescriptions." },
];

export default function Roles() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Roles & Permissions</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure access control and permissions for different user types.</p>
        </div>
        <Button variant="primary" size="sm">Create Role</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_ROLES.map(role => (
          <Card key={role.id} className="p-5 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Shield size={18} className="text-blue-600" />
                <h2 className="font-semibold">{role.name}</h2>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">{role.users} Users</span>
            </div>
            <p className="text-sm text-slate-500 flex-1">{role.description}</p>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button size="sm" variant="ghost" className="text-blue-600 px-0 hover:bg-transparent hover:underline">Edit Permissions</Button>
              <Button size="sm" variant="ghost" className="text-slate-500 px-0 hover:bg-transparent hover:underline">View Users</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
