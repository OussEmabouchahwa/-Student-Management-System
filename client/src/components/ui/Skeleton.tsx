import { cn } from "../../lib/cn";

export interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-rule/70", className)} aria-hidden="true" />
  );
}

export function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="flex flex-col divide-y divide-rule"
      role="status"
      aria-label="Loading student records"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1 max-w-xs">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="hidden sm:block w-36">
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="hidden sm:block w-16">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="hidden sm:block w-28">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading records...</span>
    </div>
  );
}
