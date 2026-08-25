import { Link } from "react-router-dom";
import { Gallery } from "../components/Gallery";

export function GalleryPage() {
  return (
    <div>
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold">Galeria de Desenhos</h1>
        <Link to="/commissions" className="text-sm text-gray-500 hover:underline">
          Fazer uma encomenda →
        </Link>
      </header>
      <Gallery />
    </div>
  );
}