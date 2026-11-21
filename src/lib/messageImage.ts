import { themeOf } from "./themes";

// Gradient stops for the story-sized image, matching the profile themes.
const STOPS: Record<string, [string, string]> = {
  lime: ["#0B1F3B", "#0B1F3B"],
  cream: ["#FFF9ED", "#FFF9ED"],
  sunset: ["#FF6B4A", "#0B1F3B"],
  ocean: ["#1E5AA8", "#0B1F3B"],
  forest: ["#1F5A3A", "#0B1F3B"],
};

const W = 1080;
const H = 1920;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      // Break words that are wider than the card.
      let w = word;
      while (ctx.measureText(w).width > maxWidth) {
        let i = w.length - 1;
        while (i > 1 && ctx.measureText(w.slice(0, i)).width > maxWidth) i--;
        if (line) { lines.push(line); line = ""; }
        lines.push(w.slice(0, i));
        w = w.slice(i);
      }
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width <= maxWidth) line = test;
      else { lines.push(line); line = w; }
    }
    lines.push(line);
  }
  return lines;
}

export async function renderMessageImage(opts: { body: string; category: string; username: string; theme: string; link: string }): Promise<Blob> {
  try { await document.fonts.ready; } catch {}
  const t = themeOf(opts.theme);
  const [c1, c2] = STOPS[opts.theme] ?? STOPS.lime;
  const family = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, c1);
  bg.addColorStop(1, c2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Brand
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.fg;
  ctx.font = `800 56px ${family}`;
  ctx.textAlign = "center";
  ctx.fillText("Anovibe", W / 2, 190);

  // Message card
  const cardW = 880;
  const pad = 64;
  const headerH = 120;
  const fontSize = opts.body.length > 220 ? 44 : opts.body.length > 90 ? 54 : 66;
  const lineH = Math.round(fontSize * 1.32);
  ctx.font = `700 ${fontSize}px ${family}`;
  const lines = wrap(ctx, opts.body.slice(0, 500), cardW - pad * 2);
  const bodyH = lines.length * lineH;
  const cardH = headerH + pad + bodyH + pad;
  const cardX = (W - cardW) / 2;
  const cardY = Math.max(300, (H - cardH) / 2 - 60);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 16;
  roundRect(ctx, cardX, cardY, cardW, cardH, 48);
  ctx.fillStyle = "#FFF9ED";
  ctx.fill();
  ctx.restore();

  // Header strip
  ctx.save();
  roundRect(ctx, cardX, cardY, cardW, cardH, 48);
  ctx.clip();
  ctx.fillStyle = t.accent;
  ctx.fillRect(cardX, cardY, cardW, headerH);
  ctx.restore();
  ctx.fillStyle = t.on;
  ctx.textAlign = "left";
  ctx.font = `800 40px ${family}`;
  const label = opts.category === "QUESTION" ? "Anonymous question" : opts.category === "COMPLIMENT" ? "Anonymous compliment" : "Anonymous message";
  ctx.fillText(label, cardX + pad, cardY + 76);

  // Body
  ctx.fillStyle = "#0B1F3B";
  ctx.font = `700 ${fontSize}px ${family}`;
  lines.forEach((l, i) => ctx.fillText(l, cardX + pad, cardY + headerH + pad + fontSize + i * lineH));

  // Footer call to action
  ctx.textAlign = "center";
  ctx.fillStyle = t.fg;
  ctx.font = `700 46px ${family}`;
  ctx.fillText("Send me an anonymous message", W / 2, cardY + cardH + 150);
  ctx.globalAlpha = 0.8;
  ctx.font = `600 38px ${family}`;
  ctx.fillText(opts.link.replace(/^https?:\/\//, ""), W / 2, cardY + cardH + 215);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image"))), "image/png")
  );
}
