"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PriorityBadge } from "@/components/atoms/PriorityBadge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import type { Task } from "@prisma/client";

export function DashboardTasksList({ tasks }: { tasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const now = new Date();

  const filtered = tasks.filter((t) => {
    const q = debounced.toLowerCase().trim();
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Tasks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {filtered.length} {filtered.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9 pr-3 w-full text-sm bg-white/60 border border-slate-200/70 rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-slate-200/70">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {debounced ? "No matching tasks" : "No tasks yet. Create one from the Task Board."}
          </div>
        ) : (
          filtered.slice(0, 10).map((task) => {
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < now &&
              task.status !== "DONE";
            return (
              <Link
                key={task.id}
                href="/tasks"
                className="flex items-center gap-3 p-3.5 hover:bg-white/50 transition-colors group"
              >
                <PriorityBadge priority={task.priority} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={task.status} />
                {task.dueDate && (
                  <span
                    className={`text-[11px] font-medium whitespace-nowrap ${
                      isOverdue ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    {isOverdue ? "Overdue " : ""}
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>

      {filtered.length > 10 && (
        <div className="p-3 border-t border-slate-200/70 text-center">
          <Link
            href="/tasks"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View all {filtered.length} tasks →
          </Link>
        </div>
      )}
    </div>
  );
}