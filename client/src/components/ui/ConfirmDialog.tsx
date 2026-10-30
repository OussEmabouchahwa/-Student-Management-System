import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "./Button";
import { cn } from "../../lib/cn";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  studentName,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-ink/40 transition-opacity",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialogPrimitive.Content
            className={cn(
              "w-full max-w-md rounded-lg bg-paper p-6 shadow-dialog border border-rule",
              "transition-all duration-base ease-out-custom",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "focus-visible:outline-none"
            )}
          >
            <AlertDialogPrimitive.Title className="font-serif text-2xl font-semibold text-ink">
              Delete student record
            </AlertDialogPrimitive.Title>

            <AlertDialogPrimitive.Description className="mt-2.5 text-base text-ink-2 leading-relaxed">
              <span className="font-bold text-ink">{studentName}</span> will be removed from the register. This can&apos;t be undone.
            </AlertDialogPrimitive.Description>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="secondary" disabled={isLoading}>
                  Keep student
                </Button>
              </AlertDialogPrimitive.Cancel>

              <AlertDialogPrimitive.Action asChild>
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    onConfirm();
                  }}
                  isLoading={isLoading}
                >
                  Delete student
                </Button>
              </AlertDialogPrimitive.Action>
            </div>
          </AlertDialogPrimitive.Content>
        </div>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
