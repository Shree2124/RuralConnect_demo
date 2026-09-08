import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessRoute } from "../lib/permissions";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && session && !allowedRoles.includes(session.role)) {
    return <Navigate to="/access-restricted" replace />;
  }

  if (session && !canAccessRoute(session.role, location.pathname)) {
    return <Navigate to="/access-restricted" replace />;
  }

  return <>{children}</>;
}
