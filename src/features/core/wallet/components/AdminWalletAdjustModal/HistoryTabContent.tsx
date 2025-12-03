// src/features/core/wallet/components/AdminWalletAdjustModal/HistoryTabContent.tsx

"use client";

import { useCallback, useMemo, useState } from "react";

import { Block } from "@/components/Layout/Block";
import { Para } from "@/components/TextBlocks/Para";
import DataTable, { type DataTableColumn } from "@/lib/tableSuite/DataTable";
import { useInfiniteScrollQuery } from "@/hooks/useInfiniteScrollQuery";
import type { WalletHistory } from "@/features/core/walletHistory/entities";
import {
  WalletHistoryChangeMethodOptions,
  WalletHistorySourceTypeOptions,
  WalletHistoryTypeOptions,
} from "@/features/core/walletHistory/constants/field";
import { walletHistoryClient } from "@/features/core/walletHistory/services/client/walletHistoryClient";

type WalletHistoryTabContentProps = {
  userId: string;
};

const HISTORY_PAGE_SIZE = 20;

const typeLabelMap = new Map(WalletHistoryTypeOptions.map((option) => [option.value, option.label]));
const methodLabelMap = new Map(
  WalletHistoryChangeMethodOptions.map((option) => [option.value, option.label]),
);
const sourceLabelMap = new Map(
  WalletHistorySourceTypeOptions.map((option) => [option.value, option.label]),
);

export function WalletHistoryTabContent({ userId }: WalletHistoryTabContentProps) {
  const fetcher = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      if (!walletHistoryClient.search) {
        throw new Error("ウォレット履歴の検索クライアントが未定義です");
      }
      return walletHistoryClient.search({
        page,
        limit,
        orderBy: [["createdAt", "DESC"]],
        where: { field: "user_id", op: "eq", value: userId },
      });
    },
    [userId],
  );

  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const handleScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    setScrollContainer(node);
  }, []);
  const observerOptions = useMemo<IntersectionObserverInit | undefined>(() => {
    if (!scrollContainer) {
      return undefined;
    }
    return {
      root: scrollContainer,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0.1,
    };
  }, [scrollContainer]);

  const { items: histories, total, isLoading, error, hasMore, sentinelRef } = useInfiniteScrollQuery({
    fetcher,
    limit: HISTORY_PAGE_SIZE,
    deps: [userId],
    observerOptions,
  });
  const handleBottomSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      sentinelRef(node);
    },
    [sentinelRef],
  );

  const columns: DataTableColumn<WalletHistory>[] = [
    {
      header: "日時",
      render: (history) => formatDate(history.createdAt),
    },
    {
      header: "ウォレット",
      render: (history) => typeLabelMap.get(history.type) ?? history.type,
    },
    {
      header: "操作",
      render: (history) => (
        <div className="flex flex-col gap-0.5">
          <span>{methodLabelMap.get(history.change_method) ?? history.change_method}</span>
          <span className="text-xs text-muted-foreground">{formatDelta(history)}</span>
        </div>
      ),
    },
    {
      header: "残高遷移",
      render: (history) => (
        <span className="text-sm font-medium">
          {formatNumber(history.balance_before)} →{" "}
          <span className={formatBalanceClass(history.change_method)}>
            {formatNumber(history.balance_after)}
          </span>
        </span>
      ),
    },
    {
      header: "操作種別",
      render: (history) => sourceLabelMap.get(history.source_type) ?? history.source_type,
    },
    {
      header: "理由",
      render: (history) => (
        <div className="flex flex-col gap-0.5">
          <span>{history.reason ?? ""}</span>
          {history.request_batch_id ? (
            <span className="text-[11px] text-muted-foreground">Batch: {history.request_batch_id}</span>
          ) : null}
        </div>
      ),
    },
  ];

  const hasHistories = histories.length > 0;
  const errorMessage = error ? "履歴の取得に失敗しました" : null;

  return (
    <Block space="md" padding="md">
      <Para size="xs" tone="muted">
        {total ? `合計 ${total} 件` : "履歴 0 件"}
      </Para>
      {errorMessage ? (
        <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-destructive/40 bg-destructive/5">
          <Para tone="destructive">{errorMessage}</Para>
        </div>
      ) : isLoading && !hasHistories ? (
        <div className="flex min-h-[160px] items-center justify-center">
          <Para tone="muted">履歴を読込中...</Para>
        </div>
      ) : hasHistories ? (
        <>
          <DataTable
            items={histories}
            columns={columns}
            className="rounded-lg border border-border bg-card"
            maxHeight="none"
            getKey={(item) => item.id}
            emptyValueFallback="-"
            scrollContainerRef={handleScrollContainerRef}
            bottomSentinelRef={handleBottomSentinelRef}
          />
          <div className="mt-2 flex items-center justify-center">
            {isLoading ? (
              <Para tone="muted" size="xs">
                追加の履歴を読込中...
              </Para>
            ) : hasMore ? (
              <Para tone="muted" size="xs">
                下までスクロールすると自動で読み込みます
              </Para>
            ) : (
              <Para tone="muted" size="xs">
                すべて読み込み済み
              </Para>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-border py-6">
          <Para tone="muted">履歴はまだありません</Para>
        </div>
      )}
    </Block>
  );
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "-";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatNumber(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "-";
  }
  return value.toLocaleString();
}

function formatDelta(history: WalletHistory) {
  if (history.change_method === "SET") {
    return `残高を ${formatNumber(history.balance_after)} に設定`;
  }
  const sign = history.change_method === "DECREMENT" ? "-" : "+";
  return `${sign}${formatNumber(history.points_delta)} pt`;
}

function formatBalanceClass(changeMethod: WalletHistory["change_method"]) {
  if (changeMethod === "SET") {
    return "text-blue-600";
  }
  if (changeMethod === "DECREMENT") {
    return "text-red-600";
  }
  return "text-emerald-600";
}
