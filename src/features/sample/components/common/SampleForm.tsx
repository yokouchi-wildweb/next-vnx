// src/features/undefined/components/common/SampleForm.tsx

"use client";

import { AppForm } from "@/components/Form/AppForm";
import { Button } from "@/components/Form/Button/Button";
import { SampleFields, type SampleFieldsProps } from "./SampleFields";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useCallback, useRef, useState } from "react";
import { usePendingMediaUploads, usePendingMediaDeletion } from "@/lib/mediaInputSuite";

export type SampleFormProps<TFieldValues extends FieldValues> =
  Omit<SampleFieldsProps<TFieldValues>, 'control'> & {
    methods: UseFormReturn<TFieldValues>;
    onSubmitAction: (data: TFieldValues) => Promise<void>;
    isMutating?: boolean;
    submitLabel: string;
    processingLabel: string;
    onCancel?: () => void;
  };

export function SampleForm<TFieldValues extends FieldValues>({
  methods,
  onSubmitAction,
  isMutating = false,
  submitLabel,
  processingLabel,
  onCancel,
  ...fieldsProps
}: SampleFormProps<TFieldValues>) {
  const {
    control,
    formState: { isSubmitting },
  } = methods;

  const loading = isSubmitting || isMutating;
  const [isUploading, setUploading] = useState(false);
  const disabled = loading || isUploading;
  const originalUrlRef = useRef(fieldsProps.defaultMainImageUrl ?? null);
  const {
    register: registerPendingUpload,
    commit: commitPendingUpload,
    cleanup: cleanupPendingUploads,
  } = usePendingMediaUploads({ cleanupOnUnmount: true });
  const { markDelete, commit: commitDeletion, revert: revertDeletion } = usePendingMediaDeletion();

  const handleMediaUrlChange = useCallback(
    (url: string | null) => {
      if (!url) {
        revertDeletion();
        return;
      }
      if (url === originalUrlRef.current) {
        commitPendingUpload(url);
        return;
      }
      registerPendingUpload(url);
    },
    [commitPendingUpload, registerPendingUpload, revertDeletion],
  );

  const handleSubmit = useCallback(
    async (data: TFieldValues) => {
      await onSubmitAction(data);
      const currentUrl = (data as { [key: string]: unknown })["main_image"] as string | null;
      commitPendingUpload(currentUrl ?? null);
      await commitDeletion();
      originalUrlRef.current = currentUrl ?? null;
    },
    [commitDeletion, commitPendingUpload, onSubmitAction],
  );

  const handleCancelClick = useCallback(() => {
    void cleanupPendingUploads();
    revertDeletion();
    methods.setValue("main_image" as keyof TFieldValues, originalUrlRef.current as any);
    onCancel?.();
  }, [cleanupPendingUploads, methods, onCancel, revertDeletion]);

  return (
    <AppForm
      methods={methods}
      onSubmit={handleSubmit}
      pending={disabled}
      fieldSpace="md"
    >
      <SampleFields<TFieldValues>
        {...fieldsProps}
        control={control}
        onUploadingChange={setUploading}
        onUrlChange={handleMediaUrlChange}
        onRegisterPendingDelete={markDelete}
      />
      <div className="flex justify-center gap-3">
        <Button type="submit" disabled={disabled} variant="default">
          {disabled ? processingLabel : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={handleCancelClick}>
            キャンセル
          </Button>
        ) : null}
      </div>
    </AppForm>
  );
}
