"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  helperText?: string;
  label?: string;
  maxLength?: number;
  showCounter?: boolean;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  prefixText?: React.ReactNode;
  suffixText?: React.ReactNode;
  numericOnly?: boolean;
  helperIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leadingIcon,
      trailingIcon,
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
      prefixText,
      suffixText,
      numericOnly,
      helperIcon,
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
      if (success && value) return "text-primary";
      return "text-neutral-70";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Filter numeric only if enabled
      if (numericOnly) {
        newValue = newValue.replace(/\D/g, '');
      }
      
      setValue(newValue);
      
      // Call original onChange with modified value
      onChange?.({
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && <Label required={required}>{label}</Label>}

        <div className="flex items-center gap-2 relative">
          {leadingIcon && (
            <span className="absolute left-3 size-4 flex items-center text-neutral-100 pointer-events-none">
              {leadingIcon}
            </span>
          )}

          {prefixText && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm-bold text-neutral-90 pointer-events-none">
              {prefixText}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            data-slot="input"
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            className={cn(
              "w-full h-10 px-4 py-2 rounded-lg border-2 transition-all outline-none caret-primary",
              "bg-neutral-10 border-neutral-40 text-neutral-90 placeholder:text-neutral-60",
              "hover:border-primary/20",
              "focus:border-primary ",
              "disabled:bg-neutral-30 disabled:border-neutral-40 disabled:text-neutral-60 disabled:cursor-not-allowed",
              error && "border-danger",
              leadingIcon && "pl-8",
              trailingIcon && "pr-8",
              prefixText && "pl-8",
              suffixText && "pr-8",
              className
            )}
            {...props}
          />

          {suffixText && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-neutral-70 pointer-events-none">
              {suffixText}
            </span>
          )}

          {trailingIcon && (
            <span className="absolute right-3 size-4 flex items-center text-neutral-100 pointer-events-none">
              {trailingIcon}
            </span>
          )}
        </div>

        {(helperText || showCounter) && (
          <div className="flex items-center justify-between gap-1">
            {helperText && (
              <p className={cn("text-xs font-normal inline-flex", getHelperTextColor())}>
                {helperIcon && <span className="mr-1">{helperIcon}</span>}
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
Input.displayName = "Input";

export { Input };
