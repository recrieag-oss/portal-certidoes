import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-[28px] px-6 py-4 text-base font-semibold transition will-change-transform focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-brand-600 text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-700",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  };

  return <button className={cn(base, variants[variant], className)} {...props} />;
}
