import { Gallery } from "../components/Gallery";

export function GalleryPage() {
  return (
    <div>
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold">Galeria de Desenhos</h1>
      </header>
      <Gallery />
    </div>
  );
}