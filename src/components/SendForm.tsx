"use client";
import { useState } from "react";

const CATS = [
  ["QUESTION", "Question"],
  ["COMPLIMENT", "Compliment"],
  ["OTHER", "Other"],
] as const;

export default function SendForm({ username, accent, on }: { username: string; accent: string; on: string }) {
  const [cat, setCat] = useState<string>("OTHER");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [err, setErr] = useState("");

  async function send() {
    setErr("");
    setState("busy");
    const r = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, body, category: cat }),
    });
    if (r.ok) {
      setBody("");
      return setState("sent");
    }
    setErr((await r.json()).error);
    setState("idle");
  }

  if (state === "sent")
    return (
      <div className="rounded-bubble border border-current/20 p-6 text-center">
        <p className="text-xl font-bold">Sent. Nobody will know it was you.</p>
        <button onClick={() => setState("idle")} className="mt-4 underline">
          Send another
        </button>
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {CATS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setCat(id)}
            className="rounded-full border px-4 py-1.5 text-sm font-semibold"
            style={cat === id ? { background: accent, color: on, borderColor: accent } : { borderColor: "currentColor", opacity: 0.7 }}
          >
            {label}
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={500}
        rows={5}
        placeholder="Write something anonymously..."
        className="w-full rounded-bubble bg-white/95 p-4 text-navy outline-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-70">{body.length}/500</span>
        <button
          onClick={send}
          disabled={!body.trim() || state === "busy"}
          className="rounded-full px-6 py-2.5 font-bold disabled:opacity-50"
          style={{ background: accent, color: on }}
        >
          Send
        </button>
      </div>
      {err && <p className="text-sm font-medium">{err}</p>}
    </div>
  );
}
