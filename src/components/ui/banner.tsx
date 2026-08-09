import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle, Info } from "lucide-react";

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description: string;
  onClose?: () => void;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant = 'info', title, description, onClose, ...props }, ref) => {
    const variants = {
      info: {
        bg: "bg-blue-50 border-blue-100",
        icon: <Info size={18} className="text-blue-600" />,
        text: "text-blue-900",
        desc: "text-blue-700",
      },
      success: {
        bg: "bg-emerald-50 border-emerald-100",
        icon: <Check size={18} className="text-emerald-600" />,
        text: "text-emerald-900",
        desc: "text-emerald-700",
      },
      warning: {
        bg: "bg-amber-50 border-amber-100",
        icon: <AlertCircle size={18} className="text-amber-600" />,
        text: "text-amber-900",
        desc: "text-amber-700",
      },
      error: {
        bg: "bg-red-50 border-red-100",
        icon: <X size={18} className="text-red-600" />,
        text: "text-red-900",
        desc: "text-red-700",
      },
    };

    const style = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full p-4 border rounded-2xl flex items-start gap-3",
          style.bg,
          className
        )}
        {...props}
      >
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1 space-y-1">
          {title && <p className={cn("text-xs font-black uppercase tracking-wider", style.text)}>{title}</p>}
          <p className={cn("text-sm font-medium leading-relaxed", style.desc)}>{description}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={16} className={style.text} />
          </button>
        )}
      </div>
    );
  }
);
Banner.displayName = "Banner";

export { Banner };
