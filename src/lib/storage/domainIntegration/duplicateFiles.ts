// src/lib/storage/domainIntegration/duplicateFiles.ts

import { copyFileServer, getPathFromStorageUrl } from "@/lib/firebase/server/storage";
import { uuidv7 } from "uuidv7";

/**
 * レコードのストレージファイルを複製し、新しいURLのマップを返す
 *
 * @param record - 元のレコード
 * @param storageFields - ストレージフィールド名の配列
 * @returns フィールド名と新しいURLのマップ
 */
export async function duplicateStorageFiles(
  record: Record<string, unknown>,
  storageFields: string[]
): Promise<Record<string, string>> {
  const newUrls: Record<string, string> = {};

  const copyPromises = storageFields.map(async (field) => {
    const url = record[field];
    if (typeof url !== "string" || url === "") {
      return;
    }

    const sourcePath = getPathFromStorageUrl(url);
    if (!sourcePath) {
      return;
    }

    // 元のパスからディレクトリ部分と拡張子を取得
    const lastSlash = sourcePath.lastIndexOf("/");
    const basePath = lastSlash >= 0 ? sourcePath.substring(0, lastSlash) : "";
    const fileName = lastSlash >= 0 ? sourcePath.substring(lastSlash + 1) : sourcePath;
    const ext = fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";

    // 新しいパスを生成
    const destPath = basePath ? `${basePath}/${uuidv7()}${ext}` : `${uuidv7()}${ext}`;

    try {
      const newUrl = await copyFileServer(sourcePath, destPath);
      newUrls[field] = newUrl;
    } catch {
      // コピー失敗時は元のURLを維持しない（新レコードなので空にする）
    }
  });

  await Promise.all(copyPromises);

  return newUrls;
}
