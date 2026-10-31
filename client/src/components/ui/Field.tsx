import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FieldProps {
  label: string;
  error?: string;
  helperText?: string;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}

export function Field({
  label,
  error,
  helperText,
  optional = false,
  htmlFor,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const id = htmlFor || generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[0.95rem] font-bold text-ink">
          {label}
        </label>
        {optional && <span className="text-sm font-normal text-ink-2">(optional)</span>}
      </div>

      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
      })}

      {error ? (
        <p id={errorId} role="alert" className="text-sm font-normal text-danger">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm font-normal text-ink-2">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
