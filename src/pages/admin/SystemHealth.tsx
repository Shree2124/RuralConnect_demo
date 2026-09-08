import React from "react";
import { Activity } from "lucide-react";
import { Card, EmptyState } from "../../components/ui";

export default function () {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">System Health</h1>
        <p className="text-slate-500 text-sm mt-0.5">Monitor platform health and performance.</p>
      </div>
      <Card>
        <EmptyState
          icon={<Activity size={22} />}
          title="System Health"
          description="This section is part of the demo prototype. Full functionality is implemented in the primary dashboards."
        />
      </Card>
    </div>
  );
}
