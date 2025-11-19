// src/components/Feedback/Skeleton/ImageUploaderSkeleton.tsx

import { BaseSkeleton } from "./BaseSkeleton";
import { cn } from "@/lib/cn";

type ImageUploaderSkeletonProps = {
  className?: string;
};

export function ImageUploaderSkeleton({
  className,
}: ImageUploaderSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-2", className)}
    >
      <BaseSkeleton className="h-full w-full" />
    </div>
  );
}
