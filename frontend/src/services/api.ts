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

import type { CommissionType } from "../types/CommissionType";

export async function getCommissionTypes(): Promise<CommissionType[]> {
  const response = await fetch(`${API_URL}/commission-types`);

  if (!response.ok) {
    throw new Error("Erro ao buscar tipos de encomenda");
  }

  return response.json();
}

interface CreateCommissionOrderInput {
  commissionTypeId: string;
  buyerName: string;
  buyerContact: string;
}

interface CommissionOrderResult {
  id: string;
  priority: number;
}

export async function createCommissionOrder(
  input: CreateCommissionOrderInput
): Promise<CommissionOrderResult> {
  const response = await fetch(`${API_URL}/commission-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Erro ao solicitar encomenda");
  }

  return response.json();
}