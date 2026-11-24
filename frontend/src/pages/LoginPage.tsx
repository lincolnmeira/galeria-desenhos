import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

const fieldClass = "w-full rounded-xl border border-gold/20 bg-maroon px-4 py-3 text-cream placeholder:text-dustyrose/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate("/admin", { replace: true }); }, [isAuthenticated, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(null); setLoading(true);
    try {
      const result = await loginRequest({ email, password });
      login(result.token); navigate("/admin", { replace: true });
    } catch {
      setError("We couldn’t sign you in with those details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,168,85,0.12),transparent_45%)]" />
    <div className="relative w-full max-w-md">
      <Link to="/" className="mx-auto mb-7 flex w-fit items-center gap-3 text-cream transition hover:text-gold"><span className="flex size-11 items-center justify-center rounded-full border border-gold/30 bg-surface font-display text-xl text-gold">✦</span><span className="font-display text-xl">Artist’s Gallery</span></Link>
      <section className="rounded-[2rem] border border-gold/15 bg-surface/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur sm:p-9">
        <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-dustyrose">Private workspace</p>
        <h1 className="mt-3 text-center font-display text-3xl text-cream">Welcome back</h1>
        <p className="mt-3 text-center text-sm leading-6 text-dustyrose">Sign in to manage your gallery, commission menu and client requests.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-cream">Email address<input required autoComplete="username" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${fieldClass} mt-2`} placeholder="you@example.com" /></label>
          <label className="block text-sm font-medium text-cream">Password<input required autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={`${fieldClass} mt-2`} placeholder="Your password" /></label>
          {error && <p role="alert" className="rounded-xl border border-coral/25 bg-coral/10 p-3 text-sm text-coral">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-gold px-5 py-3.5 text-sm font-bold text-maroon transition hover:bg-cream disabled:cursor-wait disabled:opacity-50">{loading ? "Signing in..." : "Open studio dashboard"}</button>
        </form>
      </section>
      <Link to="/" className="mt-6 block text-center text-sm text-dustyrose transition hover:text-gold">← Return to the public gallery</Link>
    </div>
  </main>;
}
