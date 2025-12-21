// src/app/api/auth/pre-register/route.ts

import { createApiRoute } from "@/lib/routeFactory";
import { preRegister } from "@/features/core/auth/services/server/preRegistration";

export const POST = createApiRoute(
  {
    operation: "POST /api/auth/pre-register",
    operationType: "write",
    skipForDemo: true,
  },
  async (req) => {
    const body = await req.json();
    const { user } = await preRegister(body);
    return { user };
  },
);
