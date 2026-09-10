import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Drawing } from "../types/Drawing";
import { requestPurchase } from "../services/api";
import { formatPrice } from "../utils/formatPrice";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    requestPurchase(id).then(setDrawing).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10 text-dustyrose">Checking availability...</p>;
  if (error || !drawing) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-coral">{error ?? "Could not process the request."}</p>
        <Link to="/" className="text-sm text-dustyrose hover:text-gold mt-4 inline-block">← Back to gallery</Link>
      </div>
    );
  }

  const price = formatPrice(drawing.price);
  const message = encodeURIComponent(`Hi! I'm interested in the drawing "${drawing.title}" (${price}).`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <img src={drawing.imageUrl} alt={drawing.title} className="w-full max-h-72 object-cover rounded-lg border border-gold/20" />
      <h1 className="font-display text-xl text-cream mt-4">{drawing.title}</h1>
      <p className="text-2xl font-semibold text-gold mt-2">{price}</p>

      <div className="mt-6 bg-surface border border-gold/20 rounded-lg p-4 text-left text-sm text-dustyrose">
        <p className="font-semibold text-cream mb-2">How to complete your purchase:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click the button below to chat on WhatsApp</li>
          <li>Arrange payment (PIX or bank transfer) directly with the artist</li>
          <li>This drawing will stay reserved until confirmed</li>
        </ol>
      </div>

      
       <a href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-500 active:scale-95 transition-all duration-200"
      >
        Chat on WhatsApp
      </a>

      <Link to="/" className="block text-sm text-dustyrose hover:text-gold mt-4">← Back to gallery</Link>
    </div>
  );
}
