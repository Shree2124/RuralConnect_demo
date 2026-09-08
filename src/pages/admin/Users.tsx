import React from "react";
import { Users } from "lucide-react";
import { Card, EmptyState } from "../../components/ui";

export default function () {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage all platform users and accounts.</p>
      </div>
      <Card>
        <EmptyState
          icon={<Users size={22} />}
          title="User Management"
          description="This section is part of the demo prototype. Full functionality is implemented in the primary dashboards."
        />
      </Card>
    </div>
  );
}
