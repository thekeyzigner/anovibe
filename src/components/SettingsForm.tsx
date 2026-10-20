"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/themes";

type U = { displayName: string; username: string; bio: string; theme: string };
const field = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-navy";

export default function SettingsForm({ user }: { user: U }) {
  const router = useRouter();
  const [u, setU] = useState(user);
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("");
    const r = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(u) });
    setMsg(r.ok ? "Saved." : (await r.json()).error);
    if (r.ok) router.refresh();
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">Display name</span>
        <input className={field} value={u.displayName} maxLength={40} onChange={(e) => setU({ ...u, displayName: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Username (changes your link)</span>
        <input className={field} value={u.username} onChange={(e) => setU({ ...u, username: e.target.value.toLowerCase() })} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Bio</span>
        <textarea className={field} rows={2} maxLength={160} value={u.bio} onChange={(e) => setU({ ...u, bio: e.target.value })} />
      </label>
      <div>
        <p className="mb-2 text-sm font-semibold">Profile theme</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(THEMES).map(([id, t]) => (
            <button
              key={id}
              onClick={() => setU({ ...u, theme: id })}
              aria-label={t.name}
              aria-pressed={u.theme === id}
              className={`h-16 w-16 rounded-2xl border-2 ${u.theme === id ? "border-navy" : "border-transparent"}`}
              style={{ background: t.bg }}
            >
              <span className="text-xs font-bold" style={{ color: t.fg }}>
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button onClick={save} className="rounded-full bg-lime px-6 py-2.5 font-bold text-navy hover:bg-lime-dark">
        Save changes
      </button>
      {msg && <p className="text-sm font-medium">{msg}</p>}
    </div>
  );
}
