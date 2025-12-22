// src/proxies/featureGate.ts

import { NextResponse } from "next/server";
import { APP_FEATURES } from "@/config/app-features.config";
import type { ProxyHandler } from "./types";

/**
 * 機能フラグに基づいてルートをブロックするProxy
 * 無効な機能のパスにアクセスした場合は404を返す
 */
export const featureGateProxy: ProxyHandler = (request) => {
  const pathname = request.nextUrl.pathname;

  // ドメインロック: wallet
  if (pathname.startsWith("/wallet") && APP_FEATURES.domainLocks.wallet) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // ドメインロック: 他のドメインはここに追加
  // if (pathname.startsWith("/shop") && APP_FEATURES.domainLocks.shop) {
  //   return NextResponse.rewrite(new URL("/404", request.url));
  // }
};
