import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/site";
import SidebarNav from "@/components/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const s = await auth();
  const uid = s?.user?.id;
  if (!uid) redirect("/login");
  const [user, unread] = await Promise.all([
    prisma.user.findUnique({ where: { id: uid }, select: { username: true } }),
    prisma.message.count({ where: { recipientId: uid, readAt: null } }),
  ]);
  if (!user) redirect("/login");
  const nav = { unread, username: user.username, isAdmin: isAdminEmail(s?.user?.email) };

  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-navy p-5 text-cream md:flex">
        <Link href="/dashboard" className="mb-8 text-xl font-extrabold">
          <span className="mr-0.5 inline-grid h-7 w-7 place-items-center rounded-lg bg-lime align-middle text-navy">A</span>novibe
        </Link>
        <SidebarNav {...nav} />
        <div className="mt-auto">
          <p className="-rotate-3 font-hand text-3xl leading-none text-lime">Keep it real</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="mt-4 text-sm text-cream/60 hover:text-cream">Log out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 pb-28 pt-8 md:px-10 md:pb-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-10 flex bg-navy md:hidden">
        <SidebarNav {...nav} bottom />
      </div>
    </div>
  );
}
