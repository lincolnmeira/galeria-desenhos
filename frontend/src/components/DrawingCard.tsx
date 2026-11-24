import { Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { statusLabels } from "../utils/statusLabels";
import { formatPrice } from "../utils/formatPrice";

export function DrawingCard({ drawing }: { drawing: Drawing }) {
  return (
    <Link
      to={`/drawings/${drawing.id}`}
      className="group block overflow-hidden rounded-[1.5rem] border border-gold/15 bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(212,168,85,0.08),transparent_70%)] p-4">
        <img src={drawing.imageUrl} alt={drawing.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-4 top-4 rounded-full border border-gold/15 bg-maroon/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream backdrop-blur">{statusLabels[drawing.status]}</span>
      </div>
      <div className="p-5 sm:p-5">
        <div className="flex items-start justify-between gap-3"><h3 className="font-display text-xl text-cream">{drawing.title}</h3><span className="shrink-0 pt-1 text-sm font-semibold text-gold">{formatPrice(drawing.price)}</span></div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-dustyrose">{drawing.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-gold/10 pt-4">
          <span className="text-xs text-dustyrose">Digital artwork · PNG</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold transition group-hover:gap-2">View piece <span aria-hidden="true">→</span></span>
        </div>
      </div>
    </Link>
  );
}
