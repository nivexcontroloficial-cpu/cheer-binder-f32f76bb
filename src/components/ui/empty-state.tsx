import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-12 space-y-4 rounded-[32px] border border-dashed border-slate-200 bg-slate-50/50",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 text-slate-400 mb-2">
            {icon}
          </div>
        )}
        <div className="space-y-2 max-w-xs">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-900">{title}</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">{description}</p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
