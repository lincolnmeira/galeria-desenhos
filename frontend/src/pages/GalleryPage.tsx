import { Link } from "react-router-dom";
import { Gallery } from "../components/Gallery";
import { PublicHeader } from "../components/PublicHeader";

export function GalleryPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,168,85,0.09),transparent_42%)]">
      <PublicHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-9 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-dustyrose">Digital art · Original characters · Anime inspired</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl leading-[1.08] text-cream sm:text-7xl">A little world, <span className="text-gold">drawn by hand.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-dustyrose sm:text-base">Browse one-of-a-kind pieces or bring your own character to life with a custom illustration.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#gallery" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-maroon transition hover:bg-cream">Explore the gallery <span aria-hidden="true">↓</span></a>
            <Link to="/commissions" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/35 px-6 py-3 text-sm font-semibold text-cream transition hover:border-gold hover:bg-gold/10">Commission a piece <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
        <section id="gallery" className="scroll-mt-20 border-t border-gold/10 bg-maroon/40 py-8 sm:py-12">
          <div className="mx-auto mb-2 max-w-7xl px-5 sm:px-8"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-dustyrose">The collection</p><h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">Available artwork <span className="text-gold">✦</span></h2></div><Link to="/commissions" className="hidden text-sm font-semibold text-gold hover:text-cream sm:inline-flex">Looking for something custom? →</Link></div></div>
          <Gallery />
        </section>
      </main>
      <footer className="border-t border-gold/10 px-5 py-6 text-center text-xs text-dustyrose">Illustrated with care <span className="text-gold">✦</span></footer>
    </div>
  );
}
