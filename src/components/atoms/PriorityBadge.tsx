import { cn } from "@/lib/utils";

type Priority = "LOW" | "MEDIUM" | "HIGH";

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-800 border-amber-200",
  HIGH: "bg-rose-50 text-rose-700 border-rose-200",
};

const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border",
        priorityStyles[priority]
      )}
    >
      {priorityLabels[priority]}
    </span>
  );
}