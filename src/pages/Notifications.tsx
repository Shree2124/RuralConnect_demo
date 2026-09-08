import React, { useState } from "react";
import { Bell, CheckCheck, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Card, Button, Badge, EmptyState, Tabs } from "../components/ui";
import { timeAgo } from "../lib/utils";
import { cn } from "../lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  reminder: "💊",
  appointment: "📅",
  referral: "📨",
  inventory: "📦",
  system: "⚙️",
  camp: "🏥",
  case: "📋",
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  if (!session) return null;

  const myNotifs = notifications.filter(n => n.userId === session.userId);
  const unread = myNotifs.filter(n => !n.isRead);
  const tabData = { all: myNotifs, unread, read: myNotifs.filter(n => n.isRead) };
  const displayed = tabData[activeTab as keyof typeof tabData] || myNotifs;

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">{unread.length} unread</p>
        </div>
        {unread.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => markAllNotificationsRead(session.userId)}>
            <CheckCheck size={13} /> Mark all read
          </Button>
        )}
      </div>

      <Tabs
        tabs={[{ id: "all", label: "All", count: myNotifs.length }, { id: "unread", label: "Unread", count: unread.length }, { id: "read", label: "Read" }]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Card>
        {displayed.length === 0 ? (
          <EmptyState icon={<Bell size={22} />} title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="divide-y divide-slate-50">
            {displayed.map(n => (
              <div
                key={n.id}
                className={cn(
                  "px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors",
                  !n.isRead && "bg-blue-50/40"
                )}
                onClick={() => markNotificationRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[n.category] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-xs leading-relaxed", !n.isRead ? "font-semibold text-slate-800" : "font-medium text-slate-700")}>
                        {n.title}
                      </p>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="badge-gray text-[10px]">{n.category}</span>
                      <span className="text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
