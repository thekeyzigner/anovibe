"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const field = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-navy";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    if (signup) {
      const r = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username: String(f.get("username")) }),
      });
      if (!r.ok) {
        setErr((await r.json()).error);
        return setBusy(false);
      }
    }
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setErr("Wrong email or password.");
      return setBusy(false);
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <Link href="/" className="mb-8 text-xl font-extrabold">
        Anovibe
      </Link>
      <h1 className="text-3xl font-extrabold">{signup ? "Create your account" : "Welcome back"}</h1>
      <p className="mb-6 mt-1 text-slate">{signup ? "It only takes a few seconds." : "Log in to your inbox."}</p>

      <button
        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
        className="rounded-xl border border-navy/15 bg-white px-4 py-3 font-semibold hover:border-navy"
      >
        Continue with Google
      </button>
      <p className="my-4 text-center text-sm text-slate">or</p>

      <form onSubmit={submit} className="space-y-3">
        {signup && <input name="username" placeholder="username" required className={field} />}
        <input name="email" type="email" placeholder="Email" required className={field} />
        <input name="password" type="password" placeholder="Password (8+ characters)" required minLength={8} className={field} />
        {err && <p className="text-sm font-medium text-coral">{err}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-lime px-4 py-3 font-bold text-navy hover:bg-lime-dark disabled:opacity-60">
          {signup ? "Create account" : "Log in"}
        </button>
      </form>

      {signup && (
        <p className="mt-4 text-xs text-slate">
          By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      )}
      <p className="mt-6 text-sm text-slate">
        {signup ? "Already have an account? " : "New here? "}
        <Link href={signup ? "/login" : "/signup"} className="font-semibold text-navy underline">
          {signup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </main>
  );
}
