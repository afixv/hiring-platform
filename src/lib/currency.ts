/**
 * Format number to Indonesian Rupiah format
 * @example formatRupiah(7000000) => "7.000.000"
 */
export function formatRupiah(value: string | number): string {
  const numValue = typeof value === "string" ? value.replace(/\D/g, "") : String(value);
  if (!numValue) return "";
  return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Parse formatted rupiah to plain number
 * @example parseRupiah("7.000.000") => "7000000"
 */
export function parseRupiah(value: string): string {
  return value.replace(/\D/g, "");
}
