import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { USERNAME_RE } from "@/lib/username";
import { THEMES } from "@/lib/themes";

const schema = z.object({
  displayName: z.string().trim().max(40),
  bio: z.string().trim().max(160),
  username: z.string().toLowerCase().regex(USERNAME_RE),
  theme: z.string().refine((t) => t in THEMES),
});

export async function PATCH(req: Request) {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Log in first." }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Check your username (3-20 letters, numbers, _) and bio length." }, { status: 400 });
  try {
    await prisma.user.update({ where: { id: s.user.id }, data: p.data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "That username is taken." }, { status: 409 });
  }
}
