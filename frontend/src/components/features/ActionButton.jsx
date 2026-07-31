"use client";

import { Button } from "@/components/ui/button";

export function ActionButton({
  children,
  onClick,
  variant = "default",
  className = "",
  ...props
}) {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}
