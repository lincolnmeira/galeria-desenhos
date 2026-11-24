import { useEffect, useState } from "react";
import type { Drawing } from "../types/Drawing";
import { getDrawings } from "../services/api";
import { DrawingCard } from "./DrawingCard";

export function Gallery() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDrawings()
      .then(setDrawings)
      .catch(() => setError("Could not load the gallery."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p role="status" className="mx-auto max-w-7xl px-5 py-16 text-center text-sm text-dustyrose">Loading the gallery...</p>;
  if (error) return <p role="alert" className="mx-auto max-w-2xl px-5 py-16 text-center text-sm text-coral">{error}</p>;
  if (drawings.length === 0) {
    return <p className="mx-auto max-w-2xl px-5 py-16 text-center text-sm text-dustyrose">New artwork is on its way. Please check back soon.</p>;
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 pt-6 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">
      {drawings.map((drawing) => (
        <DrawingCard key={drawing.id} drawing={drawing} />
      ))}
    </div>
  );
}
