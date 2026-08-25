import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { requestPurchase } from "../services/api";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    requestPurchase(id)
      .then(setDrawing)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Confirmando disponibilidade...</p>;
  }

  if (error || !drawing) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-red-600">{error ?? "Não foi possível processar a solicitação."}</p>
        <Link to="/" className="text-sm text-gray-500 hover:underline mt-4 inline-block">
          ← Voltar para a galeria
        </Link>
      </div>
    );
  }

  const price = Number(drawing.price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const message = encodeURIComponent(
    `Olá! Tenho interesse no desenho "${drawing.title}" (${price}).`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <img
        src={drawing.imageUrl}
        alt={drawing.title}
        className="w-full max-h-72 object-cover rounded-lg shadow-md"
      />
      <h1 className="text-xl font-bold mt-4">{drawing.title}</h1>
      <p className="text-2xl font-bold mt-2">{price}</p>

      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700">
        <p className="font-semibold mb-2">Como finalizar sua compra:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Clique no botão abaixo para conversar pelo WhatsApp</li>
          <li>Combine a forma de pagamento (PIX ou transferência) diretamente com a artista</li>
          <li>Este desenho ficará reservado até a confirmação</li>
        </ol>
      </div>

      
       <a href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
      >
        Conversar no WhatsApp
      </a>

      <Link to="/" className="block text-sm text-gray-500 hover:underline mt-4">
        ← Voltar para a galeria
      </Link>
    </div>
  );
}
