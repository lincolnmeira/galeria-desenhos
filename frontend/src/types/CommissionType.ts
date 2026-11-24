export interface CommissionType {
  id: string;
  name: string;
  priceMin: string;
  priceMax: string;
  rules: string;
  sampleImageUrl?: string | null;
  active: boolean;
}
