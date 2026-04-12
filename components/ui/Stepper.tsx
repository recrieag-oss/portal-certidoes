import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentIndex: number;
}

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        return (
          <div key={step} className="flex items-center gap-4 md:w-1/4">
            <motion.div
              layout
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold",
                isComplete
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-500",
              )}
            >
              {isComplete ? "✓" : index + 1}
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{step}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
