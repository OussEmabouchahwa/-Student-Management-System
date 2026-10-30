import { FolderOpen, SearchX } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/cn";

export interface EmptyStateProps {
  variant: "no-data" | "no-matches";
  onAction: () => void;
  className?: string;
}

export function EmptyState({ variant, onAction, className }: EmptyStateProps) {
  const isNoData = variant === "no-data";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4 bg-paper rounded-lg border border-rule",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-navy mb-4" aria-hidden="true">
        {isNoData ? <FolderOpen className="h-6 w-6" /> : <SearchX className="h-6 w-6" />}
      </div>

      <h2 className="font-serif text-2xl font-semibold text-ink mb-1">
        {isNoData ? "No students in the register" : "No students match your search"}
      </h2>

      <p className="max-w-md text-ink-2 text-base mb-6">
        {isNoData
          ? "Get started by adding your first student record to the register."
          : "Try searching with a different name, email, or clear your course filters."}
      </p>

      <Button
        variant={isNoData ? "primary" : "secondary"}
        onClick={onAction}
      >
        {isNoData ? "+ Add student" : "Clear filters"}
      </Button>
    </div>
  );
}
