import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-md border bg-paper px-3 text-ink transition-colors duration-fast",
          "placeholder:text-ink-2/60",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-navy focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:bg-ground disabled:text-ink-2",
          hasError ? "border-danger focus-visible:ring-danger" : "border-rule-strong",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
