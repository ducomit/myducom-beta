import React from "react";
import { cn } from "../../lib/utils";

export function ShadCard({ className = "", children }) {
  return <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function ShadCardHeader({ className = "", children }) {
  return <div className={cn("border-b border-slate-100 px-4 py-3", className)}>{children}</div>;
}

export function ShadCardContent({ className = "", children }) {
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}
