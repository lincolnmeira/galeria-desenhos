import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryPage } from "./pages/GalleryPage";
import { DrawingDetailPage } from "./pages/DrawingDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/drawings/:id" element={<DrawingDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;