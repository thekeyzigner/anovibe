import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReportStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/site";
import { ago } from "@/lib/ago";
import { removeReported, setReportStatus } from "./actions";

const TABS = [["OPEN", "Open"], ["REVIEWED", "Reviewed"], ["DISMISSED", "Dismissed"]] as const;
const btn = "rounded-full border border-navy/15 px-4 py-1.5 text-sm font-semibold hover:border-navy";

export default async function Admin({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  if (!isAdminEmail((await auth())?.user?.email)) notFound();
  const { s = "OPEN" } = await searchParams;
  const status = (TABS.some(([id]) => id === s) ? s : "OPEN") as ReportStatus;
  const reports = await prisma.report.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { message: { select: { body: true, category: true, recipient: { select: { username: true } } } } },
  });

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Reports</h1>
        <Link href="/dashboard" className="text-sm font-semibold underline">Back to dashboard</Link>
      </div>
      <div className="mb-5 flex gap-2">
        {TABS.map(([id, label]) => (
          <Link key={id} href={`/admin?s=${id}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${status === id ? "bg-lime" : "bg-white text-slate"}`}>
            {label}
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {reports.length === 0 && <p className="text-slate">No {status.toLowerCase()} reports.</p>}
        {reports.map((r) => (
          <article key={r.id} className="rounded-bubble bg-white p-4">
            <p className="text-xs font-semibold text-slate">
              to @{r.message.recipient.username} · {r.message.category.toLowerCase()} · reported {ago(r.createdAt.toISOString())}
            </p>
            <p className="mt-1 text-lg">{r.message.body}</p>
            <p className="mt-2 rounded-xl bg-coral/10 p-3 text-sm">Reason: {r.reason}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={setReportStatus.bind(null, r.id, "REVIEWED")}><button className={btn}>Mark reviewed</button></form>
              <form action={setReportStatus.bind(null, r.id, "DISMISSED")}><button className={btn}>Dismiss</button></form>
              <form action={removeReported.bind(null, r.id)}><button className={`${btn} text-coral`}>Delete message</button></form>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
