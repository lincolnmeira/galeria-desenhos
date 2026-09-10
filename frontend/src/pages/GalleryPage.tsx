import { Link } from "react-router-dom";
import { Gallery } from "../components/Gallery";

export function GalleryPage() {
  return (
    <div>
      <header className="text-center py-12">
        <h1 className="font-display text-4xl text-gold">✦ Drawing Gallery</h1>
        <Link
          to="/commissions"
          className="inline-block mt-3 text-sm text-dustyrose hover:text-gold transition-colors"
        >
          Request a commission →
        </Link>
      </header>
      <Gallery />
    </div>
  );
}