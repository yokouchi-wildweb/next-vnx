// src/app/api/webhook/payment/route.ts

import { NextResponse } from "next/server";

import { createApiRoute } from "@/lib/routeFactory";
import { purchaseRequestService } from "@/features/core/purchaseRequest/services/server/purchaseRequestService";
import { isDomainError } from "@/lib/errors";
import type { PaymentProviderName } from "@/features/core/purchaseRequest/services/server/payment";

export const POST = createApiRoute(
  {
    operation: "POST /api/webhook/payment",
    operationType: "write",
    skipForDemo: false,
  },
  async (req) => {
    const providerName = (req.nextUrl.searchParams.get("provider") ?? "dummy") as PaymentProviderName;

    try {
      const result = await purchaseRequestService.handleWebhook({
        request: req.clone(),
        providerName,
      });
      return result;
    } catch (error) {
      if (isDomainError(error)) {
        if (error.status === 404) {
          console.warn("Webhook received for unknown session");
          return NextResponse.json(
            { success: true, message: "セッションが見つかりませんでした。" },
            { status: 200 },
          );
        }
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      throw error;
    }
  },
);
