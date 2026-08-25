import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryPage } from "./pages/GalleryPage";
import { DrawingDetailPage } from "./pages/DrawingDetailPage";
import {PurchasePage} from "./pages/PurchasePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/drawings/:id" element={<DrawingDetailPage />} />
        <Route path="/drawings/:id/purchase" element={<PurchasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;