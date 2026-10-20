import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { themeOf } from "@/lib/themes";
import SendForm from "@/components/SendForm";

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
  if (!user) notFound();
  const t = themeOf(user.theme);
  const replies = await prisma.message.findMany({
    where: { recipientId: user.id, reply: { not: null } },
    orderBy: { repliedAt: "desc" },
    take: 20,
    select: { id: true, body: true, reply: true },
  });

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: t.bg, color: t.fg }}>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.image && <img src={user.image} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />}
          <h1 className="text-2xl font-extrabold">{user.displayName || `@${user.username}`}</h1>
          <p className="text-sm opacity-70">@{user.username}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}
        </div>

        <SendForm username={user.username} accent={t.accent} on={t.on} />

        {replies.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="font-bold">Replies</h2>
            {replies.map((r) => (
              <div key={r.id} className="rounded-bubble border border-current/20 p-4">
                <p className="opacity-70">{r.body}</p>
                <p className="mt-2 font-semibold">{r.reply}</p>
              </div>
            ))}
          </section>
        )}

        <p className="mt-12 text-center text-sm opacity-70">
          <Link href="/signup" className="underline">
            Get your own Anovibe link
          </Link>
        </p>
      </div>
    </main>
  );
}
