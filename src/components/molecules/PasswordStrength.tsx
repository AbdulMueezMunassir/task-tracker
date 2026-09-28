import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const rules = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  {
    id: "case",
    label: "Upper & lowercase letters",
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { id: "number", label: "At least one number", test: (p: string) => /\d/.test(p) },
  {
    id: "symbol",
    label: "At least one symbol (! @ # ...)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

const levels = [
  { label: "", text: "", bar: "" },
  { label: "Weak", text: "text-rose-600", bar: "bg-rose-500" },
  { label: "Fair", text: "text-amber-600", bar: "bg-amber-500" },
  { label: "Good", text: "text-lime-600", bar: "bg-lime-500" },
  { label: "Strong", text: "text-emerald-600", bar: "bg-emerald-500" },
];

function getScore(password: string): number {
  if (!password) return 0;
  const passed = rules.filter((r) => r.test(password)).length;
  // Anything under 8 characters can never be better than "Weak"
  return password.length >= 8 ? passed : Math.min(passed, 1);
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const score = getScore(password);
  const level = levels[score];

  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                segment <= score ? level.bar : "bg-slate-200"
              )}
            />
          ))}
        </div>
        <span className={cn("text-xs font-medium w-12 text-right", level.text)}>
          {level.label}
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                ok ? "text-emerald-600" : "text-slate-500"
              )}
            >
              {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}