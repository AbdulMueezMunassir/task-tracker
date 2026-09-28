"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  status?: "default" | "valid" | "invalid";
};

const statusClasses = {
  default: "border-slate-300 focus:ring-blue-500 focus:border-blue-500",
  valid: "border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500",
  invalid: "border-rose-400 focus:ring-rose-500 focus:border-rose-500",
};

export function PasswordInput({
  status = "default",
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(
          "w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 transition-all",
          statusClasses[status],
          className
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 transition-colors"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}