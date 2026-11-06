// src/features/save/components/AdminSaveEdit/index.tsx

import { Suspense } from "react";
import EditSaveForm from "../common/EditSaveForm";
import type { Save } from "@/features/save/entities";
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";

export type AdminSaveEditProps = {
  save: Save;
  redirectPath?: string;
};

export default function AdminSaveEdit({ save, redirectPath }: AdminSaveEditProps) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditSaveForm save={save} redirectPath={redirectPath} />
    </Suspense>
  );
}
