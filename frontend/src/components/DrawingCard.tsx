import { Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { statusLabels } from "../utils/statusLabels";
import { formatPrice } from "../utils/formatPrice";

export function DrawingCard({ drawing }: { drawing: Drawing }) {
  return (
    <Link
      to={`/drawings/${drawing.id}`}
      className="group block rounded-lg overflow-hidden bg-surface border border-gold/20 hover:border-gold transition-colors duration-300"
    >
      <img
        src={drawing.imageUrl}
        alt={drawing.title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="p-4">
        <h3 className="font-display text-lg text-cream">{drawing.title}</h3>
        <p className="text-sm text-dustyrose mt-1">{drawing.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="font-semibold text-gold">{formatPrice(drawing.price)}</span>
          <span className="text-xs text-dustyrose">{statusLabels[drawing.status]}</span>
        </div>
      </div>
    </Link>
  );
}