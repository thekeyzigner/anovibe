export const CONTACT_EMAIL = "anovibe.support@gmail.com";
export const isAdminEmail = (e?: string | null) =>
  !!e && (process.env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map((s) => s.trim()).includes(e.toLowerCase());
