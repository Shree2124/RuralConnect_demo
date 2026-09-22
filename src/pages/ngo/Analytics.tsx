import React from "react";
import { BarChart3 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card } from "../../components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function NGOAnalytics() {
  const { cases, beneficiaries } = useApp();
  const myCases = cases.filter(c => c.state === "Maharashtra");
  const myBeneficiaries = beneficiaries.filter(b => b.assignedNgo === "ngo1");

  const caseStatus = [
    { name: "Open", value: myCases.filter(c => c.status === "open").length || 1, color: "#3B82F6" },
    { name: "Referred", value: myCases.filter(c => c.status === "referred").length || 1, color: "#8B5CF6" },
    { name: "Closed", value: myCases.filter(c => c.status === "closed").length || 1, color: "#10B981" },
  ];

  const genderDist = [
    { name: "Male", value: myBeneficiaries.filter(b => b.gender === "Male").length || 1, fill: "#2563EB" },
    { name: "Female", value: myBeneficiaries.filter(b => b.gender === "Female").length || 1, fill: "#EC4899" },
    { name: "Other", value: myBeneficiaries.filter(b => b.gender === "Other").length || 1, fill: "#8B5CF6" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">NGO Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Insights and reports based on your organization's activities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Case Status Breakdown</h2>
          </div>
          <div className="p-5 flex justify-center items-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={caseStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label>
                  {caseStatus.map((entry, index) => (
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
            <h2 className="text-sm font-semibold text-slate-700">Beneficiary Demographics</h2>
          </div>
          <div className="p-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderDist} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {genderDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
