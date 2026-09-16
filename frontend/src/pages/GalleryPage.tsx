import { Link } from "react-router-dom";
import { Gallery } from "../components/Gallery";

export function GalleryPage() {
  return (
    <div>
      <header className="text-center py-12">
        <h1 className="font-display text-4xl text-gold">✦ Drawing Gallery</h1>
        <Link
          to="/commissions"
          className="inline-flex items-center gap-2 mt-5 bg-transparent border border-gold text-gold font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold hover:text-maroon active:scale-95 transition-all duration-200"
        >
          Request a commission
          <span aria-hidden="true">→</span>
        </Link>
      </header>
      <Gallery />
    </div>
  );
}