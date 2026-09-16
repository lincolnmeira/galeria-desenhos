import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DrawingForm } from "../components/admin/DrawingForm";
import { DrawingsAdminList } from "../components/admin/DrawingsAdminList";
import { CommissionOrdersAdminList } from "../components/admin/CommissionOrdersAdminList";

export function AdminPage() {
  const { logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gold/20">
        <h1 className="font-display text-2xl text-gold">✦ Admin Dashboard</h1>
        <button onClick={logout} className="text-sm text-dustyrose hover:text-gold transition-colors">
          Sign out
        </button>
      </div>

      <DrawingForm onCreated={() => setRefreshKey((k) => k + 1)} />

      <section className="mb-10">
        <h2 className="font-display text-lg text-gold mb-3">Drawings</h2>
        <DrawingsAdminList refreshKey={refreshKey} />
      </section>

      <section>
        <h2 className="font-display text-lg text-gold mb-3">Commission queue</h2>
        <CommissionOrdersAdminList />
      </section>
    </div>
  );
}