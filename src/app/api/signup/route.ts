import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { USERNAME_RE } from "@/lib/username";

const schema = z.object({
  email: z.string().email(),
  username: z.string().toLowerCase().regex(USERNAME_RE),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success)
    return NextResponse.json({ error: "Use a valid email, an 8+ character password, and a 3-20 character username (letters, numbers, _)." }, { status: 400 });
  const email = p.data.email.toLowerCase();
  const taken = await prisma.user.findFirst({ where: { OR: [{ email }, { username: p.data.username }] } });
  if (taken)
    return NextResponse.json({ error: taken.email === email ? "That email already has an account." : "That username is taken." }, { status: 409 });
  await prisma.user.create({
    data: { email, username: p.data.username, passwordHash: await bcrypt.hash(p.data.password, 12) },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
