import Link from "next/link";

export default function LegalShell({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="bg-navy">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5 text-cream">
          <Link href="/" className="text-xl font-extrabold">
            <span className="mr-0.5 inline-grid h-7 w-7 place-items-center rounded-lg bg-lime align-middle text-navy">A</span>novibe
          </Link>
          <Link href="/signup" className="rounded-full bg-lime px-5 py-2 text-sm font-semibold text-navy">Get started</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        {updated && <p className="mt-2 text-sm text-slate">Last updated {updated}</p>}
        <div className="mt-8 space-y-4 leading-relaxed [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">{children}</div>
      </main>
      <footer className="flex justify-center gap-6 border-t border-navy/10 px-6 py-8 text-sm text-slate">
        <Link href="/faq">FAQ</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </footer>
    </div>
  );
}
