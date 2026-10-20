import { User } from "lucide-react";
const PALETTE = ["#C6FF3B", "#8B7CF6", "#FF6B4A", "#A78BFA", "#7DD3FC"];
const colorFor = (id: string) => PALETTE[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

export default function Avatar({ id, size = 40 }: { id: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full" style={{ background: colorFor(id), width: size, height: size }}>
      <User size={size * 0.5} className="text-navy" />
    </span>
  );
}
