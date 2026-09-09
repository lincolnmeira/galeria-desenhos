import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { createDrawing, uploadImage } from "../../services/api";

export function DrawingForm({ onCreated }: { onCreated: () => void }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || !file) return;
    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = await uploadImage(token, file);
      await createDrawing(token, { title, description, price, imageUrl });
      setTitle(""); setDescription(""); setPrice(""); setFile(null);
      onCreated();
    } catch {
      setError("Error creating drawing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded-lg p-4 mb-8">
      <h2 className="font-semibold">Add new drawing</h2>
      <input required type="text" placeholder="Title" value={title}
        onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg p-2" />
      <textarea required placeholder="Description" value={description}
        onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-2" />
      <input required type="number" step="0.01" placeholder="Price" value={price}
        onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-lg p-2" />
      <input required type="file" accept="image/png"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={submitting}
        className="bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50">
        {submitting ? "Saving..." : "Add drawing"}
      </button>
    </form>
  );
}