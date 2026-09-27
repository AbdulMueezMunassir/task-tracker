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
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

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
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer — full screen height + solid white */}
          <aside className="absolute left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Brand + Close */}
              <div className="flex items-center justify-between mb-6">
                {/* ...existing brand + X button... */}
              </div>

              {/* Nav */}
              <nav className="flex flex-col gap-1">
                {/* ...existing nav items... */}
              </nav>
            </div>

            {/* Sticky Logout at Bottom */}
            <div className="p-4 border-t border-slate-200">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 w-full"
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