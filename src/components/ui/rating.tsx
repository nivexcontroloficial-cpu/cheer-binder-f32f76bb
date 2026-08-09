import * as React from "react";
import { cn } from "@/lib/utils";

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  onValueChange?: (value: number) => void;
  readonly?: boolean;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value, max = 5, onValueChange, readonly = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const isActive = starValue <= value;
          
          return (
            <button
              key={i}
              type="button"
              disabled={readonly}
              onClick={() => !readonly && onValueChange?.(starValue)}
              className={cn(
                "w-5 h-5 rounded-full transition-all",
                isActive ? "bg-rovya-amber shadow-sm" : "bg-slate-200",
                !readonly && "hover:scale-110 cursor-pointer"
              )}
            />
          );
        })}
      </div>
    );
  }
);
Rating.displayName = "Rating";

export { Rating };
