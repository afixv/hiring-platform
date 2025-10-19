"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import Image from "next/image";

import * as Popover from "@radix-ui/react-popover";
import { getCountries, type Country } from "@/service/useGetCountry";

export interface PhoneInputValue {
  code: string;
  number: string;
}

export interface PhoneInputProps {
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
  label?: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const PhoneInput = ({
  value,
  onChange,
  label,
  error,
  success,
  required,
  helperText,
  disabled,
}: PhoneInputProps) => {
  const [open, setOpen] = React.useState(false);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Ambil data negara saat komponen pertama kali dirender
  React.useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  const selectedCountry = React.useMemo(
    () => countries.find((c) => c.dial_code === value.code) || countries[0],
    [countries, value.code]
  );

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dial_code.includes(searchTerm)
  );

  return (
    <div className="flex w-full flex-col gap-2 font-sans">
      {label && <Label required={required}>{label}</Label>}
      <div
        className={cn(
          "flex !h-10 items-center rounded-lg border-2 transition-all bg-neutral-10 border-neutral-40",
          "hover:border-primary/20",
          "focus-within:border-primary",
          error && "border-danger",
          success && value.number && "border-success",
          disabled &&
            "bg-neutral-30 border-neutral-40 text-neutral-60 cursor-not-allowed"
        )}>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild disabled={disabled}>
            <button
              type="button"
              className="flex shrink-0 cursor-pointer items-center gap-2 p-2.5 transition-colors ">
              <div className="h-5 w-5 overflow-hidden rounded-full border border-neutral-200">
                <Image
                  src={selectedCountry?.flag || "/placeholder-flag.png"}
                  alt={selectedCountry?.name || "flag"}
                  width={16}
                  height={16}
                  className="h-full w-full object-cover"
                />
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-neutral-600 transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
          </Popover.Trigger>
          <Popover.Content
            align="start"
            className="z-10 mt-1 w-[346px] rounded-lg border border-neutral-20 bg-white shadow-modal">
            <div className=" p-4 border-b border-neutral-40">
              <div className="relative !text-sm !h-10">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-100 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full caret-primary h-10 px-4 py-2 pl-8 rounded-lg border-1 transition-all outline-none bg-neutral-10 border-neutral-40 text-neutral-90 placeholder:text-neutral-60 hover:border-primary/20 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Country List */}
            <div className="max-h-[250px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => {
                      onChange({ ...value, code: country.dial_code });
                      setOpen(false);
                      setSearchTerm("");
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded px-4 py-2.5 text-xs",
                      country.code === selectedCountry?.code
                        ? "bg-primary/5"
                        : "hover:bg-transparent hover:text-primary"
                    )}>
                    <div className="h-5 w-5 overflow-hidden rounded-full border border-neutral-200">
                      <Image
                        src={country?.flag || "/placeholder-flag.png"}
                        alt={country?.name || "flag"}
                        width={20}
                        height={20}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span
                      className={cn(
                        "flex-1 font-bold",
                        country.code === selectedCountry?.code
                          ? "text-primary"
                          : "text-neutral-900 hover:text-primary"
                      )}>
                      {country.name}
                    </span>
                    <span className="text-neutral-900">
                      {country.dial_code}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-neutral-90">
                  Keyword <strong>&quot;{searchTerm}&quot;</strong> tidak
                  ditemukan
                </div>
              )}
            </div>
            {/* Search Input inside Popover */}
          </Popover.Content>
        </Popover.Root>

        {/* Divider */}
        <div className="h-6 w-[0.5px] bg-neutral-40" />

        {/* Phone Number Input */}
        <div className="flex items-center gap-2 pl-2 ">
          <span className="text-sm text-neutral-90">{value.code}</span>
          <input
            type="tel"
            placeholder="81XXXXXXXXX"
            className="w-full caret-primary bg-transparent text-sm text-neutral-90 placeholder:text-neutral-60 focus:outline-none disabled:text-neutral-60 disabled:cursor-not-allowed"
            value={value.number}
            onChange={(e) =>
              onChange({ ...value, number: e.target.value.replace(/\D/g, "") })
            }
            disabled={disabled}
          />
        </div>
      </div>
      {helperText && (
        <p
          className={cn(
            "text-xs font-normal",
            error
              ? "text-danger"
              : success && value.number
              ? "text-success"
              : "text-neutral-70"
          )}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
