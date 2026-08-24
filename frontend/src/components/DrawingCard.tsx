import { Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";

interface DrawingCardProps {
  drawing: Drawing;
}

const statusLabels: Record<string, string> = {
  disponivel: "Disponível",
  pendente: "Pendente",
  reservado: "Reservado",
  vendido: "Vendido",
};

export function DrawingCard({ drawing }: DrawingCardProps) {
  const price = Number(drawing.price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Link
      to={`/drawings/${drawing.id}`}
      className="rounded-lg overflow-hidden shadow-md bg-white block hover:shadow-lg transition-shadow"
    >
      <img
        src={drawing.imageUrl}
        alt={drawing.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{drawing.title}</h3>
        <p className="text-sm text-gray-600">{drawing.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold">{price}</span>
          <span className="text-xs uppercase tracking-wide text-gray-500">
            {statusLabels[drawing.status]}
          </span>
        </div>
      </div>
    </Link>
  );
}