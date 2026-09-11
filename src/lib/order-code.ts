/** Memorable order code: WS-7K4M-92QX */
export function generateOrderCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const chunk = (n: number) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return s;
  };
  return `WS-${chunk(4)}-${chunk(4)}`;
}
