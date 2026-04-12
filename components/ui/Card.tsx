import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
      {...props}
    />
  );
}
