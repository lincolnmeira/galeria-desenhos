import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { createDrawing, updateDrawing, uploadImage } from "../../services/api";
import type { Drawing } from "../../types/Drawing";

export function DrawingForm({ editing, onSaved, onCancel }: { editing?: Drawing | null; onSaved: () => void; onCancel: () => void }) {
  const { token } = useAuth();
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [price, setPrice] = useState(editing?.price ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(editing?.title ?? ""); setDescription(editing?.description ?? "");
    setPrice(editing?.price ?? ""); setFile(null); setError(null);
  }, [editing]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || (!editing && !file)) return;
    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = file ? await uploadImage(token, file) : editing?.imageUrl;
      if (!imageUrl) throw new Error("Choose an artwork image.");
      const input = { title: title.trim(), description: description.trim(), price, imageUrl };
      if (editing) await updateDrawing(token, editing.id, input);
      else await createDrawing(token, input);
      setTitle(""); setDescription(""); setPrice(""); setFile(null);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this artwork. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses = "w-full rounded-xl border border-gold/20 bg-maroon px-4 py-3 text-cream placeholder:text-dustyrose/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-gold/20 bg-surface p-5 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-7">
      <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-dustyrose">Collection editor</p><h3 className="mt-2 font-display text-2xl text-cream">{editing ? "Edit artwork" : "Add a new artwork"}</h3></div>

      <label className="block text-sm font-medium text-cream">Artwork title
        <input required maxLength={120} type="text" placeholder="Artwork title" value={title}
          onChange={(e) => setTitle(e.target.value)} className={`${inputClasses} mt-2`} />
      </label>
      <label className="block text-sm font-medium text-cream">Description
        <textarea required maxLength={2000} rows={3} placeholder="A short description for your gallery" value={description}
          onChange={(e) => setDescription(e.target.value)} className={`${inputClasses} mt-2 resize-y`} />
      </label>
      <label className="block text-sm font-medium text-cream">Price (USD)
        <input required type="number" min="0" step="0.01" placeholder="50.00" value={price}
          onChange={(e) => setPrice(e.target.value)} className={`${inputClasses} mt-2`} />
      </label>

      {editing?.imageUrl && !file && <img src={editing.imageUrl} alt="Current artwork preview" className="max-h-56 rounded-2xl border border-gold/20 bg-maroon object-contain" />}
      <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-gold/30 bg-maroon p-4 transition-colors hover:border-gold">
        <span className="text-sm text-dustyrose truncate">
          {file ? file.name : editing ? "Choose a new PNG to replace the current image..." : "Choose a PNG artwork image..."}
        </span>
        <span className="shrink-0 text-xs font-semibold text-gold border border-gold/40 rounded px-3 py-1">
          Browse
        </span>
        <input
          key={`${editing?.id ?? "new"}-${file?.name ?? "none"}`}
          required={!editing}
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {error && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-maroon transition hover:bg-cream disabled:opacity-50">
          {submitting ? "Saving..." : editing ? "Save changes" : "Add to gallery"}
        </button>
        {editing && <button type="button" onClick={onCancel} className="rounded-full border border-gold/30 px-5 py-3 text-sm text-cream hover:border-gold">Cancel</button>}
      </div>
    </form>
  );
}
