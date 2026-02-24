import React from "react";
import { cn } from "../../lib/utils";

export function ShadInput({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        className
      )}
      {...props}
    />
  );
}
