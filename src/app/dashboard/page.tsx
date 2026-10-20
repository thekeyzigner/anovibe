import Link from "next/link";
import QRCode from "qrcode";
import { ChevronRight, ExternalLink, Palette, Share2 } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileUrl } from "@/lib/share";
import { ago } from "@/lib/ago";
import Avatar from "@/components/Avatar";
import ShareCard from "@/components/ShareCard";

export default async function DashboardHome() {
  const uid = (await auth())!.user.id;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: uid } });
  const [total, questions, replies, recent] = await Promise.all([
    prisma.message.count({ where: { recipientId: uid } }),
    prisma.message.count({ where: { recipientId: uid, category: "QUESTION" } }),
    prisma.message.count({ where: { recipientId: uid, reply: { not: null } } }),
    prisma.message.findMany({ where: { recipientId: uid }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const url = profileUrl(user.username);
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 320, color: { dark: "#0B1F3B", light: "#FFF9ED" } });
  const name = user.displayName || user.username;
  const actions = [
    { href: `/u/${user.username}`, label: "View your page", Icon: ExternalLink, ext: true },
    { href: "/dashboard/settings", label: "Customize your link and theme", Icon: Palette },
    { href: "#share", label: "Share your link", Icon: Share2 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Hey there, {name} 👋</h1>
          <p className="text-slate">Good to see you back. Here&apos;s what&apos;s new.</p>
        </div>

        <section className="rounded-bubble bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">Recent messages</h2>
            <Link href="/dashboard/inbox" className="text-sm font-semibold underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-slate">Nothing yet. Share your link to get your first message.</p>
          ) : (
            <ul className="divide-y divide-navy/10">
              {recent.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <Avatar id={m.id} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{m.body}</p>
                    <p className="text-xs text-slate">{ago(m.createdAt.toISOString())}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div id="share" className="scroll-mt-6">
          <ShareCard url={url} qr={qr} />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-bubble bg-white p-5">
          <div className="flex items-center gap-3">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <Avatar id={user.id} size={64} />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{name}</p>
              <p className="truncate text-sm text-slate">@{user.username}</p>
            </div>
            <Link href="/dashboard/settings" className="rounded-full border border-navy/15 px-3 py-1 text-sm font-semibold">Edit</Link>
          </div>
          {user.bio && <p className="mt-3 text-sm">{user.bio}</p>}
          <div className="mt-4 grid grid-cols-3 text-center">
            {[["Messages", total], ["Questions", questions], ["Replies", replies]].map(([l, n]) => (
              <div key={l}>
                <p className="text-2xl font-extrabold">{n}</p>
                <p className="text-xs text-slate">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-bubble bg-white p-2">
          <p className="px-3 pb-1 pt-3 font-bold">Quick actions</p>
          {actions.map(({ href, label, Icon, ext }) => (
            <Link key={label} href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-navy/5">
              <Icon size={18} />
              {label}
              <ChevronRight size={16} className="ml-auto text-slate" />
            </Link>
          ))}
        </div>

        <div className="rounded-bubble bg-lime p-5">
          <p className="font-hand text-3xl leading-tight">Real people. Real thoughts. That&apos;s Anovibe.</p>
        </div>
      </aside>
    </div>
  );
}
