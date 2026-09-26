"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Kanban, Settings, BookOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks / Board", icon: Kanban },
  { href: "/settings", label: "Settings", icon: Settings },
];

const footerItems = [
  { href: "/docs", label: "Documentation", icon: BookOpen },  
  { href: "/support", label: "Support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 z-40 flex-col justify-between p-4 bg-card border-r border-border">
      {/* Top Section */}
      <div className="flex flex-col gap-5">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight leading-none">
              Klaro
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Enterprise Workspace
            </span>
          </div>
        </Link>

        {/* Primary Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Nav */}
      <div className="flex flex-col gap-1 pt-3 border-t border-border">
        {footerItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}