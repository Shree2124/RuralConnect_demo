import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Wifi, WifiOff, RefreshCw, CheckCircle, MapPin, ChevronDown, Globe } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Avatar, Badge, Switch } from "../ui";
import { cn, timeAgo } from "../../lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

function ConnectivityIndicator() {
  const { offlineMode, syncStatus, simulateSync, lastSyncTime, pendingSyncCount } = useApp();

  const handleSync = async () => {
    if (!offlineMode) await simulateSync();
  };

  if (syncStatus === "syncing") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-xs font-medium text-blue-700">
        <RefreshCw size={12} className="animate-spin" />
        <span>Synchronizing...</span>
      </div>
    );
  }

  if (syncStatus === "synced") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-700">
        <CheckCircle size={12} />
        <span>Synced just now</span>
      </div>
    );
  }

  if (offlineMode) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg text-xs font-medium text-red-600">
        <WifiOff size={12} />
        <span>Offline · Local mode</span>
        {pendingSyncCount > 0 && <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">{pendingSyncCount}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={handleSync}
      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <Wifi size={12} />
      <span>Online</span>
      {lastSyncTime && <span className="text-emerald-500 hidden sm:block">· {timeAgo(lastSyncTime)}</span>}
    </button>
  );
}

export function TopNav({ sidebarWidth }: { sidebarWidth: number }) {
  const { session, currentUser, logout } = useAuth();
  const { offlineMode, setOfflineMode, notifications } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [lang, setLang] = useState("en");
  const [search, setSearch] = useState("");

  if (!session) return null;

  const userNotifications = notifications.filter(n => n.userId === session.userId).slice(0, 6);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const location = currentUser?.district && currentUser?.state
    ? `${currentUser.district}, ${currentUser.state}`
    : "India";

  return (
    <header
      className="fixed top-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-b border-blue-50 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      {/* Offline Banner */}
      {offlineMode && (
        <div className="bg-amber-500 text-white text-xs font-medium px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff size={12} />
            <span>You're offline. Changes will be saved locally and synchronized when connectivity is restored.</span>
          </div>
          <button
            onClick={() => setOfflineMode(false)}
            className="text-white/80 hover:text-white text-xs underline ml-4"
          >
            Go Online
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left: Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beneficiaries, medicines, facilities..."
            className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Location */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={12} className="text-blue-400" />
            <span>{location}</span>
          </div>

          {/* Connectivity */}
          <ConnectivityIndicator />

          {/* Offline Toggle */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-100 pl-2">
            <span className="text-xs text-slate-500">Offline</span>
            <Switch checked={offlineMode} onChange={setOfflineMode} />
          </div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => { setShowLang(!showLang); setShowNotifications(false); setShowProfile(false); }}
              className="flex items-center gap-1 p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-xs"
            >
              <Globe size={16} />
              <span className="hidden sm:block">{LANGUAGES.find(l => l.code === lang)?.label}</span>
            </button>
            {showLang && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLang(false); }}
                    className={cn("w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors", lang === l.code && "text-blue-600 font-medium")}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowLang(false); }}
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  <button onClick={() => navigate("/notifications")} className="text-xs text-blue-600 hover:underline">View all</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {userNotifications.length === 0 ? (
                    <p className="text-xs text-slate-500 px-4 py-6 text-center">No notifications</p>
                  ) : userNotifications.map(n => (
                    <div key={n.id} className={cn("px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer", !n.isRead && "bg-blue-50/50")}>
                      <div className="flex gap-2">
                        {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowLang(false); }}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Avatar name={session.name} size="sm" />
              <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">{session.name}</p>
                  <p className="text-[10px] text-slate-500">{session.email}</p>
                </div>
                <button onClick={() => { navigate("/profile"); setShowProfile(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">My Profile</button>
                <button onClick={() => { navigate("/architecture"); setShowProfile(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Architecture</button>
                <div className="border-t border-slate-100 mt-1">
                  <button onClick={() => { logout(); navigate("/login"); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
