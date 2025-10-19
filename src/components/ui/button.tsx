import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-lg font-bold transition-all disabled:pointer-events-none shadow-button outline-none focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary !text-neutral-10 hover:bg-primary-hover active:bg-primary-pressed disabled:bg-neutral-30 disabled:!text-neutral-60 disabled:border disabled:border-neutral-40",
        secondary:
          "bg-secondary !text-neutral-90 hover:bg-secondary-hover active:bg-secondary-pressed disabled:bg-neutral-30 disabled:!text-neutral-60 disabled:border disabled:border-neutral-40",
        outline:
          "bg-neutral-10 !text-neutral-100 border border-neutral-40 hover:bg-neutral-20 active:bg-neutral-30 disabled:bg-neutral-30 disabled:!text-neutral-60 disabled:border disabled:border-neutral-40",
      },
      size: {
        sm: "h-7 px-4 text-sm-bold",
        md: "h-8 px-4 text-base-bold",
        lg: "h-10 px-4 text-lg-bold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}>
        {leadingIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children && <span>{children}</span>}
        {trailingIcon && (
          <span className="inline-flex shrink-0 size-4" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
