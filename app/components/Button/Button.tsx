"use client";

import { ButtonHTMLAttributes } from "react";
import { ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  rightIcon,
  ...props
}: ButtonProps) {
  const base =
    "flex items-center justify-center gap-[10px] rounded-[10px] text-base font-medium tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer hover:bg-blue-gray-400"; ;

  const variants = {
    primary:
      "h-14 w-full bg-primary text-white hover:bg-primary-dark active:bg-primary-dark/80",
    ghost:
      "rounded-lg px-[18px] py-[10px] text-sm font-medium whitespace-nowrap bg-transparent text-primary hover:bg-surface-secondary",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Entrando…" : children}
      {rightIcon && (
        <span className="flex shrink-0 items-center">{rightIcon}</span>
      )}
    </button>
  );
}
