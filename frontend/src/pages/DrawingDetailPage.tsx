import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { getDrawingById } from "../services/api";

const statusLabels: Record<string, string> = {
  disponivel: "Disponível",
  pendente: "Pendente",
  reservado: "Reservado",
  vendido: "Vendido",
};

export function DrawingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getDrawingById(id)
      .then(setDrawing)
      .catch(() => setError("Desenho não encontrado."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10">Carregando...</p>;

  if (error || !drawing) {
    return (
      <p className="text-center py-10 text-red-600">
        {error ?? "Desenho não encontrado."}
      </p>
    );
  }

  const price = Number(drawing.price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-sm text-gray-500 hover:underline">
        ← Voltar para a galeria
      </Link>

      <div className="mt-4 rounded-lg overflow-hidden shadow-md bg-white">
        <img
          src={drawing.imageUrl}
          alt={drawing.title}
          className="w-full max-h-[500px] object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold">{drawing.title}</h1>
          <p className="text-gray-600 mt-2">{drawing.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold">{price}</span>
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {statusLabels[drawing.status]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}