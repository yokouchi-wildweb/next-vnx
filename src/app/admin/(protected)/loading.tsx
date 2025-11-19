// src/app/admin/loading.tsx

import { ScreenLoader } from "@/components/Overlays/Loading/ScreenLoader";

export default function AdminLoading() {
  return (
    <ScreenLoader
      mode="fullscreen"
      className="bg-muted"
      spinnerClassName="h-12 w-12 text-primary"
    />
  );
}
