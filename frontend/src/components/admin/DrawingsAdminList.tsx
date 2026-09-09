import { useEffect, useState } from "react";
import type { Drawing, DrawingStatus } from "../../types/Drawing";
import { getDrawings, updateDrawingStatus, deleteDrawing } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import { statusLabels } from "../../utils/statusLabels";

const statusOptions: DrawingStatus[] = ["disponivel", "pendente", "reservado", "vendido"];

export function DrawingsAdminList({ refreshKey }: { refreshKey: number }) {
  const { token } = useAuth();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrawings().then(setDrawings).finally(() => setLoading(false));
  }, [refreshKey]);

  async function handleStatusChange(id: string, status: DrawingStatus) {
    if (!token) return;
    const updated = await updateDrawingStatus(token, id, status);
    setDrawings((prev) => prev.map((d) => (d.id === id ? updated : d)));
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("Delete this drawing?")) return;
    await deleteDrawing(token, id);
    setDrawings((prev) => prev.filter((d) => d.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Title</th><th className="py-2">Price</th>
          <th className="py-2">Status</th><th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {drawings.map((drawing) => (
          <tr key={drawing.id} className="border-b">
            <td className="py-2">{drawing.title}</td>
            <td className="py-2">{formatPrice(drawing.price)}</td>
            <td className="py-2">
              <select value={drawing.status}
                onChange={(e) => handleStatusChange(drawing.id, e.target.value as DrawingStatus)}
                className="border rounded p-1">
                {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </td>
            <td className="py-2">
              <button onClick={() => handleDelete(drawing.id)} className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}