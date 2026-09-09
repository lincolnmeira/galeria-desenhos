import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DrawingForm } from "../components/admin/DrawingForm";
import { DrawingsAdminList } from "../components/admin/DrawingsAdminList";

export function AdminPage() {
  const { logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:underline">Sign out</button>
      </div>
      <DrawingForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <DrawingsAdminList refreshKey={refreshKey} />
    </div>
  );
}