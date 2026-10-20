"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, ExternalLink, Settings, Shield } from "lucide-react";

type Item = { href: string; label: string; Icon: typeof Home; exact?: boolean; badge?: number; external?: boolean };

export default function SidebarNav({ unread, username, isAdmin, bottom }: { unread: number; username: string; isAdmin: boolean; bottom?: boolean }) {
  const path = usePathname();
  const items: Item[] = [
    { href: "/dashboard", label: "Home", Icon: Home, exact: true },
    { href: "/dashboard/inbox", label: "Inbox", Icon: Inbox, badge: unread },
    { href: `/u/${username}`, label: "My page", Icon: ExternalLink, external: true },
    { href: "/dashboard/settings", label: "Settings", Icon: Settings },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", Icon: Shield }] : []),
  ];

  return (
    <nav className={bottom ? "flex w-full" : "space-y-1"}>
      {items.map(({ href, label, Icon, exact, badge, external }) => {
        const active = !external && (exact ? path === href : path.startsWith(href));
        const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
        return bottom ? (
          <Link key={href} href={href} {...ext} className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${active ? "text-lime" : "text-cream/70"}`}>
            <span className="relative">
              <Icon size={20} />
              {!!badge && <span className="absolute -right-2 -top-1 h-2.5 w-2.5 rounded-full bg-coral" />}
            </span>
            {label}
          </Link>
        ) : (
          <Link key={href} href={href} {...ext} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold ${active ? "bg-lime text-navy" : "text-cream/80 hover:bg-cream/10"}`}>
            <Icon size={18} />
            {label}
            {!!badge && <span className="ml-auto rounded-full bg-coral px-2 py-0.5 text-xs text-white">{badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
