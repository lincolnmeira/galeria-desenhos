import type { Drawing } from "../types/Drawing";

const API_URL = import.meta.env.VITE_API_URL;

export async function getDrawings(): Promise<Drawing[]> {
  const response = await fetch(`${API_URL}/drawings`);

  if (!response.ok) {
    throw new Error("Erro ao buscar desenhos");
  }

  return response.json();
}