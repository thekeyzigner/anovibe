export const CONTACT_EMAIL = "hello@anovibe.example"; // TODO: replace with your real address
export const isAdminEmail = (e?: string | null) =>
  !!e && (process.env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map((s) => s.trim()).includes(e.toLowerCase());
