"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  onClose?: () => void;
  duration?: number; // in milliseconds, 0 = no auto-close
  type?: "success" | "error" | "warning" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      message,
      onClose,
      duration = 5000,
      type = "success",
      action,
    },
    ref
  ) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
      if (duration > 0 && onClose) {
        const timer = setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onClose();
          }, 300); // Match animation duration
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        onClose?.();
      }, 300);
    };

    const iconVariants = {
      success: <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />,
      error: <CheckCircle2 className="w-6 h-6 text-danger flex-shrink-0" />,
      warning: <CheckCircle2 className="w-6 h-6 text-warning flex-shrink-0" />,
      info: <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />,
    };

    return (
      <>
        <style>{`
          @keyframes slideInLeft {
            from {
              transform: translateX(-400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOutLeft {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(-400px);
              opacity: 0;
            }
          }

          .toast-enter {
            animation: slideInLeft 0.3s ease-out forwards;
          }

          .toast-exit {
            animation: slideOutLeft 0.3s ease-out forwards;
          }
        `}</style>
        <div
          ref={ref}
          className={cn(
            "fixed bottom-6 left-6 z-50",
            "flex flex-row items-center",
            "w-80 px-4 py-4 gap-2",
            "bg-white rounded-lg",
            "border-l-4 border-primary",
            "shadow-md",
            isExiting ? "toast-exit" : "toast-enter"
          )}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {iconVariants[type]}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-100 truncate">
              {message}
            </p>
          </div>

          {/* Action (optional) */}
          {action && (
            <button
              onClick={action.onClick}
              className="flex-shrink-0 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
            >
              {action.label}
            </button>
          )}

          {/* Close Button */}
          {onClose && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded hover:bg-neutral-10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-5 h-5 text-neutral-100" />
            </button>
          )}
        </div>
      </>
    );
  }
);

Toast.displayName = "Toast";

export { Toast };
