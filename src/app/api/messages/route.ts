import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { senderHash } from "@/lib/sender";

const schema = z.object({
  username: z.string().toLowerCase(),
  body: z.string().trim().min(1).max(500),
  category: z.enum(["QUESTION", "COMPLIMENT", "OTHER"]),
});

// Public: anyone with the link or QR code can send.
export async function POST(req: NextRequest) {
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Write a message up to 500 characters." }, { status: 400 });

  const device = req.cookies.get("av_d")?.value ?? randomUUID();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "0";
  const hash = senderHash(ip, device);
  const done = (status = 201) => {
    const res = NextResponse.json({ ok: true }, { status });
    res.cookies.set("av_d", device, { httpOnly: true, sameSite: "lax", maxAge: 31536000, path: "/" });
    return res;
  };

  const user = await prisma.user.findUnique({ where: { username: p.data.username }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "This profile doesn't exist." }, { status: 404 });

  // Blocked senders see a normal success so they can't tell.
  if (await prisma.block.findUnique({ where: { userId_senderHash: { userId: user.id, senderHash: hash } } })) return done();

  const recent = await prisma.message.count({ where: { senderHash: hash, createdAt: { gte: new Date(Date.now() - 600000) } } });
  if (recent >= 5) return NextResponse.json({ error: "Slow down. Try again in a few minutes." }, { status: 429 });

  await prisma.message.create({
    data: { recipientId: user.id, body: p.data.body, category: p.data.category, senderHash: hash },
  });
  return done();
}
