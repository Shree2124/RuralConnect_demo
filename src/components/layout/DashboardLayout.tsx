import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../navigation/Sidebar";
import { TopNav } from "../navigation/TopNav";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 256;

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <TopNav sidebarWidth={sidebarWidth} />
      <main
        className="transition-all duration-300 pt-[73px] min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Offline banner adds ~32px */}
        <div className="p-5 md:p-6">
          <Outlet />
        </div>
      </main>
      {/* Demo Badge */}
      <div className="demo-badge">
        RuralConnect • Prototype Demo
      </div>
    </div>
  );
}
