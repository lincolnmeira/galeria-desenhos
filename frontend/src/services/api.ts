import type { Drawing } from "../types/Drawing";

const API_URL = import.meta.env.VITE_API_URL;

export async function getDrawings(): Promise<Drawing[]> {
  const response = await fetch(`${API_URL}/drawings`);

  if (!response.ok) {
    throw new Error("Unable to load artwork");
  }

  return response.json();
}

export async function getDrawingById(id: string): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings/${id}`);

  if (!response.ok) {
    throw new Error("Unable to load this artwork");
  }

  return response.json();
}

export async function requestPurchase(id: string): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings/${id}/request-purchase`, {
    method: "POST",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to reserve this artwork");
  }

  return response.json();
}

import type { CommissionType } from "../types/CommissionType";

export async function getCommissionTypes(): Promise<CommissionType[]> {
  const response = await fetch(`${API_URL}/commission-types`);

  if (!response.ok) {
    throw new Error("Unable to load commission options");
  }

  return response.json();
}

export async function getCommissionTypesAdmin(token: string): Promise<CommissionType[]> {
  const response = await fetch(`${API_URL}/commission-types/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to load commission types");
  return response.json();
}

interface CommissionTypeInput {
  name: string;
  priceMin: string;
  priceMax: string;
  rules: string;
  sampleImageUrl?: string | null;
  active?: boolean;
}

export async function createCommissionType(token: string, input: CommissionTypeInput): Promise<CommissionType> {
  const response = await fetch(`${API_URL}/commission-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to create commission type");
  }
  return response.json();
}

export async function updateCommissionType(token: string, id: string, input: CommissionTypeInput): Promise<CommissionType> {
  const response = await fetch(`${API_URL}/commission-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to update commission type");
  }
  return response.json();
}

export async function deleteCommissionType(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/commission-types/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to delete commission type");
  }
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
    throw new Error(data?.error ?? "Unable to submit commission request");
  }

  return response.json();
}

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to sign in");
  }

  return response.json();
}

interface CreateDrawingInput {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

export async function createDrawing(token: string, input: CreateDrawingInput): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Unable to create artwork");
  return response.json();
}

export async function updateDrawing(token: string, id: string, input: CreateDrawingInput): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to update drawing");
  }
  return response.json();
}

export async function updateDrawingStatus(token: string, id: string, status: string): Promise<Drawing> {
  const response = await fetch(`${API_URL}/drawings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Unable to update availability");
  return response.json();
}

export async function deleteDrawing(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/drawings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to delete artwork");
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Unable to upload image");
  const data = await response.json();
  return data.imageUrl;
}
export async function getCommissionOrdersAdmin(token: string) {
  const response = await fetch(`${API_URL}/commission-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to load the request queue");
  return response.json();
}

export async function updateCommissionOrder(token: string, id: string, data: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/commission-orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Unable to update this request");
  return response.json();
}

export async function deleteCommissionOrder(token: string, id: string) {
  const response = await fetch(`${API_URL}/commission-orders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to delete this request");
}
