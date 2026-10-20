import Link from "next/link";
import { EyeOff, ShieldCheck, Send, User, Home as HomeIcon, Inbox, Heart } from "lucide-react";

const MSGS = [
  { t: "You're doing better than you think. Keep going. 💚", ago: "2m ago", c: "#C6FF3B" },
  { t: "What's your biggest dream rn?", ago: "5m ago", c: "#8B7CF6" },
  { t: "Lowkey your music taste is fire 🔥", ago: "12m ago", c: "#FF6B4A" },
  { t: "Do you ever get tired? lol", ago: "18m ago", c: "#A78BFA" },
];

const FEATURES = [
  { Icon: EyeOff, title: "100% anonymous", text: "No names. No tracking. Senders never sign in and we never store their IP." },
  { Icon: ShieldCheck, title: "Safe and respectful", text: "Report, block or delete any message. Blocked senders can't reach you again." },
  { Icon: Send, title: "Share freely", text: "Post your link anywhere, or print your QR code. Friends send messages, questions and compliments." },
];

const STEPS = [
  ["Create your profile", "Pick a username, add a bio and choose a theme."],
  ["Share your link or QR code", "Both open the same page where anyone can message you."],
  ["Read what people send", "Filter by questions, compliments and others."],
  ["Reply, like or delete", "Replies show on your public page. Report or block anything rude."],
];

function Avatar({ c, size = 40 }: { c: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full" style={{ background: c, width: size, height: size }}>
      <User size={size * 0.5} className="text-navy" />
    </span>
  );
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className={`text-xl font-extrabold tracking-tight ${dark ? "text-navy" : "text-cream"}`}>
      <span className="mr-0.5 inline-grid h-7 w-7 place-items-center rounded-lg bg-lime align-middle text-navy">A</span>
      novibe
    </span>
  );
}

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-28 text-cream">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <a href="#features" className="hidden px-3 py-2 hover:text-lime sm:block">Features</a>
            <a href="#how" className="hidden px-3 py-2 hover:text-lime sm:block">How it works</a>
            <Link href="/faq" className="hidden px-3 py-2 hover:text-lime sm:block">FAQ</Link>
            <Link href="/login" className="px-3 py-2 hover:text-lime">Log in</Link>
            <Link href="/signup" className="rounded-full bg-lime px-5 py-2 text-navy hover:bg-lime-dark">Get started</Link>
          </nav>
        </header>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-12 md:grid-cols-2 md:pt-20">
          <div>
            <p className="font-hand text-3xl text-lime">Say it. Anonymously.</p>
            <h1 className="mt-3 text-6xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              Real thoughts.
              <br />
              <span className="text-lime">No names.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/80">
              Anovibe is a safe space to share your thoughts, ask questions and send messages anonymously. No judgment. No pressure.
            </p>
            <Link href="/signup" className="mt-8 inline-block rounded-full bg-lime px-8 py-4 font-bold text-navy hover:bg-lime-dark">
              Create your profile
            </Link>
            <p className="mt-3 text-sm text-cream/60">It only takes a minute.</p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="-rotate-6 space-y-3 rounded-[2rem] bg-cream/10 p-4 backdrop-blur">
              {MSGS.slice(0, 3).map((m) => (
                <div key={m.t} className="flex items-center gap-3 rounded-bubble bg-cream p-4 text-navy shadow-lg">
                  <Avatar c={m.c} />
                  <div>
                    <p className="font-medium leading-snug">{m.t}</p>
                    <p className="mt-1 text-xs text-slate">{m.ago}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="absolute -bottom-10 right-0 rotate-[-8deg] font-hand text-3xl leading-none text-lime">
              Good
              <br />
              vibes only
            </p>
          </div>
        </div>

        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full" aria-hidden>
          <path d="M0 40 C 240 90 480 0 720 30 S 1200 80 1440 20 V80 H0Z" fill="#C6FF3B" />
        </svg>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-4 px-6 py-24">
        <h2 className="max-w-lg text-4xl font-extrabold tracking-tight">Honest messages, without the awkward part.</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-lime">
                <Icon size={22} className="text-navy" />
              </span>
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-slate">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works + phone */}
      <section id="how" className="scroll-mt-4 bg-white py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight">From sign-up to first message in minutes.</h2>
            <ol className="mt-10 space-y-6">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy font-bold text-lime">{i + 1}</span>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-slate">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mx-auto w-64 rotate-3 rounded-[2.5rem] bg-navy p-3 shadow-2xl" aria-label="Anovibe inbox preview" role="img">
            <div className="rounded-[2rem] bg-cream p-4">
              <p className="text-xs font-bold">Inbox</p>
              <div className="mt-3 flex gap-2 text-[11px] font-semibold">
                <span className="rounded-full bg-lime px-3 py-1">Messages</span>
                <span className="rounded-full bg-navy/5 px-3 py-1 text-slate">Questions</span>
              </div>
              <ul className="mt-3 space-y-3">
                {MSGS.map((m) => (
                  <li key={m.t} className="flex items-center gap-2 border-b border-navy/10 pb-3 text-[11px] leading-tight">
                    <Avatar c={m.c} size={28} />
                    <span className="font-medium">{m.t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-around text-slate">
                <HomeIcon size={18} />
                <Inbox size={18} className="text-navy" />
                <Heart size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-lime px-6 py-20 text-center text-navy">
        <p className="font-hand text-5xl leading-none">Different people. Same vibes.</p>
        <Link href="/signup" className="mt-8 inline-block rounded-full bg-navy px-8 py-4 font-bold text-cream hover:bg-navy-soft">
          Create your profile
        </Link>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 bg-navy px-6 py-8 text-sm text-cream/70">
        <Logo />
        <p className="font-hand text-2xl text-lime">Say it. Anonymously.</p>
        <div className="flex gap-5">
          <Link href="/faq" className="hover:text-lime">FAQ</Link>
          <Link href="/terms" className="hover:text-lime">Terms</Link>
          <Link href="/privacy" className="hover:text-lime">Privacy</Link>
          <Link href="/login" className="hover:text-lime">Log in</Link>
          <Link href="/signup" className="hover:text-lime">Sign up</Link>
        </div>
      </footer>
    </main>
  );
}
