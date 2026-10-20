"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, Flag, Ban, Reply } from "lucide-react";
import { ago } from "@/lib/ago";

type M = { id: string; body: string; category: string; liked: boolean; reply: string | null; createdAt: string };
const icon = "rounded-full p-2 text-slate hover:bg-navy/5 hover:text-navy";

export default function MessageCard({ m }: { m: M }) {
  const router = useRouter();
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  async function call(method: string, body?: object) {
    await fetch(`/api/messages/${m.id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body && JSON.stringify(body),
    });
    router.refresh();
  }

  return (
    <article className="rounded-bubble bg-white p-4">
      <p className="text-xs font-semibold text-slate">
        {m.category.toLowerCase()} · {ago(m.createdAt)}
      </p>
      <p className="mt-1 text-lg">{m.body}</p>
      {m.reply && <p className="mt-3 rounded-xl bg-lime/40 p-3 font-medium">{m.reply}</p>}

      <div className="mt-2 flex">
        <button aria-label="Like" className={icon} onClick={() => call("PATCH", { liked: !m.liked })}>
          <Heart size={18} className={m.liked ? "fill-coral text-coral" : ""} />
        </button>
        {!m.reply && (
          <button aria-label="Reply" className={icon} onClick={() => setReplying(!replying)}>
            <Reply size={18} />
          </button>
        )}
        <button
          aria-label="Report"
          className={icon}
          onClick={() => {
            const reason = prompt("What's wrong with this message?");
            if (reason) call("POST", { action: "report", reason });
          }}
        >
          <Flag size={18} />
        </button>
        <button
          aria-label="Block sender"
          className={icon}
          onClick={() => confirm("Block this sender? Their messages will be removed.") && call("POST", { action: "block" })}
        >
          <Ban size={18} />
        </button>
        <button aria-label="Delete" className={`${icon} ml-auto`} onClick={() => call("DELETE")}>
          <Trash2 size={18} />
        </button>
      </div>

      {replying && (
        <div className="mt-2 space-y-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={500} rows={3} placeholder="Your reply shows on your public page" className="w-full rounded-xl border border-navy/15 p-3 outline-none focus:border-navy" />
          <button
            disabled={!text.trim()}
            onClick={() => call("PATCH", { reply: text })}
            className="rounded-full bg-lime px-5 py-2 text-sm font-bold text-navy disabled:opacity-50"
          >
            Send reply
          </button>
        </div>
      )}
    </article>
  );
}
