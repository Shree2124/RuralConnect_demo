import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type {
  Beneficiary,
  HealthCase,
  Referral,
  Medicine,
  InventoryItem,
  Appointment,
  Reminder,
  Notification,
  HealthCamp,
  SyncRecord,
  AuditLog,
  User,
} from "../types";
import {
  MOCK_BENEFICIARIES,
  MOCK_CASES,
  MOCK_REFERRALS,
  MOCK_MEDICINES,
  MOCK_INVENTORY,
  MOCK_APPOINTMENTS,
  MOCK_REMINDERS,
  MOCK_NOTIFICATIONS,
  MOCK_HEALTH_CAMPS,
  MOCK_SYNC_RECORDS,
  MOCK_AUDIT_LOGS,
  MOCK_USERS,
  MOCK_FACILITIES,
  MOCK_NGOS,
} from "../lib/mock-data";
import { generateId } from "../lib/utils";
import type { HealthcareFacility, NGO } from "../types";

type SyncStatus = "online" | "offline" | "syncing" | "synced";

interface AppContextType {
  // Data
  beneficiaries: Beneficiary[];
  cases: HealthCase[];
  referrals: Referral[];
  medicines: Medicine[];
  inventory: InventoryItem[];
  appointments: Appointment[];
  reminders: Reminder[];
  notifications: Notification[];
  healthCamps: HealthCamp[];
  syncQueue: SyncRecord[];
  auditLogs: AuditLog[];
  users: User[];
  facilities: HealthcareFacility[];
  ngos: NGO[];
  // Offline/Sync
  offlineMode: boolean;
  syncStatus: SyncStatus;
  pendingSyncCount: number;
  lastSyncTime: string | null;
  // Actions
  setOfflineMode: (val: boolean) => void;
  simulateSync: () => Promise<void>;
  addBeneficiary: (b: Omit<Beneficiary, "id" | "registeredAt">) => Beneficiary;
  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => void;
  addCase: (c: Omit<HealthCase, "id" | "createdAt" | "updatedAt">) => HealthCase;
  updateCase: (id: string, updates: Partial<HealthCase>) => void;
  addReferral: (r: Omit<Referral, "id" | "createdAt">) => Referral;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  addAppointment: (a: Omit<Appointment, "id">) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updateInventory: (id: string, updates: Partial<InventoryItem>) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "updatedAt">) => InventoryItem;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt">) => void;
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
  addHealthCamp: (camp: Omit<HealthCamp, "id">) => HealthCamp;
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (u: Omit<User, "id" | "createdAt">) => User;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "rc_app_state";

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveState(state: Partial<AppContextType>) {
  try {
    const toSave = {
      beneficiaries: state.beneficiaries,
      cases: state.cases,
      referrals: state.referrals,
      inventory: state.inventory,
      appointments: state.appointments,
      notifications: state.notifications,
      syncQueue: state.syncQueue,
      lastSyncTime: state.lastSyncTime,
      offlineMode: state.offlineMode,
      healthCamps: state.healthCamps,
      users: state.users,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const stored = loadState();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(stored?.beneficiaries || MOCK_BENEFICIARIES);
  const [cases, setCases] = useState<HealthCase[]>(stored?.cases || MOCK_CASES);
  const [referrals, setReferrals] = useState<Referral[]>(stored?.referrals || MOCK_REFERRALS);
  const [medicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [inventory, setInventory] = useState<InventoryItem[]>(stored?.inventory || MOCK_INVENTORY);
  const [appointments, setAppointments] = useState<Appointment[]>(stored?.appointments || MOCK_APPOINTMENTS);
  const [reminders] = useState<Reminder[]>(MOCK_REMINDERS);
  const [notifications, setNotifications] = useState<Notification[]>(stored?.notifications || MOCK_NOTIFICATIONS);
  const [healthCamps, setHealthCamps] = useState<HealthCamp[]>(stored?.healthCamps || MOCK_HEALTH_CAMPS);
  const [syncQueue, setSyncQueue] = useState<SyncRecord[]>(stored?.syncQueue || MOCK_SYNC_RECORDS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [users, setUsers] = useState<User[]>(stored?.users || MOCK_USERS);
  const [facilities] = useState<HealthcareFacility[]>(MOCK_FACILITIES);
  const [ngos] = useState<NGO[]>(MOCK_NGOS);
  const [offlineMode, setOfflineModeState] = useState<boolean>(stored?.offlineMode || false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("online");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(stored?.lastSyncTime || "2026-09-08T06:20:00");

  const pendingSyncCount = syncQueue.filter((r) => r.status === "pending").length;

  // Persist on changes
  useEffect(() => {
    saveState({ beneficiaries, cases, referrals, inventory, appointments, notifications, syncQueue, lastSyncTime, offlineMode, healthCamps, users });
  }, [beneficiaries, cases, referrals, inventory, appointments, notifications, syncQueue, lastSyncTime, offlineMode, healthCamps, users]);

  const setOfflineMode = useCallback((val: boolean) => {
    setOfflineModeState(val);
    setSyncStatus(val ? "offline" : "online");
  }, []);

  const simulateSync = useCallback(async () => {
    if (offlineMode) return;
    setSyncStatus("syncing");
    await new Promise((r) => setTimeout(r, 800));
    // Simulate resolving pending records
    setSyncQueue((prev) =>
      prev.map((r) => (r.status === "pending" ? { ...r, status: "synced" } : r))
    );
    setLastSyncTime(new Date().toISOString());
    setSyncStatus("synced");
    setTimeout(() => setSyncStatus("online"), 3000);
  }, [offlineMode]);

  const addBeneficiary = useCallback((b: Omit<Beneficiary, "id" | "registeredAt">): Beneficiary => {
    const newB: Beneficiary = { ...b, id: generateId(), registeredAt: new Date().toISOString() };
    if (offlineMode) {
      setSyncQueue((prev) => [...prev, { id: generateId(), type: "beneficiary", data: newB as Record<string, unknown>, createdOfflineAt: new Date().toISOString(), status: "pending" }]);
    }
    setBeneficiaries((prev) => [newB, ...prev]);
    return newB;
  }, [offlineMode]);

  const updateBeneficiary = useCallback((id: string, updates: Partial<Beneficiary>) => {
    setBeneficiaries((prev) => prev.map((b) => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const addCase = useCallback((c: Omit<HealthCase, "id" | "createdAt" | "updatedAt">): HealthCase => {
    const now = new Date().toISOString();
    const newC: HealthCase = { ...c, id: generateId(), createdAt: now, updatedAt: now, isOffline: offlineMode };
    if (offlineMode) {
      setSyncQueue((prev) => [...prev, { id: generateId(), type: "case", data: newC as Record<string, unknown>, createdOfflineAt: now, status: "pending" }]);
    }
    setCases((prev) => [newC, ...prev]);
    return newC;
  }, [offlineMode]);

  const updateCase = useCallback((id: string, updates: Partial<HealthCase>) => {
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  }, []);

  const addReferral = useCallback((r: Omit<Referral, "id" | "createdAt">): Referral => {
    const newR: Referral = { ...r, id: generateId(), createdAt: new Date().toISOString() };
    if (offlineMode) {
      setSyncQueue((prev) => [...prev, { id: generateId(), type: "referral", data: newR as Record<string, unknown>, createdOfflineAt: new Date().toISOString(), status: "pending" }]);
    }
    setReferrals((prev) => [newR, ...prev]);
    return newR;
  }, [offlineMode]);

  const updateReferral = useCallback((id: string, updates: Partial<Referral>) => {
    setReferrals((prev) => prev.map((r) => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, "id">): Appointment => {
    const newA: Appointment = { ...a, id: generateId() };
    setAppointments((prev) => [newA, ...prev]);
    return newA;
  }, []);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const updateInventory = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
  }, []);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, "id" | "updatedAt">): InventoryItem => {
    const newItem: InventoryItem = { ...item, id: generateId(), updatedAt: new Date().toISOString() };
    setInventory((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications((prev) => prev.map((n) => n.userId === userId ? { ...n, isRead: true } : n));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "createdAt">) => {
    const newN: Notification = { ...n, id: generateId(), createdAt: new Date().toISOString() };
    setNotifications((prev) => [newN, ...prev]);
  }, []);

  const addAuditLog = useCallback((log: Omit<AuditLog, "id" | "timestamp">) => {
    const newLog: AuditLog = { ...log, id: generateId(), timestamp: new Date().toISOString() };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  const addHealthCamp = useCallback((camp: Omit<HealthCamp, "id">): HealthCamp => {
    const newCamp: HealthCamp = { ...camp, id: generateId() };
    setHealthCamps((prev) => [newCamp, ...prev]);
    return newCamp;
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...updates } : u));
  }, []);

  const addUser = useCallback((u: Omit<User, "id" | "createdAt">): User => {
    const newU: User = { ...u, id: generateId(), createdAt: new Date().toISOString() };
    setUsers((prev) => [newU, ...prev]);
    return newU;
  }, []);

  return (
    <AppContext.Provider
      value={{
        beneficiaries, cases, referrals, medicines, inventory, appointments,
        reminders, notifications, healthCamps, syncQueue, auditLogs, users, facilities, ngos,
        offlineMode, syncStatus, pendingSyncCount, lastSyncTime,
        setOfflineMode, simulateSync,
        addBeneficiary, updateBeneficiary,
        addCase, updateCase,
        addReferral, updateReferral,
        addAppointment, updateAppointment,
        updateInventory, addInventoryItem,
        markNotificationRead, markAllNotificationsRead, addNotification,
        addAuditLog, addHealthCamp, updateUser, addUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
