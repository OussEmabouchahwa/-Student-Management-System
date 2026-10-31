import React from "react";

export interface StudentHighlightProps {
  text: string;
  query?: string;
  className?: string;
}

export function StudentHighlight({ text, query, className }: StudentHighlightProps) {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-marker text-ink rounded-sm px-0.5 font-semibold"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
