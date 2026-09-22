import React from "react";
import { BarChart3 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card } from "../../components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const { cases, referrals } = useApp();

  const caseSeverity = [
    { name: "Low", value: cases.filter(c => c.severity === "low").length || 1, color: "#10B981" },
    { name: "Moderate", value: cases.filter(c => c.severity === "moderate").length || 1, color: "#F59E0B" },
    { name: "High", value: cases.filter(c => c.severity === "high").length || 1, color: "#EF4444" },
  ];

  const referralStatus = [
    { name: "Pending", value: referrals.filter(r => r.status === "pending").length || 1 },
    { name: "Accepted", value: referrals.filter(r => r.status === "accepted").length || 1 },
    { name: "Scheduled", value: referrals.filter(r => r.status === "scheduled").length || 1 },
    { name: "Completed", value: referrals.filter(r => r.status === "completed").length || 1 },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Platform Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Deep dive into health metrics and system usage.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Cases by Severity</h2>
          </div>
          <div className="p-5 flex justify-center items-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={caseSeverity} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label>
                  {caseSeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Referrals Status Breakdown</h2>
          </div>
          <div className="p-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referralStatus} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
