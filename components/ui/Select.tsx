import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
}
