import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryPage } from "./pages/GalleryPage";
import { DrawingDetailPage } from "./pages/DrawingDetailPage";
import {PurchasePage} from "./pages/PurchasePage";
import { CommissionsPage } from "./pages/CommissionsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/drawings/:id" element={<DrawingDetailPage />} />
        <Route path="/drawings/:id/purchase" element={<PurchasePage />} />
        <Route path="/commissions" element={<CommissionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;