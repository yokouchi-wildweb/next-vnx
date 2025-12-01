"use client";

import { useCallback } from "react";

import type {
  SelectedMediaMetadata,
  MediaOrientation,
  VideoMetadata,
  ImageMetadata,
} from "../types";

export type MediaMetadataActions = Partial<{
  sizeBytes: (value: number | null) => void;
  width: (value: number | null) => void;
  height: (value: number | null) => void;
  aspectRatio: (value: number | null) => void;
  orientation: (value: MediaOrientation | null) => void;
  mimeType: (value: string | null) => void;
  src: (value: string | null) => void;
  durationSec: (value: number | null) => void;
  durationFormatted: (value: string | null) => void;
}>;

export type UseMediaMetadataActionsOptions = {
  actions: MediaMetadataActions;
};

const isVideoMetadata = (
  metadata: ImageMetadata | VideoMetadata,
): metadata is VideoMetadata =>
  "durationSec" in metadata &&
  typeof (metadata as VideoMetadata).durationSec === "number" &&
  "durationFormatted" in metadata;

type HandlerArg<K extends keyof MediaMetadataActions> =
  MediaMetadataActions[K] extends ((arg: infer A) => void) | undefined ? A : never;

export const useMediaMetadataActions = ({ actions }: UseMediaMetadataActionsOptions) => {
  return useCallback(
    (metadata: SelectedMediaMetadata) => {
      const target = metadata.video ?? metadata.image;

      const invoke = <K extends keyof MediaMetadataActions>(key: K, value: HandlerArg<K>) => {
        const handler = actions[key];
        if (handler) {
          (handler as (arg: HandlerArg<K>) => void)(value);
        }
      };

      if (!target) {
        invoke("sizeBytes", null);
        invoke("width", null);
        invoke("height", null);
        invoke("aspectRatio", null);
        invoke("orientation", null);
        invoke("mimeType", null);
        invoke("src", null);
        invoke("durationSec", null);
        invoke("durationFormatted", null);
        return;
      }

      const safeNumber = (value?: number | null) =>
        typeof value === "number" ? value : null;

      invoke("sizeBytes", safeNumber(target.sizeBytes));
      invoke("width", safeNumber(target.width));
      invoke("height", safeNumber(target.height));
      invoke("aspectRatio", safeNumber(target.aspectRatio));
      invoke("orientation", target.orientation ?? null);
      invoke("mimeType", target.mimeType ?? null);
      invoke("src", target.src ?? null);

      if (isVideoMetadata(target)) {
        invoke("durationSec", safeNumber(target.durationSec));
        invoke("durationFormatted", target.durationFormatted ?? null);
      } else {
        invoke("durationSec", null);
        invoke("durationFormatted", null);
      }
    },
    [actions],
  );
};
