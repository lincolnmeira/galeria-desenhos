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
      .catch(() => setError("Não foi possível carregar a galeria."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10">Carregando...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (drawings.length === 0) {
    return <p className="text-center py-10">Nenhum desenho disponível ainda.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {drawings.map((drawing) => (
        <DrawingCard key={drawing.id} drawing={drawing} />
      ))}
    </div>
  );
}