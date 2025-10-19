import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, label, id, checked, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
      onChange?.(e);
    };

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      setIsChecked(checked || false);
    }, [checked]);

    return (
      <div
        className={cn(
          "flex flex-row items-start gap-2",
          "w-[139px] h-6",
          "flex-none order-0 flex-grow-0",
          className
        )}>
        {/* Radio Button Circle */}
        <div
          className={cn(
            "relative",
            "w-5 h-5",
            "flex-none order-0 flex-grow-0"
          )}>
          {/* Outer Ellipse (Stroke) */}
          <input
            ref={inputRef}
            type="radio"
            id={inputId}
            checked={isChecked}
            onChange={handleChange}
            className={cn(
              "absolute inset-0 w-full h-full",
              "appearance-none cursor-pointer",
              "border-2 border-[#404040] rounded-full",
              "transition-all",
              "outline-none"
            )}
            {...props}
          />

          {/* Inner Ellipse (when checked) */}
          {isChecked && (
            <div
              className={cn(
                "absolute top-1/2 left-1/2 -translate-1/2  w-[11px] h-[11px]",
                "rounded-full",
                "bg-[#01959F]",
                "pointer-events-none"
              )}
            />
          )}
        </div>

        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "w-[107px] h-6",
              "font-sans text-sm font-normal",
              "leading-6 flex items-end",
              "text-[#404040]",
              "cursor-pointer",
              "flex-none order-1 flex-grow-0"
            )}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";

export { RadioButton };
