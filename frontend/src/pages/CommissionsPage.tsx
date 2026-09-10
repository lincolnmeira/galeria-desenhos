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
    getCommissionTypes().then((all) => setTypes(all.filter((t) => t.active))).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const order = await createCommissionOrder({ commissionTypeId: selectedTypeId, buyerName, buyerContact });
      setQueuePosition(order.priority);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center py-10 text-dustyrose">Loading...</p>;

  if (queuePosition !== null) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="font-display text-2xl text-gold">Request sent! ✦</h1>
        <p className="mt-2 text-dustyrose">You are in position <strong className="text-cream">{queuePosition}</strong> in the queue.</p>
        <Link to="/" className="text-sm text-dustyrose hover:text-gold mt-4 inline-block">← Back to gallery</Link>
      </div>
    );
  }

  const inputClasses = "w-full bg-maroon border border-gold/30 rounded-lg p-2 text-cream focus:outline-none focus:border-gold";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-sm text-dustyrose hover:text-gold transition-colors">← Back to gallery</Link>
      <h1 className="font-display text-3xl text-gold text-center mt-4 mb-8">✦ Commissions</h1>

      <table className="w-full border-collapse mb-10 text-cream">
        <thead>
          <tr className="border-b border-gold/20 text-left">
            <th className="py-2">Type</th><th className="py-2">Price</th><th className="py-2">Rules</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type.id} className="border-b border-gold/10">
              <td className="py-2 font-semibold">{type.name}</td>
              <td className="py-2 text-gold">{formatPrice(type.priceMin)} - {formatPrice(type.priceMax)}</td>
              <td className="py-2 text-sm text-dustyrose">{type.rules}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-cream">Commission type</label>
          <select required value={selectedTypeId} onChange={(e) => setSelectedTypeId(e.target.value)} className={inputClasses}>
            <option value="">Select...</option>
            {types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-cream">Your name</label>
          <input required type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-cream">WhatsApp</label>
          <input required type="text" placeholder="+1 555 123 4567" value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)} className={inputClasses} />
        </div>
        {submitError && <p className="text-coral text-sm">{submitError}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-maroon font-semibold py-3 rounded-lg hover:bg-cream active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Request commission"}
        </button>
      </form>
    </div>
  );
}