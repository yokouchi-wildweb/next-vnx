// src/app/api/auth/demo/login/route.ts

import { NextResponse } from "next/server";

import { createApiRoute } from "@/lib/routeFactory";
import { demoLogin } from "@/features/core/auth/services/server/demoLogin";
import { issueSessionCookie } from "@/features/core/auth/services/server/session/issueSessionCookie";

export const POST = createApiRoute(
  {
    operation: "POST /api/auth/demo/login",
    operationType: "write",
    skipForDemo: false,
  },
  async () => {
    const { user, session } = await demoLogin();

    const response = NextResponse.json({
      user,
      session: {
        expiresAt: session.expiresAt.toISOString(),
      },
    });

    issueSessionCookie({
      cookies: response.cookies,
      token: session.token,
      expiresAt: session.expiresAt,
      maxAge: session.maxAge,
    });

    return response;
  },
);
