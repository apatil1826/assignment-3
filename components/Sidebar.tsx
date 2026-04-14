"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/contacts", label: "Contacts", icon: ContactsIcon },
  { href: "/log", label: "Log", icon: LogIcon },
  { href: "/network", label: "Network", icon: NetworkIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 flex flex-col px-4 py-6">
      <Link href="/" className="mb-10 px-2">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          NexMap
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Networking Tracker</p>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:text-slate-900 hover:bg-gray-50"
              }`}
            >
              <Icon active={isActive} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-2">
        <UserButton afterSignOutUrl="/sign-in" showName />
      </div>
    </aside>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  const color = active ? "#4f46e5" : "#64748b";
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ContactsIcon({ active }: { active: boolean }) {
  const color = active ? "#4f46e5" : "#64748b";
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LogIcon({ active }: { active: boolean }) {
  const color = active ? "#4f46e5" : "#64748b";
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function NetworkIcon({ active }: { active: boolean }) {
  const color = active ? "#4f46e5" : "#64748b";
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M12 7.5v4.5m-4.5 3L10 14m4 0l2.5 2" />
    </svg>
  );
}
