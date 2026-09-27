"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/organisms/MobileNav";
import { logoutAction } from "@/lib/actions/auth";

type TopNavbarProps = {
  userEmail?: string;
  userName?: string;
};

export function TopNavbar({ userEmail, userName }: TopNavbarProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail?.[0].toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 left-0 md:left-60 right-0 h-14 z-30 flex items-center justify-between px-3 md:px-6 bg-white/70 backdrop-blur-md border-b border-slate-200/70">
      {/* Left: Mobile Menu */}
      <div className="flex items-center gap-2 flex-1">
        <MobileNav />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Bell removed */}

        <div className="hidden md:flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-none">
              {userName ?? "User"}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Desktop Logout */}
        <form action={logoutAction} className="hidden md:block">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all duration-200"
            >
            <LogOut className="h-3.5 w-3.5" />
            Logout
            </Button>
        </form>

        {/* Mobile Avatar (visible on mobile) */}
        <Avatar className="h-8 w-8 border border-border md:hidden">
          <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}