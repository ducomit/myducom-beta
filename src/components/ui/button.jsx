import React from "react";
import { cn } from "../../lib/utils";

export function ShadButton({ className = "", variant = "default", children, ...props }) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
  };

  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
