import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { requestPurchase } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { PublicHeader } from "../components/PublicHeader";
import { discordProfileUrl } from "../utils/discord";

const purchaseSteps = [
  "Open Discord and send the artist the message below.",
  "Confirm availability, payment and delivery details directly with the artist.",
  "The artwork stays pending while the artist confirms your request.",
];

export function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyNotice, setCopyNotice] = useState("Click the message to select it, or copy it for Discord.");

  useEffect(() => {
    if (!id) return;
    requestPurchase(id).then(setDrawing).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  async function copyMessage(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      setCopyNotice("Message copied. Paste it into Discord to start the conversation.");
    } catch {
      setCopyNotice("Select the message above and copy it into Discord.");
    }
  }

  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,168,85,0.08),transparent_40%)]">
    <PublicHeader />
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-14">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-dustyrose transition hover:text-gold"><span aria-hidden="true">←</span> Back to gallery</Link>
      {loading ? <p className="py-20 text-center text-dustyrose">Checking artwork availability...</p> : error || !drawing ? (
        <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-coral/20 bg-surface p-8 text-center"><span className="text-3xl text-coral">✦</span><h1 className="mt-4 font-display text-2xl text-cream">We couldn’t reserve this piece</h1><p className="mt-3 text-sm leading-6 text-dustyrose">{error ?? "This artwork is no longer available."}</p><Link to="/" className="mt-6 inline-flex rounded-full border border-gold/30 px-5 py-2.5 text-sm text-cream hover:border-gold">Return to gallery</Link></div>
      ) : <div className="mx-auto mt-7 grid max-w-4xl overflow-hidden rounded-[2rem] border border-gold/15 bg-surface shadow-[0_25px_80px_rgba(0,0,0,0.24)] md:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(212,168,85,0.09),transparent_70%)] p-5 sm:min-h-[520px] sm:p-8"><img src={drawing.imageUrl} alt={drawing.title} className="max-h-[480px] w-full rounded-2xl object-contain" /></div>
        <div className="flex flex-col p-6 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-dustyrose">A little closer to yours</p>
          <h1 className="mt-3 font-display text-3xl text-cream">{drawing.title}</h1>
          <p className="mt-2 text-2xl font-semibold text-gold">{formatPrice(drawing.price)}</p>
          <div className="mt-7 rounded-2xl border border-gold/15 bg-maroon/50 p-5">
            <h2 className="font-display text-lg text-cream">How to complete your purchase</h2>
            <ol className="mt-4 space-y-4">{purchaseSteps.map((step, index) => <li key={step} className="flex items-start gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-maroon">{index + 1}</span><span className="pt-1 text-sm leading-6 text-dustyrose">{step}</span></li>)}</ol>
          </div>
          <div className="mt-5 rounded-2xl border border-gold/10 bg-maroon/35 p-4">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wider text-dustyrose">Message to send</p><button type="button" onClick={() => void copyMessage(`Hi! I'm interested in the drawing “${drawing.title}” (${formatPrice(drawing.price)}).`)} className="text-xs font-semibold text-gold hover:text-cream">Copy message</button></div>
            <p className="mt-2 select-all text-sm leading-6 text-cream">Hi! I’m interested in the drawing “{drawing.title}” ({formatPrice(drawing.price)}).</p>
            <p role="status" className="mt-2 text-[11px] text-dustyrose">{copyNotice}</p>
          </div>
          <a href={discordProfileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#5865F2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7289da] active:scale-[0.99]">Open Discord <span aria-hidden="true">↗</span></a>
          <p className="mt-3 text-center text-xs leading-5 text-dustyrose">Paste the message above in your conversation with the artist.</p>
        </div>
      </div>}
    </main>
  </div>;
}
