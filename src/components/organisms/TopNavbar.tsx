"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
    <header className="fixed top-0 left-0 md:left-60 right-0 h-14 z-30 flex items-center justify-between px-4 md:px-6 bg-card border-b border-border">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-muted border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold leading-none">
              {userName ?? "User"}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}