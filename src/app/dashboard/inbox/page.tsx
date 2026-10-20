import Link from "next/link";
import type { MessageCategory } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MessageCard from "@/components/MessageCard";

const TABS = [
  ["", "All"],
  ["QUESTION", "Questions"],
  ["COMPLIMENT", "Compliments"],
  ["OTHER", "Others"],
] as const;

export default async function Inbox({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c = "" } = await searchParams;
  const uid = (await auth())!.user.id;
  const category = ["QUESTION", "COMPLIMENT", "OTHER"].includes(c) ? (c as MessageCategory) : undefined;
  const msgs = await prisma.message.findMany({
    where: { recipientId: uid, category },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  await prisma.message.updateMany({ where: { recipientId: uid, readAt: null }, data: { readAt: new Date() } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-extrabold">Inbox</h1>
      <div className="mb-5 flex gap-2">
        {TABS.map(([id, label]) => (
          <Link
            key={id}
            href={id ? `/dashboard/inbox?c=${id}` : "/dashboard/inbox"}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${c === id ? "bg-lime text-navy" : "bg-white text-slate"}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {msgs.length === 0 && <p className="text-slate">Nothing here yet. Share your link to get your first message.</p>}
        {msgs.map((m) => (
          <MessageCard key={m.id} m={{ ...m, createdAt: m.createdAt.toISOString() }} />
        ))}
      </div>
    </div>
  );
}
