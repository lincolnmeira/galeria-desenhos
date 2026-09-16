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

  const inputClasses = "w-full bg-maroon border border-gold/30 rounded-lg p-2 text-cream placeholder:text-dustyrose/60 focus:outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-gold/20 bg-surface rounded-lg p-5 mb-8">
      <h2 className="font-display text-lg text-gold">Add new drawing</h2>

      <input required type="text" placeholder="Title" value={title}
        onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
      <textarea required placeholder="Description" value={description}
        onChange={(e) => setDescription(e.target.value)} className={inputClasses} />
      <input required type="number" step="0.01" placeholder="Price" value={price}
        onChange={(e) => setPrice(e.target.value)} className={inputClasses} />

      <label className="flex items-center justify-between gap-3 w-full bg-maroon border border-dashed border-gold/30 rounded-lg p-3 cursor-pointer hover:border-gold transition-colors">
        <span className="text-sm text-dustyrose truncate">
          {file ? file.name : "Choose a PNG file..."}
        </span>
        <span className="shrink-0 text-xs font-semibold text-gold border border-gold/40 rounded px-3 py-1">
          Browse
        </span>
        <input
          required
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {error && <p className="text-coral text-sm">{error}</p>}

      <button type="submit" disabled={submitting}
        className="bg-gold text-maroon font-semibold py-2 px-4 rounded-lg hover:bg-cream active:scale-95 transition-all duration-200 disabled:opacity-50">
        {submitting ? "Saving..." : "Add drawing"}
      </button>
    </form>
  );
}