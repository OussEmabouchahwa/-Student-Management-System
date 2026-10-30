import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/cn";

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (total === 0) return null;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none",
        className
      )}
    >
      <div className="text-sm font-normal text-ink-2">
        Showing{" "}
        <span className="tabular-nums font-bold text-ink">{start}</span> to{" "}
        <span className="tabular-nums font-bold text-ink">{end}</span> of{" "}
        <span className="tabular-nums font-bold text-ink">{total}</span>{" "}
        {total === 1 ? "student" : "students"}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Go to previous page"
          className="h-10 px-3 min-w-[44px]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Previous</span>
        </Button>

        <span className="text-sm text-ink-2 px-2 tabular-nums">
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Go to next page"
          className="h-10 px-3 min-w-[44px]"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
