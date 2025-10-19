"use client";

import React from "react";

export type ChipState = "active" | "rest";

interface ChipProps {
  label: string;
  state?: ChipState;
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  state = "rest",
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "inline-flex cursor-pointer flex-row items-center gap-2 px-3 py-1 h-8 rounded-full transition-all duration-200 font-sans text-sm font-400 leading-6";

  const stateStyles = {
    rest: "bg-white border border-neutral-40 text-neutral-90 hover:bg-neutral-30 hover:text-neutral-90 hover:border-neutral-40",
    active:
      "bg-white border border-primary text-primary hover:bg-neutral-30 hover:text-neutral-90  hover:border-neutral-40",
  };

  const disabledStyles = disabled
    ? "bg-neutral-30 border border-neutral-40 text-neutral-60 !cursor-not-allowed opacity-60"
    : "";

  const chipStyles = `${baseStyles} ${stateStyles[state]} ${disabledStyles} ${className}`;

  return (
    <div className={chipStyles}>
      <span className="flex-1 truncate">{label}</span>
    </div>
  );
};

export default Chip;
