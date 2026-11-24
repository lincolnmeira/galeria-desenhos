import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { getDrawingById } from "../services/api";
import { statusLabels } from "../utils/statusLabels";
import { formatPrice } from "../utils/formatPrice";
import { PublicHeader } from "../components/PublicHeader";

export function DrawingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDrawingById(id).then(setDrawing).catch(() => setError("Artwork not found.")).finally(() => setLoading(false));
  }, [id]);

  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,168,85,0.08),transparent_40%)]">
    <PublicHeader />
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-dustyrose transition hover:text-gold"><span aria-hidden="true">←</span> Back to gallery</Link>
      {loading ? <p role="status" className="py-20 text-center text-sm text-dustyrose">Loading artwork...</p> : error || !drawing ? (
        <p role="alert" className="mx-auto mt-12 max-w-xl rounded-2xl border border-coral/20 bg-surface p-6 text-center text-sm text-coral">{error ?? "Artwork not found."}</p>
      ) : <article className="mx-auto mt-7 grid max-w-5xl overflow-hidden rounded-[2rem] border border-gold/15 bg-surface shadow-[0_25px_80px_rgba(0,0,0,0.24)] md:grid-cols-[1.2fr_0.8fr]">
        <div className="flex min-h-80 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(212,168,85,0.08),transparent_70%)] p-5 sm:min-h-[600px] sm:p-9"><img src={drawing.imageUrl} alt={drawing.title} className="max-h-[560px] w-full rounded-2xl object-contain" /></div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-dustyrose">One-of-a-kind artwork</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-cream">{drawing.title}</h1>
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-dustyrose">{drawing.description}</p>
          <div className="mt-8 flex items-center justify-between gap-4 border-y border-gold/10 py-5"><span className="text-2xl font-semibold text-gold">{formatPrice(drawing.price)}</span><span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-cream">{statusLabels[drawing.status]}</span></div>
          {drawing.status === "disponivel" ? <Link to={`/drawings/${drawing.id}/purchase`} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-maroon transition hover:bg-cream">Request this piece <span aria-hidden="true">→</span></Link> : <p className="mt-7 rounded-2xl border border-gold/15 bg-maroon/40 p-4 text-sm leading-6 text-dustyrose">This piece is not available to purchase right now. Browse the rest of the gallery or request a custom commission.</p>}
          <Link to="/commissions" className="mt-4 text-center text-sm text-dustyrose transition hover:text-gold">Explore custom commissions</Link>
        </div>
      </article>}
    </main>
  </div>;
}
