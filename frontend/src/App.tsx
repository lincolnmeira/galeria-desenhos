import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
          <Route path="*" element={<main className="flex min-h-screen flex-col items-center justify-center px-5 text-center"><span className="text-4xl text-gold">✦</span><h1 className="mt-4 font-display text-3xl text-cream">This page wandered off</h1><p className="mt-3 text-sm text-dustyrose">The page you’re looking for doesn’t exist.</p><Link to="/" className="mt-6 rounded-full border border-gold/30 px-5 py-2.5 text-sm text-gold hover:bg-gold hover:text-maroon">Back to the gallery</Link></main>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
