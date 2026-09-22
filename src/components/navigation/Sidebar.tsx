import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, Activity, Package, MapPin,
  BarChart3, Settings, LogOut, Bell, ChevronLeft, ChevronRight,
  Stethoscope, Heart, Calendar, Send, Wifi, WifiOff, User,
  ClipboardList, Building2, Shield, Database, Zap, Bookmark,
  Map, AlertCircle, RefreshCw, Pill, Home, Search, UserPlus,
  TrendingUp, Navigation, ClipboardCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Avatar, Badge } from "../ui";
import { cn, getRoleLabel } from "../../lib/utils";
import type { UserRole } from "../../types";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function getNavItems(role: UserRole, pendingSync: number, unreadNotif: number): NavItem[] {
  switch (role) {
    case "beneficiary":
      return [
        { to: "/beneficiary/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/beneficiary/care-assistant", label: "Care Assistant", icon: <Heart size={18} /> },
        { to: "/beneficiary/find-healthcare", label: "Find Healthcare", icon: <MapPin size={18} /> },
        { to: "/medicine-finder", label: "Medicine Finder", icon: <Pill size={18} /> },
        { to: "/beneficiary/appointments", label: "Appointments", icon: <Calendar size={18} /> },
        { to: "/beneficiary/referrals", label: "My Referrals", icon: <Send size={18} /> },
        { to: "/beneficiary/reminders", label: "Reminders", icon: <Bell size={18} /> },
        { to: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadNotif },
        { to: "/profile", label: "My Profile", icon: <User size={18} /> },
      ];
    case "field_worker":
      return [
        { to: "/field-worker/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/field-worker/beneficiaries", label: "Beneficiaries", icon: <Users size={18} /> },
        { to: "/field-worker/new-case", label: "New Case", icon: <ClipboardList size={18} /> },
        { to: "/field-worker/visits", label: "My Visits", icon: <Navigation size={18} /> },
        { to: "/field-worker/referrals", label: "Referrals", icon: <Send size={18} /> },
        { to: "/medicine-finder", label: "Medicine Finder", icon: <Pill size={18} /> },
        { to: "/field-worker/offline-sync", label: "Offline Sync", icon: <RefreshCw size={18} />, badge: pendingSync },
        { to: "/field-worker/health-camps", label: "Health Camps", icon: <Heart size={18} /> },
        { to: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadNotif },
        { to: "/profile", label: "Profile", icon: <User size={18} /> },
      ];
    case "ngo_admin":
      return [
        { to: "/ngo/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/ngo/beneficiaries", label: "Beneficiaries", icon: <Users size={18} /> },
        { to: "/ngo/field-workers", label: "Field Workers", icon: <UserPlus size={18} /> },
        { to: "/ngo/cases", label: "Cases", icon: <FileText size={18} /> },
        { to: "/ngo/inventory", label: "Medicine Inventory", icon: <Package size={18} /> },
        { to: "/ngo/health-camps", label: "Health Camps", icon: <Heart size={18} /> },
        { to: "/accessibility-map", label: "Accessibility Map", icon: <Map size={18} /> },
        { to: "/ngo/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
        { to: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadNotif },
        { to: "/profile", label: "Profile", icon: <User size={18} /> },
      ];
    case "doctor":
      return [
        { to: "/doctor/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/doctor/referrals", label: "Referrals", icon: <Send size={18} /> },
        { to: "/doctor/cases", label: "Cases", icon: <FileText size={18} /> },
        { to: "/doctor/appointments", label: "Appointments", icon: <Calendar size={18} /> },
        { to: "/doctor/follow-ups", label: "Follow-ups", icon: <RefreshCw size={18} /> },
        { to: "/doctor/care-guidance", label: "Care Guidance", icon: <Stethoscope size={18} /> },
        { to: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadNotif },
        { to: "/profile", label: "Profile", icon: <User size={18} /> },
      ];
    case "pharmacy":
      return [
        { to: "/pharmacy/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/pharmacy/inventory", label: "Inventory", icon: <Package size={18} /> },
        { to: "/pharmacy/requests", label: "Medicine Requests", icon: <ClipboardList size={18} /> },
        { to: "/pharmacy/low-stock", label: "Low Stock", icon: <AlertCircle size={18} /> },
        { to: "/pharmacy/expiry-alerts", label: "Expiry Alerts", icon: <AlertCircle size={18} /> },
        { to: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadNotif },
        { to: "/profile", label: "Profile", icon: <User size={18} /> },
      ];
    case "admin":
      return [
        { to: "/admin/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
        { to: "/admin/roles", label: "Roles & Permissions", icon: <Shield size={18} /> },
        { to: "/admin/organizations", label: "Organizations", icon: <Building2 size={18} /> },
        { to: "/admin/providers", label: "Providers", icon: <Stethoscope size={18} /> },
        { to: "/admin/pharmacies", label: "Pharmacies", icon: <Pill size={18} /> },
        { to: "/accessibility-map", label: "Accessibility Map", icon: <Map size={18} /> },
        { to: "/admin/analytics", label: "Analytics", icon: <TrendingUp size={18} /> },
        { to: "/admin/audit-logs", label: "Audit Logs", icon: <Database size={18} /> },
        { to: "/admin/system-health", label: "System Health", icon: <Activity size={18} /> },
        { to: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadNotif },
        { to: "/profile", label: "Profile", icon: <User size={18} /> },
      ];
  }
}

const ROLE_COLORS: Record<UserRole, string> = {
  beneficiary: "bg-emerald-500",
  field_worker: "bg-blue-500",
  ngo_admin: "bg-purple-500",
  doctor: "bg-amber-500",
  pharmacy: "bg-orange-500",
  admin: "bg-red-500",
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, onMobileClose }: SidebarProps) {
  const { session, logout } = useAuth();
  const { pendingSyncCount, notifications } = useApp();
  const navigate = useNavigate();

  if (!session) return null;

  const unreadNotif = notifications.filter(n => n.userId === session.userId && !n.isRead).length;
  const navItems = getNavItems(session.role, pendingSyncCount, unreadNotif);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={cn(
      "flex flex-col bg-white border-r border-blue-50 shadow-sm transition-all duration-300 fixed left-0 top-7 z-40",
      "h-[calc(100vh-28px)]",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className={cn("flex items-center px-4 py-4 border-b border-blue-50 flex-shrink-0", collapsed ? "justify-center" : "gap-3")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Heart size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">RuralConnect</p>
              <p className="text-[10px] text-blue-600 font-medium leading-tight">Healthcare Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-blue-50">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-50">
            <Avatar name={session.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{session.name}</p>
              <div className={cn("text-[10px] font-medium text-white px-1.5 py-0.5 rounded-full inline-block mt-0.5", ROLE_COLORS[session.role])}>
                {getRoleLabel(session.role)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onMobileClose}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
              collapsed ? "justify-center" : "",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            )}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
            {item.badge !== undefined && item.badge > 0 && (
              <span className={cn(
                "flex-shrink-0 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center",
                collapsed ? "absolute top-1 right-1 bg-red-500 text-white" : "ml-auto bg-red-500 text-white"
              )}>
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-blue-50 space-y-1">
        <NavLink
          to="/architecture"
          className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors", collapsed && "justify-center")}
          title={collapsed ? "Architecture" : undefined}
        >
          <Zap size={18} />
          {!collapsed && <span>Architecture</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors", collapsed && "justify-center")}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-blue-100 rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
