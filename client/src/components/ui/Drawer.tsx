import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-ink/40 backdrop-blur-none transition-opacity",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        {/* Drawer panel: full width on mobile, 460px on desktop */}
        <DialogPrimitive.Content
          // Prevent closing on backdrop click to protect user input as instructed by design system
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[460px] flex-col bg-paper shadow-drawer",
            "transition-transform duration-base ease-out-custom",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "focus-visible:outline-none"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rule px-6 py-5">
            <div>
              <DialogPrimitive.Title className="font-serif text-2xl font-semibold text-ink">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-sm text-ink-2">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>

            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close drawer"
                className="flex h-10 w-10 items-center justify-center rounded-md text-ink-2 hover:bg-tint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>

          {/* Sticky footer */}
          {footer && (
            <div className="sticky bottom-0 border-t border-rule bg-paper px-6 py-4">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
