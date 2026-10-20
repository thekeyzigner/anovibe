"use client";
import { useState } from "react";

export default function ShareCard({ url, qr }: { url: string; qr: string }) {
  const [copied, setCopied] = useState(false);
  const btn = "rounded-full px-5 py-2 text-sm font-bold";
  return (
    <div className="rounded-bubble bg-navy p-6 text-cream">
      <p className="font-hand text-2xl text-lime">Your link</p>
      <p className="mt-1 break-all text-lg font-bold">{url}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className={`${btn} bg-lime text-navy`}
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button className={`${btn} border border-cream/40`} onClick={() => navigator.share({ url, title: "Send me an anonymous message" })}>
            Share
          </button>
        )}
        <a className={`${btn} border border-cream/40`} href={qr} download="anovibe-qr.png">
          Download QR
        </a>
        <a className={`${btn} border border-cream/40`} href={url} target="_blank" rel="noopener noreferrer">
          View my page
        </a>
      </div>
      <div className="mt-5 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="QR code for your link" className="h-32 w-32 rounded-xl" />
        <p className="max-w-[16rem] text-sm text-cream/70">Scanning the QR code opens the same page as your link, so anyone can message you either way.</p>
      </div>
    </div>
  );
}
