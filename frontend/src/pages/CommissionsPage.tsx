import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CommissionType } from "../types/CommissionType";
import { getCommissionTypes, createCommissionOrder } from "../services/api";
import { formatPrice } from "../utils/formatPrice";

export function CommissionsPage() {
  const [types, setTypes] = useState<CommissionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    getCommissionTypes()
      .then((allTypes) => setTypes(allTypes.filter((t) => t.active)))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const order = await createCommissionOrder({
        commissionTypeId: selectedTypeId,
        buyerName,
        buyerContact,
      });
      setQueuePosition(order.priority);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center py-10">Loading...</p>;

  if (queuePosition !== null) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Request sent! 🎉</h1>
        <p className="mt-2 text-gray-600">
          You are in position <strong>{queuePosition}</strong> in the queue.
        </p>
        <Link to="/" className="text-sm text-gray-500 hover:underline mt-4 inline-block">
          ← Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-sm text-gray-500 hover:underline">
        ← Back to gallery
      </Link>

      <h1 className="text-3xl font-bold text-center mt-4 mb-8">Commissions</h1>

      <table className="w-full border-collapse mb-10">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Type</th>
            <th className="py-2">Price</th>
            <th className="py-2">Rules</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type.id} className="border-b">
              <td className="py-2 font-semibold">{type.name}</td>
              <td className="py-2">
                {formatPrice(type.priceMin)} - {formatPrice(type.priceMax)}
              </td>
              <td className="py-2 text-sm text-gray-600">{type.rules}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Commission type</label>
          <select
            required
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select...</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Your name</label>
          <input
            required
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">WhatsApp</label>
          <input
            required
            type="text"
            placeholder="+1 555 123 4567"
            value={buyerContact}
            onChange={(e) => setBuyerContact(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Request commission"}
        </button>
      </form>
    </div>
  );
}