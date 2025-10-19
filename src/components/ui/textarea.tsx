"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string;
  label?: string;
  maxLength?: number;
  showCounter?: boolean;
  error?: boolean;
  success?: boolean;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      helperText,
      label,
      maxLength,
      showCounter,
      error,
      success,
      disabled,
      required,
      value: externalValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
      if (externalValue !== undefined) {
        setValue(String(externalValue));
      }
    }, [externalValue]);

    const getHelperTextColor = () => {
      if (error) return "text-danger";
      if (success && value) return "text-success";
      return "text-neutral-70";
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && <Label required={required}>{label}</Label>}

        <textarea
          ref={ref}
          data-slot="textarea"
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          required={required}
          className={cn(
            "w-full min-h-22 px-4 py-2 rounded-lg border-2 transition-all outline-none resize-none caret-primary",
            "bg-neutral-10 border-neutral-40 text-neutral-90 placeholder:text-neutral-60",
            "hover:border-primary/20",
            "focus:border-primary",
            "disabled:bg-neutral-30 disabled:border-neutral-40 disabled:text-neutral-60 disabled:cursor-not-allowed",
            error && "border-danger",
            className
          )}
          {...props}
        />

        {(helperText || showCounter) && (
          <div className="flex items-center justify-between gap-1">
            {helperText && (
              <p className={cn("text-xs font-normal", getHelperTextColor())}>
                {helperText}
              </p>
            )}
            {showCounter && maxLength && (
              <p className="text-xs font-normal text-neutral-70 ml-auto">
                {value.length}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
