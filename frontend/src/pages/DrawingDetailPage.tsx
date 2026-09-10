import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { getDrawingById } from "../services/api";
import { statusLabels } from "../utils/statusLabels";
import { formatPrice } from "../utils/formatPrice";

export function DrawingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDrawingById(id).then(setDrawing).catch(() => setError("Drawing not found.")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10 text-dustyrose">Loading...</p>;
  if (error || !drawing) return <p className="text-center py-10 text-coral">{error ?? "Drawing not found."}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-sm text-dustyrose hover:text-gold transition-colors">← Back to gallery</Link>

      <div className="mt-4 rounded-lg overflow-hidden bg-surface border border-gold/20">
        <img src={drawing.imageUrl} alt={drawing.title} className="w-full max-h-[500px] object-cover" />
        <div className="p-6">
          <h1 className="font-display text-2xl text-cream">{drawing.title}</h1>
          <p className="text-dustyrose mt-2">{drawing.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-semibold text-gold">{formatPrice(drawing.price)}</span>
            <span className="text-xs text-dustyrose">{statusLabels[drawing.status]}</span>
          </div>

          {drawing.status === "disponivel" && (
            <Link
              to={`/drawings/${drawing.id}/purchase`}
              className="mt-5 block text-center bg-gold text-maroon font-semibold py-3 rounded-lg hover:bg-cream active:scale-95 transition-all duration-200"
            >
              Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}