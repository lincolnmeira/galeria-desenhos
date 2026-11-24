import { useEffect, useState, type FormEvent } from "react";
import type { CommissionType } from "../../types/CommissionType";
import {
  createCommissionType,
  deleteCommissionType,
  getCommissionTypesAdmin,
  updateCommissionType,
  uploadImage,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";

const fieldClass = "w-full rounded-xl border border-gold/20 bg-maroon px-4 py-3 text-cream placeholder:text-dustyrose/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export function CommissionTypesAdmin() {
  const { token } = useAuth();
  const [types, setTypes] = useState<CommissionType[]>([]);
  const [editing, setEditing] = useState<CommissionType | null>(null);
  const [name, setName] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [isRange, setIsRange] = useState(false);
  const [rules, setRules] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [sampleInputVersion, setSampleInputVersion] = useState(0);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    try {
      setTypes(await getCommissionTypesAdmin(token));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load commission types.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, [token]);

  function resetForm() {
    setEditing(null); setName(""); setPriceMin(""); setPriceMax(""); setIsRange(false);
    setRules(""); setSampleUrl(""); setSampleFile(null); setActive(true);
    setSampleInputVersion((version) => version + 1);
  }

  function startEditing(type: CommissionType) {
    setEditing(type); setName(type.name); setPriceMin(type.priceMin);
    setPriceMax(type.priceMax); setIsRange(Number(type.priceMin) !== Number(type.priceMax));
    setRules(type.rules); setSampleUrl(type.sampleImageUrl ?? ""); setSampleFile(null); setActive(type.active);
    setSampleInputVersion((version) => version + 1);
    setNotice(null); setError(null);
    document.getElementById("commission-type-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true); setError(null); setNotice(null);
    try {
      const uploadedUrl = sampleFile ? await uploadImage(token, sampleFile) : sampleUrl;
      const input = {
        name: name.trim(), priceMin, priceMax: isRange ? priceMax : priceMin,
        rules: rules.trim(), sampleImageUrl: uploadedUrl || null, active,
      };
      if (editing) await updateCommissionType(token, editing.id, input);
      else await createCommissionType(token, input);
      await refresh();
      setNotice(editing ? "Commission option updated." : "Commission option created.");
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this commission option.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(type: CommissionType) {
    if (!token) return;
    setError(null); setNotice(null);
    try {
      const updated = await updateCommissionType(token, type.id, {
        name: type.name, priceMin: type.priceMin, priceMax: type.priceMax,
        rules: type.rules, sampleImageUrl: type.sampleImageUrl, active: !type.active,
      });
      setTypes((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(updated.active ? `${updated.name} is open for requests.` : `${updated.name} has been paused.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update availability.");
    }
  }

  async function handleDelete(type: CommissionType) {
    if (!token || !window.confirm(`Permanently delete “${type.name}”? Use Pause if you want to keep its order history.`)) return;
    setError(null); setNotice(null);
    try {
      await deleteCommissionType(token, type.id);
      setTypes((current) => current.filter((item) => item.id !== type.id));
      if (editing?.id === type.id) resetForm();
      setNotice("Commission option deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this option. Try pausing it instead.");
    }
  }

  return (
    <div className="space-y-8">
      <section id="commission-type-editor" className="scroll-mt-6 rounded-3xl border border-gold/20 bg-surface p-5 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dustyrose">Public commission menu</p>
            <h3 className="mt-2 font-display text-2xl text-cream">{editing ? "Edit an option" : "Add an option"}</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-dustyrose">Set a fixed price or a range, explain what is included, and add an artwork sample.</p>
          </div>
          {editing && <button type="button" onClick={resetForm} className="rounded-full border border-gold/30 px-4 py-2 text-sm text-cream hover:border-gold">Cancel edit</button>}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-cream md:col-span-2">Commission type
            <input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Half Body" className={`${fieldClass} mt-2`} />
          </label>

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-cream">Price (USD)</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Price format">
              <button type="button" onClick={() => setIsRange(false)} aria-pressed={!isRange} className={`rounded-full px-4 py-2 text-sm transition-colors ${!isRange ? "bg-gold text-maroon" : "border border-gold/25 text-cream hover:border-gold"}`}>Fixed price</button>
              <button type="button" onClick={() => setIsRange(true)} aria-pressed={isRange} className={`rounded-full px-4 py-2 text-sm transition-colors ${isRange ? "bg-gold text-maroon" : "border border-gold/25 text-cream hover:border-gold"}`}>Price range</button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-dustyrose">{isRange ? "Minimum" : "Price"}
                <input required type="number" min="0" max="1000000" step="0.01" value={priceMin} onChange={(event) => { setPriceMin(event.target.value); if (!isRange) setPriceMax(event.target.value); }} placeholder="50" className={`${fieldClass} mt-1 text-sm`} />
              </label>
              {isRange && <label className="text-xs text-dustyrose">Maximum
                <input required type="number" min="0" max="1000000" step="0.01" value={priceMax} onChange={(event) => setPriceMax(event.target.value)} placeholder="80" className={`${fieldClass} mt-1 text-sm`} />
              </label>}
            </div>
          </div>

          <label className="text-sm font-medium text-cream md:col-span-2">Description and terms
            <textarea required maxLength={2000} rows={4} value={rules} onChange={(event) => setRules(event.target.value)} placeholder="One character, waist-up. Simple background included; complex details may cost extra." className={`${fieldClass} mt-2 resize-y`} />
            <span className="mt-1 block text-right text-xs text-dustyrose">{rules.length}/2000</span>
          </label>

          <label className="text-sm font-medium text-cream md:col-span-2">Sample artwork <span className="font-normal text-dustyrose">(optional PNG)</span>
            <input key={sampleInputVersion} type="file" accept="image/png" onChange={(event) => setSampleFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-dashed border-gold/30 bg-maroon p-3 text-sm text-dustyrose file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-maroon" />
            {sampleFile && <span className="mt-2 block text-xs text-dustyrose">Selected: {sampleFile.name}</span>}
            {!sampleFile && sampleUrl && <img src={sampleUrl} alt="Current commission sample" className="mt-3 h-28 w-28 rounded-2xl border border-gold/20 object-cover" />}
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gold/15 bg-maroon/60 p-4 text-sm text-cream md:col-span-2">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="size-5 accent-[#D4A855]" />
            <span><strong>Accepting requests</strong><span className="mt-1 block text-xs text-dustyrose">Paused options remain in the admin and disappear from the public menu.</span></span>
          </label>

          {error && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-3 text-sm text-coral md:col-span-2">{error}</p>}
          {notice && <p role="status" className="rounded-xl border border-gold/25 bg-gold/10 p-3 text-sm text-gold md:col-span-2">{notice}</p>}
          <button type="submit" disabled={saving} className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-maroon transition hover:bg-cream disabled:cursor-wait disabled:opacity-60 md:col-span-2 md:justify-self-start">
            {saving ? "Saving..." : editing ? "Save changes" : "Add to commission menu"}
          </button>
        </form>
      </section>

      <section aria-labelledby="commission-list-heading">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-dustyrose">Manage pricing</p><h3 id="commission-list-heading" className="mt-2 font-display text-2xl text-cream">Your commission options</h3></div>
          <span className="text-sm text-dustyrose">{types.length} {types.length === 1 ? "option" : "options"}</span>
        </div>
        {loading ? <p className="py-8 text-sm text-dustyrose">Loading commission options...</p> : types.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold/25 p-8 text-center text-sm text-dustyrose">No commission options yet. Add your first one above.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {types.map((type) => (
              <article key={type.id} className="overflow-hidden rounded-2xl border border-gold/15 bg-surface/80 sm:flex">
                {type.sampleImageUrl && <img src={type.sampleImageUrl} alt={`${type.name} sample`} className="h-44 w-full bg-maroon object-contain sm:h-auto sm:w-36 sm:shrink-0" />}
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><h4 className="font-display text-xl text-cream">{type.name}</h4><p className="mt-1 font-semibold text-gold">{Number(type.priceMin) === Number(type.priceMax) ? formatPrice(type.priceMin) : `${formatPrice(type.priceMin)} – ${formatPrice(type.priceMax)}`}</p></div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${type.active ? "bg-emerald-400/10 text-emerald-200" : "bg-white/5 text-dustyrose"}`}>{type.active ? "Open" : "Paused"}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-dustyrose">{type.rules}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <button type="button" onClick={() => startEditing(type)} className="rounded-full border border-gold/30 px-4 py-2 text-xs font-semibold text-cream hover:border-gold">Edit</button>
                    <button type="button" onClick={() => void toggleActive(type)} className="rounded-full border border-gold/30 px-4 py-2 text-xs font-semibold text-cream hover:border-gold">{type.active ? "Pause requests" : "Reopen requests"}</button>
                    <button type="button" onClick={() => void handleDelete(type)} className="rounded-full px-3 py-2 text-xs text-coral hover:bg-coral/10">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
