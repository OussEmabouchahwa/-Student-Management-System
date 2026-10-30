import { formatGpa } from "../../lib/format";
import { cn } from "../../lib/cn";

export interface GpaMeterProps {
  gpa: number | null | undefined;
  className?: string;
}

export function GpaMeter({ gpa, className }: GpaMeterProps) {
  const isGraded = gpa !== null && gpa !== undefined && !isNaN(gpa);
  // Max GPA scale is 4.0
  const percentage = isGraded ? Math.min(Math.max((gpa / 4.0) * 100, 0), 100) : 0;

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      {isGraded ? (
        <>
          <div
            className="h-1.5 w-16 overflow-hidden rounded-full bg-rule"
            role="progressbar"
            aria-valuenow={gpa}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label={`GPA ${formatGpa(gpa)} out of 4.00`}
          >
            <div
              className="h-full bg-navy transition-all duration-base"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="tabular-nums font-sans text-sm font-bold text-ink">
            {formatGpa(gpa)}
          </span>
        </>
      ) : (
        <span className="font-sans text-sm font-normal text-ink-2">Not graded</span>
      )}
    </div>
  );
}
