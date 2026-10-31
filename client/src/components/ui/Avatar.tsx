import { getInitials } from "../../lib/format";
import { cn } from "../../lib/cn";

export interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: "default" | "large";
  className?: string;
}

export function Avatar({ firstName, lastName, size = "default", className }: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-full bg-tint text-navy font-serif font-semibold",
        size === "default" && "h-10 w-10 text-base",
        size === "large" && "h-16 w-16 text-2xl",
        className
      )}
    >
      {initials}
    </div>
  );
}
