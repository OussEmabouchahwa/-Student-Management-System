import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "default" | "destructive";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", "aria-label": ariaLabel, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors duration-fast",
          "w-10 h-10 min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px]",
          "text-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "default" && "hover:bg-tint hover:text-ink active:bg-rule",
          variant === "destructive" &&
            "hover:bg-danger-soft hover:text-danger active:bg-danger-soft/80",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
