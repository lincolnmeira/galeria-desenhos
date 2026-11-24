import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DrawingForm } from "../components/admin/DrawingForm";
import { DrawingsAdminList } from "../components/admin/DrawingsAdminList";
import { CommissionOrdersAdminList } from "../components/admin/CommissionOrdersAdminList";
import { CommissionTypesAdmin } from "../components/admin/CommissionTypesAdmin";
import { Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";

type AdminSection = "gallery" | "commissions" | "queue";

export function AdminPage() {
  const { logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [section, setSection] = useState<AdminSection>("gallery");
  const [editingDrawing, setEditingDrawing] = useState<Drawing | null>(null);

  const navItems: { id: AdminSection; label: string; detail: string }[] = [
    { id: "gallery", label: "Gallery", detail: "Artwork and availability" },
    { id: "commissions", label: "Commission menu", detail: "Types, prices and examples" },
    { id: "queue", label: "Request queue", detail: "Clients and progress" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,85,0.10),transparent_35%)]">
      <header className="border-b border-gold/10 bg-maroon/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-dustyrose">Artist workspace</p>
            <h1 className="mt-1 font-display text-2xl text-cream sm:text-3xl">Studio dashboard <span className="text-gold">✦</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden rounded-full border border-gold/20 px-4 py-2 text-sm text-dustyrose transition hover:border-gold/50 hover:text-cream sm:inline-flex">View public site</Link>
            <button onClick={logout} className="rounded-full border border-gold/20 px-4 py-2 text-sm text-cream transition hover:border-coral/50 hover:text-coral">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-10">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-dustyrose">Manage your site</p>
          <nav aria-label="Dashboard sections" className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => setSection(item.id)} aria-current={section === item.id ? "page" : undefined}
                className={`rounded-2xl border p-3 text-left transition-all ${section === item.id ? "border-gold/40 bg-surface shadow-lg shadow-black/10" : "border-transparent hover:border-gold/15 hover:bg-surface/50"}`}>
                <span className={`block text-sm font-semibold ${section === item.id ? "text-gold" : "text-cream"}`}>{item.label}</span>
                <span className="mt-1 hidden text-xs text-dustyrose sm:block">{item.detail}</span>
              </button>
            ))}
          </nav>
          <div className="mt-6 hidden rounded-2xl border border-gold/10 bg-surface/50 p-4 text-xs leading-5 text-dustyrose lg:block">
            <span className="mb-2 block text-lg text-gold">✦</span>
            Changes to your commission menu appear on the public site as soon as they are saved.
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dustyrose">{navItems.find((item) => item.id === section)?.detail}</p>
            <h2 className="mt-2 font-display text-3xl text-cream">{navItems.find((item) => item.id === section)?.label}</h2>
          </div>

          {section === "gallery" && <div className="space-y-8">
            <DrawingForm editing={editingDrawing} onCancel={() => setEditingDrawing(null)} onSaved={() => { setEditingDrawing(null); setRefreshKey((key) => key + 1); }} />
            <section className="rounded-3xl border border-gold/15 bg-surface/50 p-5 sm:p-7">
              <div className="mb-5"><p className="text-xs uppercase tracking-[0.18em] text-dustyrose">Manage the artwork collection</p><h3 className="mt-2 font-display text-2xl text-cream">Gallery inventory</h3></div>
              <DrawingsAdminList refreshKey={refreshKey} onEdit={setEditingDrawing} />
            </section>
          </div>}

          {section === "commissions" && <CommissionTypesAdmin />}

          {section === "queue" && <section className="rounded-3xl border border-gold/15 bg-surface/50 p-5 sm:p-7">
            <p className="mb-5 text-sm leading-6 text-dustyrose">Keep track of each request, update its place in line, and mark progress as you work.</p>
            <CommissionOrdersAdminList />
          </section>}
        </div>
      </main>
    </div>
  );
}
