import * as React from "react";
import { cn } from "@/lib/utils";

const Chip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' | 'active', label: string, icon?: React.ReactNode }>(
  ({ className, variant = 'default', label, icon, ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200",
      outline: "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50",
      active: "bg-rovya-orange text-white border-transparent shadow-sm",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all cursor-default select-none",
          variants[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {label}
      </div>
    );
  }
);
Chip.displayName = "Chip";

export { Chip };
