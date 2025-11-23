// src/app/api/[domain]/bulk/delete-by-ids/route.ts
import type { NextRequest } from "next/server";

import { withDomainService } from "@/app/api/[domain]/utils/withDomainService";
import type { DomainParams } from "@/types/params";

// POST /api/[domain]/bulk/delete-by-ids : ID指定の複数削除
export async function POST(req: NextRequest, { params }: DomainParams) {
  return withDomainService(
    params,
    async (service) => {
      const { ids } = await req.json();
      await service.bulkDeleteByIds(ids);
      return { success: true };
    },
    {
      operation: "POST /api/[domain]/bulk/delete-by-ids",
      supports: "bulkDeleteByIds",
    },
  );
}
