import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-xs font-normal text-neutral-90",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-danger">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };