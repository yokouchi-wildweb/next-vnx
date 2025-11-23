// src/app/api/[domain]/bulk/delete-by-query/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { WhereExpr } from "@/lib/crud";
import { withDomainService } from "@/app/api/[domain]/utils/withDomainService";
import type { DomainParams } from "@/types/params";

class BadRequestError extends Error {}

// POST /api/[domain]/bulk/delete-by-query : クエリ条件で一括削除
export async function POST(req: NextRequest, { params }: DomainParams) {
  return withDomainService(
    params,
    async (service) => {
      const body = await req.json();
      const where = body?.where as WhereExpr | undefined;
      if (!where) {
        throw new BadRequestError("where パラメータは必須です");
      }

      await service.bulkDeleteByQuery(where);
      return { success: true };
    },
    {
      operation: "POST /api/[domain]/bulk/delete-by-query",
      supports: "bulkDeleteByQuery",
      onBadRequest: (error) => {
        if (error instanceof BadRequestError) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      },
    },
  );
}
