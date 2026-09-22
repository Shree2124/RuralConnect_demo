import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../navigation/Sidebar";
import { TopNav } from "../navigation/TopNav";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 64 : 256;
  const mainMargin = isMobile ? 0 : sidebarWidth;
  const navLeft = isMobile ? 0 : sidebarWidth;

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-7 z-40 h-[calc(100vh-28px)] transition-transform duration-300
          ${isMobile ? (mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full") : "translate-x-0"}
        `}
        style={{ width: sidebarWidth }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      {/* TopNav */}
      <TopNav
        sidebarWidth={navLeft}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />

      {/* Main content */}
      <main
        className="transition-all duration-300 pt-[101px] min-h-screen"
        style={{ marginLeft: mainMargin }}
      >
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Demo Badge */}
      <div className="demo-badge hidden sm:block">RuralConnect • Prototype Demo</div>
    </div>
  );
}
