import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CommissionType } from "../types/CommissionType";
import { getCommissionTypes, createCommissionOrder } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { PublicHeader } from "../components/PublicHeader";
import { discordProfileUrl } from "../utils/discord";

function priceLabel(type: CommissionType) {
  if (Number(type.priceMin) === Number(type.priceMax)) return formatPrice(type.priceMin);
  return `From ${formatPrice(type.priceMin)}`;
}

export function CommissionsPage() {
  const [types, setTypes] = useState<CommissionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    getCommissionTypes().then((all) => {
      setTypes(all);
      if (all.length) setSelectedTypeId(all[0].id);
    }).catch(() => setLoadError(true)).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError(null); setSubmitting(true);
    try {
      const order = await createCommissionOrder({ commissionTypeId: selectedTypeId, buyerName, buyerContact });
      setQueuePosition(order.priority);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,168,85,0.08),transparent_40%)]">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-dustyrose">Made just for you</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-cream sm:text-6xl">Commission a character <span className="text-gold">✦</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-dustyrose sm:text-lg">Choose the style that fits your idea. Each piece is drawn with care, then delivered as a high-resolution PNG.</p>
        </div>

        {loading ? <p className="py-16 text-center text-sm text-dustyrose">Loading commission options...</p> : loadError ? (
          <p role="alert" className="mx-auto mt-12 max-w-xl rounded-2xl border border-coral/25 bg-coral/10 p-5 text-center text-coral">Commission options could not be loaded. Please try again in a moment.</p>
        ) : types.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-gold/15 bg-surface/70 p-8 text-center"><h2 className="font-display text-2xl text-cream">Commissions are taking a little break</h2><p className="mt-3 text-sm leading-6 text-dustyrose">Please check back soon to see when requests reopen.</p></div>
        ) : <>
          <section aria-label="Commission types" className="mx-auto mt-12 grid max-w-6xl gap-5 sm:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {types.map((type) => {
              const selected = selectedTypeId === type.id;
              return <article key={type.id} className={`group overflow-hidden rounded-[1.75rem] border bg-surface transition-all duration-300 ${selected ? "border-gold/70 shadow-[0_18px_60px_rgba(212,168,85,0.12)]" : "border-gold/15 hover:-translate-y-1 hover:border-gold/40"}`}>
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(212,168,85,0.08),transparent_70%)]">
                  {type.sampleImageUrl ? <img src={type.sampleImageUrl} alt={`${type.name} commission example`} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]" /> : <div aria-hidden="true" className="flex size-24 items-center justify-center rounded-full border border-gold/20 text-4xl text-gold/70">✦</div>}
                  {selected && <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-maroon">Selected</span>}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3"><h2 className="font-display text-2xl text-cream">{type.name}</h2><p className="shrink-0 text-right text-lg font-semibold text-gold">{priceLabel(type)}{Number(type.priceMin) !== Number(type.priceMax) && <span className="block text-[10px] font-normal text-dustyrose">{formatPrice(type.priceMax)} max</span>}</p></div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-dustyrose">{type.rules}</p>
                  <button type="button" onClick={() => setSelectedTypeId(type.id)} aria-pressed={selected} className={`mt-6 w-full rounded-full px-5 py-3 text-sm font-bold transition-all ${selected ? "border border-gold/50 bg-gold/10 text-gold" : "border border-gold/30 text-cream hover:border-gold hover:bg-gold hover:text-maroon"}`}>
                    {selected ? "Selected for your request" : "Choose this style"}
                  </button>
                </div>
              </article>;
            })}
          </section>

          <section id="request-form" className="mx-auto mt-14 grid max-w-5xl gap-8 rounded-[2rem] border border-gold/15 bg-surface/75 p-5 sm:mt-20 sm:grid-cols-[0.85fr_1.15fr] sm:p-9">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-dustyrose">Your next step</p>
              <h2 className="mt-3 font-display text-3xl text-cream">Let’s make it yours.</h2>
              <p className="mt-4 text-sm leading-6 text-dustyrose">Send a request to join the artist’s queue. Share your Discord username so the artist can follow up with you about your idea and final quote.</p>
              <a href={discordProfileUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#5865F2]/45 px-4 py-2.5 text-sm font-semibold text-cream transition hover:border-[#7289da] hover:bg-[#5865F2]/10">Open Discord <span aria-hidden="true">↗</span></a>
            </div>

            {queuePosition !== null ? <div role="status" className="flex flex-col justify-center rounded-2xl border border-gold/20 bg-maroon/60 p-6 text-center sm:p-8">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/10 text-2xl text-gold">✦</span>
              <h3 className="mt-4 font-display text-2xl text-cream">You’re on the list!</h3>
              <p className="mt-2 text-sm text-dustyrose">Your request is in position <strong className="text-gold">{queuePosition}</strong>. Open Discord to introduce yourself and share your reference images.</p>
              <a href={discordProfileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 rounded-full bg-[#5865F2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7289da]">Continue on Discord</a>
              <Link to="/" className="mt-4 text-sm text-dustyrose hover:text-gold">Back to gallery</Link>
            </div> : <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gold/10 bg-maroon/45 p-5 sm:p-6">
              <div className="rounded-xl border border-gold/15 bg-surface/70 px-4 py-3"><span className="text-xs uppercase tracking-wider text-dustyrose">Selected style</span><p className="mt-1 font-semibold text-cream">{types.find((type) => type.id === selectedTypeId)?.name ?? "Choose an option above"}</p></div>
              <label className="block text-sm font-medium text-cream">Your name<input required maxLength={120} autoComplete="name" value={buyerName} onChange={(event) => setBuyerName(event.target.value)} className="mt-2 w-full rounded-xl border border-gold/20 bg-maroon px-4 py-3 text-cream placeholder:text-dustyrose/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" placeholder="Name or nickname" /></label>
              <label className="block text-sm font-medium text-cream">Discord username<input required maxLength={120} autoComplete="off" value={buyerContact} onChange={(event) => setBuyerContact(event.target.value)} className="mt-2 w-full rounded-xl border border-gold/20 bg-maroon px-4 py-3 text-cream placeholder:text-dustyrose/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" placeholder="Your Discord username" /><span className="mt-1 block text-xs text-dustyrose">So the artist can find you and reply.</span></label>
              {submitError && <p role="alert" className="rounded-xl bg-coral/10 p-3 text-sm text-coral">{submitError}</p>}
              <button type="submit" disabled={submitting || !selectedTypeId} className="w-full rounded-full bg-gold px-5 py-3.5 text-sm font-bold text-maroon transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Sending request..." : "Join the commission queue"}</button>
              <p className="text-center text-[11px] leading-5 text-dustyrose">Final scope, price and timing will be confirmed with the artist before work begins.</p>
            </form>}
          </section>
        </>}
      </main>
      <footer className="border-t border-gold/10 px-5 py-6 text-center text-xs text-dustyrose">Illustrated with care <span className="text-gold">✦</span></footer>
    </div>
  );
}
