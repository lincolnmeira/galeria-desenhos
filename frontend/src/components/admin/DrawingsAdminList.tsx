import { useEffect, useState } from "react";
import type { Drawing, DrawingStatus } from "../../types/Drawing";
import { getDrawings, updateDrawingStatus, deleteDrawing } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import { statusLabels } from "../../utils/statusLabels";

const statusOptions: DrawingStatus[] = ["disponivel", "pendente", "reservado", "vendido"];
const selectClass = "rounded-xl border border-gold/25 bg-maroon px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none";

export function DrawingsAdminList({ refreshKey, onEdit }: { refreshKey: number; onEdit: (drawing: Drawing) => void }) {
  const { token } = useAuth();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    getDrawings().then(setDrawings).catch(() => setError("Unable to load the gallery inventory."))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  async function handleStatusChange(id: string, status: DrawingStatus) {
    if (!token) return;
    setError(null);
    try {
      const updated = await updateDrawingStatus(token, id, status);
      setDrawings((prev) => prev.map((drawing) => drawing.id === id ? updated : drawing));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update artwork availability.");
    }
  }

  async function handleDelete(id: string) {
    if (!token || !window.confirm("Permanently delete this artwork?")) return;
    setError(null);
    try {
      await deleteDrawing(token, id);
      setDrawings((prev) => prev.filter((drawing) => drawing.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete artwork.");
    }
  }

  if (loading) return <p className="py-6 text-sm text-dustyrose">Loading gallery inventory...</p>;
  if (error && drawings.length === 0) return <p role="alert" className="rounded-xl bg-coral/10 p-4 text-sm text-coral">{error}</p>;
  if (drawings.length === 0) return <p className="rounded-2xl border border-dashed border-gold/25 p-8 text-center text-sm text-dustyrose">Your gallery is empty. Add your first artwork above.</p>;

  return (
    <div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-coral/10 p-3 text-sm text-coral">{error}</p>}
      <div className="grid gap-3 md:hidden">
        {drawings.map((drawing) => (
          <article key={drawing.id} className="flex gap-4 rounded-2xl border border-gold/10 bg-maroon/45 p-3">
            <img src={drawing.imageUrl} alt="" className="size-20 shrink-0 rounded-xl bg-maroon object-contain" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2"><h4 className="truncate font-semibold text-cream">{drawing.title}</h4><span className="shrink-0 text-sm font-semibold text-gold">{formatPrice(drawing.price)}</span></div>
              <label className="mt-3 block text-xs text-dustyrose">Availability
                <select value={drawing.status} onChange={(event) => void handleStatusChange(drawing.id, event.target.value as DrawingStatus)} className={`${selectClass} mt-1 w-full`}>
                  {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              </label>
              <div className="mt-2 flex gap-4"><button type="button" onClick={() => onEdit(drawing)} className="text-xs font-semibold text-gold hover:text-cream">Edit artwork</button><button type="button" onClick={() => void handleDelete(drawing.id)} className="text-xs text-coral hover:underline">Delete</button></div>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm text-cream">
          <thead><tr className="border-b border-gold/20 text-xs uppercase tracking-wider text-dustyrose"><th className="py-3 pr-4">Artwork</th><th className="py-3 pr-4">Price</th><th className="py-3 pr-4">Availability</th><th className="py-3 text-right">Actions</th></tr></thead>
          <tbody>{drawings.map((drawing) => (
            <tr key={drawing.id} className="border-b border-gold/10 last:border-0">
              <td className="py-3 pr-4"><div className="flex items-center gap-3"><img src={drawing.imageUrl} alt="" className="size-12 rounded-lg bg-maroon object-contain" /><span className="font-medium">{drawing.title}</span></div></td>
              <td className="py-3 pr-4 font-semibold text-gold">{formatPrice(drawing.price)}</td>
              <td className="py-3 pr-4"><select value={drawing.status} onChange={(event) => void handleStatusChange(drawing.id, event.target.value as DrawingStatus)} className={selectClass}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td>
              <td className="py-3 text-right"><div className="flex justify-end gap-4"><button type="button" onClick={() => onEdit(drawing)} className="text-xs font-semibold text-gold hover:text-cream">Edit</button><button type="button" onClick={() => void handleDelete(drawing.id)} className="text-xs text-coral hover:underline">Delete</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
