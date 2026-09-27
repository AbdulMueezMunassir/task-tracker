"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Settings,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  LogOut,
  BarChart3,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks / Board", icon: Kanban },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/docs", label: "Documentation", icon: BookOpen },
  { href: "/support", label: "Support", icon: HelpCircle },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          {/* Sidebar Panel — Full height, solid white */}
          <aside
            className="absolute left-0 top-0 h-screen w-72 flex flex-col shadow-2xl"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Header: Brand + Close (Fixed at Top) */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  K
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm tracking-tight leading-none text-slate-900">
                    Klaro
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Enterprise Workspace
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 text-slate-700" />
              </button>
            </div>

            {/* Navigation Links (Scrollable Middle) */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout (Fixed at Bottom) */}
            <div className="p-4 border-t border-slate-200">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 w-full"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}