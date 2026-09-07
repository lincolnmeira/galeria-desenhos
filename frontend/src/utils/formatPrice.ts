export function formatPrice(price: string | number): string {
  return Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}