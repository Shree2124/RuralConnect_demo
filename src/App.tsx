import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoute } from "./router/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { UX4GBar } from "./components/layout/UX4GBar";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Architecture from "./pages/Architecture";
import AccessRestricted from "./pages/AccessRestricted";
import MedicineFinder from "./pages/MedicineFinder";
import AccessibilityMap from "./pages/AccessibilityMap";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

// Dashboards
import BeneficiaryDashboard from "./pages/beneficiary/Dashboard";
import CareAssistant from "./pages/beneficiary/CareAssistant";
import FieldWorkerDashboard from "./pages/field-worker/Dashboard";
import FieldWorkerBeneficiaries from "./pages/field-worker/Beneficiaries";
import NewCase from "./pages/field-worker/NewCase";
import FieldWorkerReferrals from "./pages/field-worker/Referrals";
import OfflineSync from "./pages/field-worker/OfflineSync";
import NGODashboard from "./pages/ngo/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import PharmacyDashboard from "./pages/pharmacy/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

// Stubs
import {
  BeneficiaryAppointments, BeneficiaryReferrals, BeneficiaryReminders, BeneficiaryFindHealthcare,
  FieldWorkerVisits, FieldWorkerHealthCamps,
  NGOBeneficiaries, NGOFieldWorkers, NGOCases, NGOInventory, NGOHealthCamps, NGOAnalytics,
  DoctorReferrals, DoctorCases, DoctorAppointments, DoctorFollowUps, DoctorCareGuidance,
  PharmacyInventory, PharmacyRequests, PharmacyLowStock, PharmacyExpiryAlerts,
  AdminUsers, AdminRoles, AdminOrganizations, AdminAnalytics, AdminAuditLogs, AdminSystemHealth, AdminProviders, AdminPharmacies
} from "./pages";

export default function App() {
  return (
    <div id="main-content" className="min-h-screen flex flex-col">
      <UX4GBar />
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: "14px", borderRadius: "8px" } }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/access-restricted" element={<AccessRestricted />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          {/* Shared Protected Routes */}
          <Route path="/medicine-finder" element={<ProtectedRoute><MedicineFinder /></ProtectedRoute>} />
          <Route path="/accessibility-map" element={<ProtectedRoute><AccessibilityMap /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Beneficiary */}
          <Route path="/beneficiary">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["beneficiary"]}><BeneficiaryDashboard /></ProtectedRoute>} />
            <Route path="care-assistant" element={<ProtectedRoute allowedRoles={["beneficiary"]}><CareAssistant /></ProtectedRoute>} />
            <Route path="appointments" element={<ProtectedRoute allowedRoles={["beneficiary"]}><BeneficiaryAppointments /></ProtectedRoute>} />
            <Route path="referrals" element={<ProtectedRoute allowedRoles={["beneficiary"]}><BeneficiaryReferrals /></ProtectedRoute>} />
            <Route path="reminders" element={<ProtectedRoute allowedRoles={["beneficiary"]}><BeneficiaryReminders /></ProtectedRoute>} />
            <Route path="find-healthcare" element={<ProtectedRoute allowedRoles={["beneficiary"]}><BeneficiaryFindHealthcare /></ProtectedRoute>} />
          </Route>

          {/* Field Worker */}
          <Route path="/field-worker">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["field_worker"]}><FieldWorkerDashboard /></ProtectedRoute>} />
            <Route path="beneficiaries" element={<ProtectedRoute allowedRoles={["field_worker"]}><FieldWorkerBeneficiaries /></ProtectedRoute>} />
            <Route path="new-case" element={<ProtectedRoute allowedRoles={["field_worker"]}><NewCase /></ProtectedRoute>} />
            <Route path="referrals" element={<ProtectedRoute allowedRoles={["field_worker"]}><FieldWorkerReferrals /></ProtectedRoute>} />
            <Route path="offline-sync" element={<ProtectedRoute allowedRoles={["field_worker"]}><OfflineSync /></ProtectedRoute>} />
            <Route path="visits" element={<ProtectedRoute allowedRoles={["field_worker"]}><FieldWorkerVisits /></ProtectedRoute>} />
            <Route path="health-camps" element={<ProtectedRoute allowedRoles={["field_worker"]}><FieldWorkerHealthCamps /></ProtectedRoute>} />
          </Route>

          {/* NGO */}
          <Route path="/ngo">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGODashboard /></ProtectedRoute>} />
            <Route path="beneficiaries" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGOBeneficiaries /></ProtectedRoute>} />
            <Route path="field-workers" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGOFieldWorkers /></ProtectedRoute>} />
            <Route path="cases" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGOCases /></ProtectedRoute>} />
            <Route path="inventory" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGOInventory /></ProtectedRoute>} />
            <Route path="health-camps" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGOHealthCamps /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute allowedRoles={["ngo_admin"]}><NGOAnalytics /></ProtectedRoute>} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="referrals" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorReferrals /></ProtectedRoute>} />
            <Route path="cases" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorCases /></ProtectedRoute>} />
            <Route path="appointments" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorAppointments /></ProtectedRoute>} />
            <Route path="follow-ups" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorFollowUps /></ProtectedRoute>} />
            <Route path="care-guidance" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorCareGuidance /></ProtectedRoute>} />
          </Route>

          {/* Pharmacy */}
          <Route path="/pharmacy">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["pharmacy"]}><PharmacyDashboard /></ProtectedRoute>} />
            <Route path="inventory" element={<ProtectedRoute allowedRoles={["pharmacy"]}><PharmacyInventory /></ProtectedRoute>} />
            <Route path="requests" element={<ProtectedRoute allowedRoles={["pharmacy"]}><PharmacyRequests /></ProtectedRoute>} />
            <Route path="low-stock" element={<ProtectedRoute allowedRoles={["pharmacy"]}><PharmacyLowStock /></ProtectedRoute>} />
            <Route path="expiry-alerts" element={<ProtectedRoute allowedRoles={["pharmacy"]}><PharmacyExpiryAlerts /></ProtectedRoute>} />
          </Route>

          {/* Admin */}
          <Route path="/admin">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="roles" element={<ProtectedRoute allowedRoles={["admin"]}><AdminRoles /></ProtectedRoute>} />
            <Route path="organizations" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrganizations /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAnalytics /></ProtectedRoute>} />
            <Route path="audit-logs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAuditLogs /></ProtectedRoute>} />
            <Route path="system-health" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSystemHealth /></ProtectedRoute>} />
            <Route path="providers" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProviders /></ProtectedRoute>} />
            <Route path="pharmacies" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPharmacies /></ProtectedRoute>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
