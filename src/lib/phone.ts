export function uaPhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("380")) digits = digits.slice(3);
  else if (digits.startsWith("80")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 9);
}

export function formatUaPhone(raw: string): string {
  const d = uaPhoneDigits(raw);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}

export function normalizeUaPhone(raw: string): string | null {
  const digits = uaPhoneDigits(raw);
  if (digits.length !== 9) return null;
  return `+380${digits}`;
}
