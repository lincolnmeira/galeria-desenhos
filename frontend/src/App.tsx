import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GalleryPage } from "./pages/GalleryPage";
import { DrawingDetailPage } from "./pages/DrawingDetailPage";
import { PurchasePage } from "./pages/PurchasePage";
import { CommissionsPage } from "./pages/CommissionsPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/drawings/:id" element={<DrawingDetailPage />} />
          <Route path="/drawings/:id/purchase" element={<PurchasePage />} />
          <Route path="/commissions" element={<CommissionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;