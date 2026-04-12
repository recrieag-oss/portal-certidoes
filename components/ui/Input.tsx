import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        error && "border-danger-500 focus:border-danger-500 focus:ring-danger-100",
        className,
      )}
      {...props}
    />
  );
}
