import { Link, NavLink } from "react-router-dom";
import { discordProfileUrl } from "../utils/discord";

export function PublicHeader() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm transition-colors ${isActive ? "bg-gold/10 text-gold" : "text-dustyrose hover:text-cream"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-gold/10 bg-maroon/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Artist portfolio home">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-surface font-display text-lg text-gold">✦</span>
          <span className="hidden truncate font-display text-lg text-cream sm:inline sm:text-xl">Artist’s Gallery</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Portfolio</NavLink>
          <NavLink to="/commissions" className={({ isActive }) => `${linkClass({ isActive })} !px-3 sm:!px-4`}>Pricing</NavLink>
          <a href={discordProfileUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex min-h-10 items-center gap-1 rounded-full bg-[#5865F2] px-3 text-xs font-bold text-white transition hover:bg-[#7289da] sm:px-4 sm:text-sm">Contact <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
