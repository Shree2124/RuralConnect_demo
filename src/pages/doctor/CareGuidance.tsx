import React from "react";
import { BookOpen } from "lucide-react";
import { Card, EmptyState } from "../../components/ui";

export default function () {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Care Guidance Library</h1>
        <p className="text-slate-500 text-sm mt-0.5">Non-diagnostic care guidance resources.</p>
      </div>
      <Card>
        <EmptyState
          icon={<BookOpen size={22} />}
          title="Care Guidance Library"
          description="This section is part of the demo prototype. Full functionality is implemented in the primary dashboards."
        />
      </Card>
    </div>
  );
}
