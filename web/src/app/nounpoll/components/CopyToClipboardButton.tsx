"use client";
import { Button } from "@/components/ui/button";
import { ComponentType, HTMLAttributes, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function CopyToClipboardButton({
  copyText,
  children,
  ...props
}: { copyText: string; children: ReactNode } & HTMLAttributes<HTMLButtonElement>) {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(copyText);
        toast({
          title: "Copied to clipboard!",
        });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
