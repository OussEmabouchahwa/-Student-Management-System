import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ToastMessage {
  id: string;
  message: string;
  type?: "status" | "error";
}

interface ToastContextValue {
  showToast: (message: string, type?: "status" | "error") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "status" | "error" = "status") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const id = Math.random().toString(36).slice(2);
    setToast({ id, message, type });

    // Auto-dismiss after 2600ms as instructed by DESIGN_SYSTEM.md section 7
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-fast"
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-md px-5 py-3 text-sm font-bold shadow-card select-none",
              toast.type === "error"
                ? "bg-danger text-white"
                : "bg-ink text-white"
            )}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
