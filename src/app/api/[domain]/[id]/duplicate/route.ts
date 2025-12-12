// src/app/api/[domain]/[id]/duplicate/route.ts
import type { NextRequest } from "next/server";

import { withDomainService } from "../../utils/withDomainService";
import type { DomainIdParams } from "@/types/params";

// POST /api/[domain]/[id]/duplicate : 指定IDのデータを複製
export async function POST(_: NextRequest, { params }: DomainIdParams) {
  return withDomainService(
    params,
    (service, { params: resolvedParams }) => service.duplicate(resolvedParams.id),
    {
      supports: "duplicate",
      operation: "POST /api/[domain]/[id]/duplicate",
    },
  );
}
