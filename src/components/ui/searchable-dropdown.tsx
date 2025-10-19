"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { ChevronDown } from "lucide-react";

export interface SearchableDropdownProps {
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
  options: { value: string; label: string }[];
  emptyText?: string;
  helperIcon?: React.ReactNode;
}

const SearchableDropdown = React.forwardRef<
  HTMLDivElement,
  SearchableDropdownProps
>(
  (
    {
      label,
      placeholder = "Choose an option",
      helperText,
      error,
      success,
      required,
      leadingIcon,
      value,
      onValueChange,
      disabled,
      options = [],
      emptyText = "No results found",
      helperIcon,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredOptions = React.useMemo(() => {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return options.slice(0, 50);
      }

      const lowerSearchTerm = searchTerm.toLowerCase().trim();

      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(lowerSearchTerm)
      );
      return filtered.slice(0, 50);
    }, [searchTerm, options]);

    const selectedLabel = React.useMemo(() => {
      return options.find((opt) => opt.value === value)?.label || "";
    }, [value, options]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "Backspace" && value && !searchTerm) {
        e.preventDefault();
        onValueChange?.("");
        setSearchTerm("");
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);
      setIsOpen(true);

      if (newValue === "" && value) {
        onValueChange?.("");
      }
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    const handleSelect = (selectedValue: string) => {
      onValueChange?.(selectedValue);
      setIsOpen(false);
      setSearchTerm("");
    };

    const getHelperTextColor = () => {
      if (error) return "text-danger";
      if (success && value) return "text-primary";
      return "text-neutral-70";
    };

    return (
      <div ref={ref} className="flex flex-col gap-2 w-full" {...props}>
        {label && <Label required={required}>{label}</Label>}

        <div ref={dropdownRef} className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm || (value ? selectedLabel : "")}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onClick={(e) => e.stopPropagation()}
            disabled={disabled}
            readOnly={false}
            className={cn(
              "w-full h-10 px-4 py-2 rounded-lg border-2 transition-all outline-none",
              "bg-neutral-10 border-neutral-40 text-neutral-90 placeholder:text-neutral-60",
              "hover:border-primary/20 focus:border-primary",
              "disabled:bg-neutral-30 disabled:border-neutral-40 disabled:text-neutral-60 disabled:cursor-not-allowed",
              "flex items-center justify-between gap-2",
              error && "border-danger",
              success && value && "border-primary",
              leadingIcon && "pl-8"
            )}
            style={{ paddingRight: value ? "2.5rem" : "2.5rem" }}
          />

          {leadingIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 size-4 flex items-center text-neutral-100 pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <ChevronDown
              size={16}
              className={cn(
                "text-neutral-100 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>

          {isOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 rounded-lg border border-neutral-40 bg-neutral-10 shadow-md">
              <div className="overflow-y-auto max-h-60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full px-4 py-2.5 !font-bold text-left text-sm transition-colors",
                        "hover:bg-neutral-20 focus:bg-neutral-20 focus:outline-none",
                        value === option.value
                          ? "bg-neutral-20 text-primary font-semibold"
                          : "text-neutral-90"
                      )}>
                      {option.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-neutral-70 text-center w-full">
                    {emptyText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {(helperText || (success && value && helperIcon)) && (
          <div className="flex items-center justify-between gap-1">
            {helperText && (
              <p
                className={cn(
                  "text-xs font-normal inline-flex",
                  getHelperTextColor()
                )}>
                {helperIcon && <span className="mr-1">{helperIcon}</span>}
                {helperText}
              </p>
            )}
            {success && value && helperIcon && !helperText && (
              <p
                className={cn(
                  "text-xs font-normal inline-flex",
                  getHelperTextColor()
                )}>
                {helperIcon && <span>{helperIcon}</span>}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
SearchableDropdown.displayName = "SearchableDropdown";

export { SearchableDropdown };
