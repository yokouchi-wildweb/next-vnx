// src/proxies/demoMode.ts

import { NextResponse } from "next/server";

import { demoModeConfig } from "@/config/app/demo-mode.config";
import { resolveSessionUser } from "@/features/core/auth/services/server/session/token";
import { parseSessionCookie } from "@/lib/jwt";

import type { ProxyHandler } from "./types";

/**
 * 静的ファイルの拡張子パターン
 */
const STATIC_FILE_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf|eot|css|js|json|xml|txt|pdf|mp4|webm|mp3|wav)$/i;

/**
 * 静的ファイルかどうかを判定
 */
const isStaticFile = (pathname: string): boolean => {
  return STATIC_FILE_EXTENSIONS.test(pathname);
};

/**
 * パスが許可リストに含まれるかチェック
 */
const isAllowedPath = (pathname: string): boolean => {
  // 静的ファイルは常に許可
  if (isStaticFile(pathname)) {
    return true;
  }

  // 完全一致チェック
  if (demoModeConfig.allowedPaths.includes(pathname)) {
    return true;
  }

  // 前方一致チェック
  return demoModeConfig.allowedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
};

/**
 * デモモード用Proxy
 * - 有効時: デモユーザー以外のアクセスをデモページにリダイレクト
 * - 無効時: デモページへのアクセスを404にする
 */
export const demoModeProxy: ProxyHandler = async (request) => {
  const pathname = request.nextUrl.pathname;

  // デモモードが無効の場合、/demo（直下のみ）へのアクセスは404
  // /demo/form-components などのサブルートは許可
  if (!demoModeConfig.enabled) {
    if (pathname === '/demo') {
      return new NextResponse(null, { status: 404 });
    }
    return;
  }

  // 許可されたパスならスキップ
  if (isAllowedPath(pathname)) {
    return;
  }

  // セッションを取得してデモユーザーかチェック
  const token = parseSessionCookie(request.cookies);
  const sessionUser = token ? await resolveSessionUser(token) : null;

  // デモユーザーならスキップ
  if (sessionUser?.isDemo) {
    return;
  }

  // デモページにリダイレクト
  return NextResponse.redirect(new URL(demoModeConfig.redirectTo, request.url));
};
