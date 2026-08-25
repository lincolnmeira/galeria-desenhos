import type { Drawing } from "../types/Drawing";

const API_URL = import.meta.env.VITE_API_URL;

export async function getDrawings(): Promise<Drawing[]> {
  const response = await fetch(`${API_URL}/drawings`);

  if (!response.ok) {
    throw new Error("Erro ao buscar desenhos");
  }

  return response.json();
}

export async function getDrawingById(id: string): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar desenho");
  }

  return response.json();
}

export async function requestPurchase(id: string): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings/${id}/request-purchase`, {
    method: "POST",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Erro ao solicitar compra");
  }

  return response.json();
}