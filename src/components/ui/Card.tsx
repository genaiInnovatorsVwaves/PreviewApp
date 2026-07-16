import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("vw-card-section flex flex-col gap-6", className)}>{children}</div>;
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid auto-rows-min grid-rows-[auto_auto] items-start gap-2", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("vw-card-title flex items-center gap-2 leading-none", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}
