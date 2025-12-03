// src/components/Overlays/Modal.tsx

"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Overlays/Dialog";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  children?: ReactNode;
  showCloseButton?: boolean;
  className?: string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
};

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true,
  className,
  maxWidth = 640,
  minHeight,
  maxHeight,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={className}
        maxWidth={maxWidth}
        minHeight={minHeight}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {maxHeight ? (
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {children}
          </div>
        ) : (
          children
        )}
      </DialogContent>
    </Dialog>
  );
}
