import { useAuth } from "../context/AuthContext";

export function AdminPage() {
  const { logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:underline">
          Sign out
        </button>
      </div>
      <p className="text-gray-600">Welcome! This is where drawing and commission management will live.</p>
    </div>
  );
}