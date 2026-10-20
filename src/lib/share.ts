// One URL per user. The link and the QR code both point here.
export function profileUrl(username: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/u/${username}`;
}
