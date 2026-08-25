import type { DrawingStatus } from "../types/Drawing";

export const statusLabels: Record<DrawingStatus, string> = {
  disponivel: "Disponível",
  pendente: "Pendente",
  reservado: "Reservado",
  vendido: "Vendido",
};