export type DrawingStatus = "disponivel" | "pendente" | "reservado" | "vendido";

export interface Drawing {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  status: DrawingStatus;
  createdAt: string;
}