"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon" | "xs";
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      disabled,
      children,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg";

    const variants = {
      default:
        "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus-visible:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      destructive:
        "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus-visible:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      outline:
        "border-2 border-blue-400 bg-white text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-500 focus-visible:ring-blue-500 shadow-md hover:shadow-lg",
      secondary:
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus-visible:ring-gray-500 shadow-md hover:shadow-lg",
      ghost:
        "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900 focus-visible:ring-gray-500 hover:shadow-md",
      link:
        "text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500",
      gradient:
        "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus-visible:ring-purple-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    };

    const sizes = {
      xs: "h-7 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="mr-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-1">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
