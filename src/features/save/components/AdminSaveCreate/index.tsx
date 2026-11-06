// src/features/save/components/AdminSaveCreate/index.tsx

import { Suspense } from "react";
import CreateSaveForm from "../common/CreateSaveForm";
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";

export type AdminSaveCreateProps = {
  redirectPath?: string;
};

export default function AdminSaveCreate({ redirectPath }: AdminSaveCreateProps) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateSaveForm redirectPath={redirectPath} />
    </Suspense>
  );
}
