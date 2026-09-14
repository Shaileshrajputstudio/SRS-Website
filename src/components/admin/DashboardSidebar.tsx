"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChangePasswordButton } from "@/components/ChangePasswordButton";
import { HomeIcon, BoxIcon, TagIcon, BookIcon, ImageIcon, NewspaperIcon, PhoneIconAdmin } from "./icons";

const NAV_ITEMS = [
  { href: "/admin/home", label: "Home Page", icon: HomeIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/series-categories", label: "Series Categories", icon: TagIcon },
  { href: "/admin/collections", label: "Story Categories", icon: BookIcon },
  { href: "/admin/exhibitions", label: "Exhibitions", icon: ImageIcon },
  { href: "/admin/press", label: "Press", icon: NewspaperIcon },
  { href: "/admin/contact", label: "Contact Info", icon: PhoneIconAdmin },
];

// These pages exist on the public site but don't have editable content
// yet — listed here so the sidebar reflects the whole site, scoped out
// as separate follow-up work rather than built all at once.
const COMING_SOON_ITEMS = [
  { label: "The Studio" },
  { label: "Sadhana" },
  { label: "Films" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-64 shrink-0 flex-col justify-between border-r border-gray-200 bg-white px-3 py-6">
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-gray-900" : "text-gray-400"}`} />
                {item.label}
              </Link>
            </li>
          );
        })}

        <li className="my-2 border-t border-gray-100" />

        {COMING_SOON_ITEMS.map((item) => (
          <li key={item.label}>
            <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-300">
              {item.label}
              <span className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-gray-300 uppercase">
                Soon
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-100 pt-3">
        <ChangePasswordButton className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900" />
      </div>
    </nav>
  );
}
