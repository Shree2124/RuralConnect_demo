import React from "react";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

export default function AccessRestricted() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h1>
        <p className="text-slate-500 text-sm mb-6">You don't have permission to view this page. Please log in with an appropriate role.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate(-1)}><ArrowLeft size={14} />Go Back</Button>
          <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
        </div>
      </div>
    </div>
  );
}
