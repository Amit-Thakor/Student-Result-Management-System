import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", label, error, helperText, id, ...props },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="form-field space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="label block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "input flex h-10 w-full rounded-lg border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            // Better autofill styling for both light and dark modes
            "autofill:bg-blue-50 dark:autofill:bg-blue-900 autofill:text-gray-900 dark:autofill:text-gray-100 autofill:shadow-[inset_0_0_0px_1000px_rgb(239_246_255)] dark:autofill:shadow-[inset_0_0_0px_1000px_rgb(30_58_138)]",
            error
              ? "border-red-300 dark:border-red-600 focus-visible:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus-visible:ring-primary-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
