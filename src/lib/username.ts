import { prisma } from "./prisma";
export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
export async function uniqueUsername(seed: string) {
  const base = seed.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16).padEnd(3, "x");
  let name = base;
  while (await prisma.user.findUnique({ where: { username: name } })) name = base + Math.floor(Math.random() * 9999);
  return name;
}
