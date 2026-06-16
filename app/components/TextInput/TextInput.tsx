"use client";

import { InputHTMLAttributes, ReactNode } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  placeholder?: string;
}

export function TextInput({
  leftIcon,
  rightSlot,
  placeholder,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className="flex h-[52px] w-full items-center gap-[10px] rounded-[10px] border-[1.5px] border-surface bg-surface-variant px-[14px] text-brand-400 transition-colors duration-150 focus-within:border-primary focus-within:bg-blue-50">
      {leftIcon && (
        <span className="flex shrink-0 items-center">{leftIcon}</span>
      )}
      <input
        className={`flex-1 bg-transparent text-[15px] text-brand-700 outline-none placeholder:text-brand-400 ${className}`}
        placeholder={placeholder}
      />
      {rightSlot && (
        <span className="flex shrink-0 items-center">{rightSlot}</span>
      )}
    </div>
  );
}
