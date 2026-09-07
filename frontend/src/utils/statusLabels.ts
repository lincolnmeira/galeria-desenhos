import type { DrawingStatus } from "../types/Drawing";

export const statusLabels: Record<DrawingStatus, string> = {
  disponivel: "Available",
  pendente: "Pending",
  reservado: "Reserved",
  vendido: "Sold",
};