import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search by name, email or course...",
  debounceMs = 250,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const isFirstRender = useRef(true);

  // Sync internal state when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce notify
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-2"
        aria-hidden="true"
      />
      <input
        type="search"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search students"
        className={cn(
          "h-11 w-full rounded-md border border-rule-strong bg-paper pl-10 pr-10 text-ink placeholder:text-ink-2/60",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-navy focus-visible:ring-offset-2",
          "transition-colors duration-fast"
        )}
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-2.5 flex h-7 w-7 items-center justify-center rounded-md text-ink-2 hover:bg-tint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
