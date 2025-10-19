"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface SelectProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  leadingIcon?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      placeholder,
      helperText,
      error,
      success,
      required,
      leadingIcon,
      children,
      value,
      onValueChange,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className="flex flex-col gap-2 w-full">
        {label && <Label required={required}>{label}</Label>}

        <SelectPrimitive.Root
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          {...props}>
          <SelectPrimitive.Trigger
            className={cn(
              "group w-full h-10 px-4 py-2 rounded-lg border-2 transition-all outline-none",
              "bg-neutral-10 border-neutral-40 text-neutral-90 placeholder:text-neutral-60",
              "hover:border-primary/20",
              "focus:border-primary focus:ring-0",
              "disabled:bg-neutral-30 disabled:border-neutral-40 disabled:text-neutral-60 disabled:cursor-not-allowed",
              "flex items-center justify-between gap-2",
              error && "border-danger",
              leadingIcon && "pl-8",
              success && value && "border-success"
            )}>
            {leadingIcon && (
              <span className="absolute left-3 size-4 flex items-center text-neutral-100 pointer-events-none">
                {leadingIcon}
              </span>
            )}
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="size-4 text-neutral-100 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "relative z-50 overflow-hidden rounded-lg border border-neutral-40",
                "bg-neutral-10 text-neutral-100 text-xs-bold shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              )}
              style={{ width: "var(--radix-select-trigger-width)" }}
              position="popper"
              side="bottom"
              avoidCollisions={true}
              sideOffset={4}>
              <SelectPrimitive.Viewport className="p-1 py-2">
                {children}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {helperText && (
          <p
            className={cn(
              "text-xs font-normal",
              error
                ? "text-danger"
                : success && value
                ? "text-success"
                : "text-neutral-70"
            )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

const SelectGroup = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Group
    ref={ref}
    className={cn("overflow-hidden", className)}
    {...props}
  />
));
SelectGroup.displayName = SelectPrimitive.Group.displayName;

const SelectValue = SelectPrimitive.Value;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pr-8 pl-2 text-sm outline-none",
      "focus:bg-neutral-30 focus:text-neutral-100 !font-bold !text-xs",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "hover:bg-neutral-20",
      className
    )}
    {...props}>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary font-bold" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-40", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export { Select, SelectGroup, SelectValue, SelectItem, SelectSeparator };
