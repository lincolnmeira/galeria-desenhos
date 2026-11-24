import { useEffect, useState } from "react";
import { getCommissionOrdersAdmin, updateCommissionOrder, deleteCommissionOrder } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const statusOptions = ["na_fila", "em_progresso", "concluido"];
const statusLabels: Record<string, string> = { na_fila: "In queue", em_progresso: "In progress", concluido: "Completed" };
const selectClass = "rounded-xl border border-gold/25 bg-maroon px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none";

interface Order {
  id: string;
  buyerName: string;
  buyerContact: string;
  contactPlatform?: string;
  priority: number;
  status: string;
  commissionType: { name: string };
}

export function CommissionOrdersAdminList() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getCommissionOrdersAdmin(token).then(setOrders)
      .catch(() => setError("Unable to load the request queue."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleChange(id: string, field: "status" | "priority", value: string | number) {
    if (!token) return;
    setError(null);
    try {
      const updated = await updateCommissionOrder(token, id, { [field]: value });
      setOrders((current) => current.map((order) => order.id === id ? updated : order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update this request.");
    }
  }

  async function handleDelete(id: string) {
    if (!token || !window.confirm("Permanently delete this commission request?")) return;
    setError(null);
    try {
      await deleteCommissionOrder(token, id);
      setOrders((current) => current.filter((order) => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this request.");
    }
  }

  if (loading) return <p className="py-6 text-sm text-dustyrose">Loading the request queue...</p>;
  if (error && orders.length === 0) return <p role="alert" className="rounded-xl bg-coral/10 p-4 text-sm text-coral">{error}</p>;
  if (orders.length === 0) return <p className="rounded-2xl border border-dashed border-gold/25 p-8 text-center text-sm text-dustyrose">No commission requests yet.</p>;

  return (
    <div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-coral/10 p-3 text-sm text-coral">{error}</p>}
      <div className="grid gap-3 md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-gold/10 bg-maroon/45 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="text-xs uppercase tracking-wider text-dustyrose">Request #{order.priority}</p><h3 className="mt-1 truncate font-semibold text-cream">{order.buyerName}</h3><p className="mt-1 text-sm text-gold">{order.commissionType.name}</p></div>
              <button type="button" onClick={() => void handleDelete(order.id)} className="shrink-0 text-xs text-coral hover:underline">Delete</button>
            </div>
            <p className="mt-3 break-all text-xs text-dustyrose"><span className="text-cream">{order.contactPlatform === "discord" ? "Discord" : "Previous WhatsApp contact"}:</span> {order.buyerContact}</p>
            <div className="mt-4 grid grid-cols-[100px_minmax(0,1fr)] gap-3">
              <label className="text-xs text-dustyrose">Queue position<input type="number" min="1" value={order.priority} onChange={(event) => void handleChange(order.id, "priority", Number(event.target.value))} className={`${selectClass} mt-1 w-full`} /></label>
              <label className="text-xs text-dustyrose">Progress<select value={order.status} onChange={(event) => void handleChange(order.id, "status", event.target.value)} className={`${selectClass} mt-1 w-full`}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm text-cream">
          <thead><tr className="border-b border-gold/20 text-xs uppercase tracking-wider text-dustyrose"><th className="py-3 pr-3">Position</th><th className="py-3 pr-3">Client</th><th className="py-3 pr-3">Commission</th><th className="py-3 pr-3">Progress</th><th className="py-3 text-right">Action</th></tr></thead>
          <tbody>{orders.map((order) => (
            <tr key={order.id} className="border-b border-gold/10 last:border-0">
              <td className="py-3 pr-3"><input type="number" min="1" value={order.priority} onChange={(event) => void handleChange(order.id, "priority", Number(event.target.value))} className={`${selectClass} w-20`} /></td>
              <td className="py-3 pr-3"><span className="block font-medium">{order.buyerName}</span><span className="mt-1 block text-xs text-dustyrose">{order.contactPlatform === "discord" ? "Discord" : "Previous WhatsApp contact"}: {order.buyerContact}</span></td>
              <td className="py-3 pr-3 text-gold">{order.commissionType.name}</td>
              <td className="py-3 pr-3"><select value={order.status} onChange={(event) => void handleChange(order.id, "status", event.target.value)} className={selectClass}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td>
              <td className="py-3 text-right"><button type="button" onClick={() => void handleDelete(order.id)} className="text-xs text-coral hover:underline">Delete</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
