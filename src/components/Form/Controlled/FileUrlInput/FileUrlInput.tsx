// src/components/Form/FileUrlInput/FileUrlInput.tsx

import { Block } from "@/components/Layout/Block";
import { ScreenLoader } from "@/components/Overlays/Loading/ScreenLoader";

import { FileInput } from "../FileInput";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useFileUrlInput } from "./useFileUrlInput";
import type { Props } from "./types";
import type { FieldValues, FieldPath } from "react-hook-form";

export const FileUrlInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: Props<TFieldValues, TName>) => {
  const {
    field,
    onUpload,
    onDelete,
    initialUrl = null,
    onPendingChange,
    ...fileInputProps
  } = props;

  const {
    url,
    pending,
    open,
    dummyField,
    selectedFileName,
    handleSelect,
    requestDelete,
    handleOpenChange,
    confirmDelete,
  } = useFileUrlInput({
    field,
    onUpload,
    onDelete,
    initialUrl,
    onPendingChange,
  });

  return (
    <Block space="sm" className="w-full">
      <div className="relative">
        <FileInput
          {...fileInputProps}
          disabled={pending || fileInputProps.disabled}
          field={dummyField}
          initialUrl={url ?? undefined}
          onFileSelect={handleSelect}
          onRemove={requestDelete}
          selectedFileName={selectedFileName}
        />
        {pending ? (
          <ScreenLoader mode="fullscreen" message="画像を処理中..." />
        ) : null}
      </div>
      <input type="hidden" {...field} value={url ?? ""} />
      <DeleteConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        onConfirm={confirmDelete}
      />
    </Block>
  );
};
