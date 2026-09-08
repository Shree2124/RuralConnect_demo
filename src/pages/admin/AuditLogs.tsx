import React from "react";
import { Database } from "lucide-react";
import { Card, EmptyState } from "../../components/ui";

export default function () {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Audit Logs</h1>
        <p className="text-slate-500 text-sm mt-0.5">Complete audit trail of all platform actions.</p>
      </div>
      <Card>
        <EmptyState
          icon={<Database size={22} />}
          title="Audit Logs"
          description="This section is part of the demo prototype. Full functionality is implemented in the primary dashboards."
        />
      </Card>
    </div>
  );
}
