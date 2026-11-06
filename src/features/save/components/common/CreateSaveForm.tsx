// src/features/save/components/common/CreateSaveForm.tsx

"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveCreateSchema } from "@/features/save/entities/schema";
import { SaveCreateFields } from "@/features/save/entities/form";
import { useCreateSave } from "@/features/save/hooks/useCreateSave";
import { SaveForm } from "./SaveForm";
import { useRouter } from "next/navigation";
import { useToast, useLoadingToast } from "@/lib/toast";
import { err } from "@/lib/errors";
import { buildFormDefaultValues } from "@/components/Form/FieldRenderer";
import { domainDisplay } from "@/features/save/entities/display";

type Props = {
  redirectPath?: string;
};

export default function CreateSaveForm({ redirectPath = "/" }: Props) {
  const methods = useForm<SaveCreateFields>({
    resolver: zodResolver(SaveCreateSchema) as Resolver<SaveCreateFields>,
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: buildFormDefaultValues(domainDisplay) as SaveCreateFields,
  });

  const router = useRouter();
  const { showToast } = useToast();
  const { trigger, isMutating } = useCreateSave();
  useLoadingToast(isMutating, "登録中です…");

  const submit = async (data: SaveCreateFields) => {
    try {
      await trigger(data);
      showToast("登録しました", "success");
      router.push(redirectPath);
    } catch (error) {
      showToast(err(error, "登録に失敗しました"), "error");
    }
  };

  return (
    <SaveForm
      methods={methods}
      onSubmitAction={submit}
      isMutating={isMutating}
      submitLabel="登録"
      onCancel={() => router.push(redirectPath)}
    />
  );
}
