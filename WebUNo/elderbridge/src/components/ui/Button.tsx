"use client";

import React, { forwardRef, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-3",
    "font-bold leading-none tracking-wide",
    "min-h-[88px] min-w-[88px] px-8",
    "text-[32px]",
    "rounded-2xl",
    "cursor-pointer",
    "select-none",
    "transition-all duration-100 ease-out",
    "focus:outline-none",
    "focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2",
    "active:scale-[0.97]",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "w-full md:w-auto",
    "antialiased whitespace-nowrap",
    "relative overflow-hidden",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-[#1A56DB] text-[#FFFDF5]","border-2 border-[#1A56DB]","shadow-md","hover:bg-[#1446B8] hover:border-[#1446B8] hover:shadow-lg","active:bg-[#0F3590] active:border-[#0F3590]"],
        danger:  ["bg-[#CC0000] text-[#FFFDF5]","border-2 border-[#CC0000]","shadow-md","hover:bg-[#AA0000] hover:border-[#AA0000] hover:shadow-lg","active:bg-[#880000] active:border-[#880000]"],
        success: ["bg-[#1A7340] text-[#FFFDF5]","border-2 border-[#1A7340]","shadow-md","hover:bg-[#155C33] hover:border-[#155C33] hover:shadow-lg","active:bg-[#0F4426] active:border-[#0F4426]"],
        warning: ["bg-[#8B4000] text-[#FFFDF5]","border-2 border-[#8B4000]","shadow-md","hover:bg-[#703300] hover:border-[#703300] hover:shadow-lg","active:bg-[#562600] active:border-[#562600]"],
        outline: ["bg-[#FFFDF5] text-[#1A56DB]","border-2 border-[#1A56DB]","shadow-sm","hover:bg-[#EBF2FF] hover:shadow-md","active:bg-[#FFFDF5]"],
        ghost:   ["bg-transparent text-[#1A1A1A]","border-2 border-[#D0C8B8]","hover:bg-[#F5F0E8] hover:border-[#9E9580]","active:bg-[#EDEDDD]"],
      },
      size: {
        sm:      ["min-h-[72px] min-w-[72px]","text-[26px]","px-6","rounded-xl"],
        md:      ["min-h-[88px] min-w-[88px]","text-[32px]","px-8","rounded-2xl"],
        lg:      ["min-h-[96px] min-w-[96px]","text-[32px]","px-10","rounded-2xl"],
        icon:    ["min-h-[72px] min-w-[72px]","h-[72px] w-[72px]","p-0","rounded-xl"],
        "icon-lg":["min-h-[96px] min-w-[96px]","h-[96px] w-[96px]","p-0","rounded-full"],
      },
      fullWidth: {
        true:  "w-full",
        false: "w-full md:w-auto",
      },
    },
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?:      boolean;
  loadingText?:    string;
  icon?:           React.ReactNode;
  iconPosition?:   "left" | "right";
  speakOnFocus?:   string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading = false, loadingText = "Please wait...",
     icon, iconPosition = "left", speakOnFocus, children, onClick, disabled, ...props }, ref) => {

    const handleFocus = () => {
      if (speakOnFocus && "speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(speakOnFocus);
        u.rate = 0.85; u.volume = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) return;
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={clsx(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        onClick={handleClick}
        onFocus={handleFocus}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={32} aria-hidden="true" />}
        {!isLoading && icon && iconPosition === "left" && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        <span className={isLoading ? "opacity-0 absolute" : "relative z-10"}>
          {isLoading ? loadingText : children}
        </span>
        {isLoading && <span className="absolute">{loadingText}</span>}
        {!isLoading && icon && iconPosition === "right" && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
