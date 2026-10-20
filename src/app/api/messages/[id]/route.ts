import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

async function load(ctx: Ctx) {
  const { id } = await ctx.params;
  const uid = (await auth())?.user?.id;
  const m = uid ? await prisma.message.findFirst({ where: { id, recipientId: uid } }) : null;
  return { uid, m };
}
const no = () => NextResponse.json({ error: "Not found." }, { status: 404 });
const ok = () => NextResponse.json({ ok: true });

export async function PATCH(req: Request, ctx: Ctx) {
  const { m } = await load(ctx);
  if (!m) return no();
  const d = z
    .object({ liked: z.boolean().optional(), reply: z.string().trim().min(1).max(500).optional() })
    .safeParse(await req.json().catch(() => null));
  if (!d.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  await prisma.message.update({
    where: { id: m.id },
    data: {
      ...(d.data.liked !== undefined && { liked: d.data.liked }),
      ...(d.data.reply && { reply: d.data.reply, repliedAt: new Date() }),
    },
  });
  return ok();
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { m } = await load(ctx);
  if (!m) return no();
  await prisma.message.delete({ where: { id: m.id } });
  return ok();
}

// action: "report" | "block"
export async function POST(req: Request, ctx: Ctx) {
  const { uid, m } = await load(ctx);
  if (!m || !uid) return no();
  const d = z
    .object({ action: z.enum(["report", "block"]), reason: z.string().trim().max(300).optional() })
    .safeParse(await req.json().catch(() => null));
  if (!d.success) return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  if (d.data.action === "block") {
    await prisma.block.upsert({
      where: { userId_senderHash: { userId: uid, senderHash: m.senderHash } },
      create: { userId: uid, senderHash: m.senderHash },
      update: {},
    });
    await prisma.message.deleteMany({ where: { recipientId: uid, senderHash: m.senderHash } });
  } else {
    await prisma.report.upsert({
      where: { messageId_reporterId: { messageId: m.id, reporterId: uid } },
      create: { messageId: m.id, reporterId: uid, reason: d.data.reason || "Abusive message" },
      update: {},
    });
  }
  return ok();
}
