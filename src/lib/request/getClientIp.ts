// src/lib/request/getClientIp.ts

import { headers } from "next/headers";

/**
 * クライアントのIPアドレスを取得する。
 * Vercel、Cloudflare、一般的なプロキシに対応。
 *
 * @returns IPアドレス。取得できない場合はnull。
 */
export async function getClientIp(): Promise<string | null> {
  const headersList = await headers();

  // Vercel固有（最優先）
  const vercelForwardedFor = headersList.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  // Cloudflare固有
  const cfConnectingIp = headersList.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // 一般的なプロキシ（x-forwarded-for）
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    // カンマ区切りの最初のIPが元クライアント
    return forwardedFor.split(",")[0].trim();
  }

  // その他のプロキシ
  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return null;
}
