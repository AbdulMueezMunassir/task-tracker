"use client";

import { Calendar, MoreVertical } from "lucide-react";
import { PriorityBadge } from "@/components/atoms/PriorityBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@prisma/client";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  return (
    <div className="bg-card rounded-lg p-3.5 border border-border hover:border-slate-300 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-2 gap-2">
        <PriorityBadge priority={task.priority} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(task, "TODO")}
              disabled={task.status === "TODO"}
            >
              Move to To Do
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(task, "IN_PROGRESS")}
              disabled={task.status === "IN_PROGRESS"}
            >
              Move to In Progress
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(task, "DONE")}
              disabled={task.status === "DONE"}
            >
              Move to Done
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="text-rose-600 focus:text-rose-700"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="text-sm font-semibold leading-snug mb-1 line-clamp-2">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
          <div
            className={`flex items-center gap-1 text-[11px] font-medium ${
              isOverdue ? "text-rose-600" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span>
              {isOverdue ? "Overdue - " : ""}
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}