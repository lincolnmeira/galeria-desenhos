import { useEffect, useState } from "react";
import { getCommissionOrdersAdmin, updateCommissionOrder, deleteCommissionOrder } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const statusOptions = ["na_fila", "em_progresso", "concluido"];
const statusLabels: Record<string, string> = { na_fila: "In queue", em_progresso: "In progress", concluido: "Done" };

interface Order {
  id: string;
  buyerName: string;
  buyerContact: string;
  priority: number;
  status: string;
  commissionType: { name: string };
}

export function CommissionOrdersAdminList() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getCommissionOrdersAdmin(token).then(setOrders).finally(() => setLoading(false));
  }, [token]);

  async function handleChange(id: string, field: string, value: string | number) {
    if (!token) return;
    const updated = await updateCommissionOrder(token, id, { [field]: value });
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("Delete this order?")) return;
    await deleteCommissionOrder(token, id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <table className="w-full border-collapse mt-10">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">#</th><th className="py-2">Buyer</th><th className="py-2">Type</th>
          <th className="py-2">Status</th><th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="py-2">
              <input type="number" value={order.priority} className="w-14 border rounded p-1"
                onChange={(e) => handleChange(order.id, "priority", Number(e.target.value))} />
            </td>
            <td className="py-2">{order.buyerName}<br /><span className="text-xs text-gray-500">{order.buyerContact}</span></td>
            <td className="py-2">{order.commissionType.name}</td>
            <td className="py-2">
              <select value={order.status} className="border rounded p-1"
                onChange={(e) => handleChange(order.id, "status", e.target.value)}>
                {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </td>
            <td className="py-2">
              <button onClick={() => handleDelete(order.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}