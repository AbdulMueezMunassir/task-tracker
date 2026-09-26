import { cn } from "@/lib/utils";

type StatsCardProps = {
  label: string;
  value: number;
  variant?: "default" | "danger";
};

export function StatsCard({
  label,
  value,
  variant = "default",
}: StatsCardProps) {
  const isDanger = variant === "danger" && value > 0;

  return (
    <div
      className={cn(
        "p-4 bg-card border rounded-xl shadow-sm",
        isDanger
          ? "border-rose-200 bg-gradient-to-br from-white to-rose-50/30"
          : "border-border"
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wider",
          isDanger ? "text-rose-700" : "text-muted-foreground"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-bold mt-2",
          isDanger ? "text-rose-600" : ""
        )}
      >
        {value}
      </p>
    </div>
  );
}