// src/features/save/components/common/EditSaveForm.tsx

"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveUpdateSchema } from "@/features/save/entities/schema";
import type { SaveUpdateFields } from "@/features/save/entities/form";
import type { Save } from "@/features/save/entities";
import { useUpdateSave } from "@/features/save/hooks/useUpdateSave";
import { useSearchSave } from "@/features/save/hooks/useSearchSave";
import { SaveForm } from "./SaveForm";
import { useRouter } from "next/navigation";
import { useToast, useLoadingToast } from "@/lib/toast";
import { err } from "@/lib/errors";
import { buildFormDefaultValues } from "@/components/Form/FieldRenderer";
import { useItemNavigator } from "@/components/AppFrames/Admin/Elements/ItemNavigator";
import { getAdminPaths } from "@/lib/crud/utils/paths";
import { domainDisplay } from "@/features/save/entities/display";

const adminPaths = getAdminPaths(domainDisplay.plural);

type Props = {
  save: Save;
  redirectPath?: string;
};

export default function EditSaveForm({ save, redirectPath = "/" }: Props) {
  const methods = useForm<SaveUpdateFields>({
    resolver: zodResolver(SaveUpdateSchema) as Resolver<SaveUpdateFields>,
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: buildFormDefaultValues(domainDisplay, save) as SaveUpdateFields,
  });

  const router = useRouter();
  const { showToast } = useToast();
  const { trigger, isMutating } = useUpdateSave();
  const { data: items } = useSearchSave({ limit: 10 });

  const { navigator, isSwitching } = useItemNavigator({
    items,
    currentItem: save,
    getPath: adminPaths.edit,
    methods,
    updateTrigger: trigger,
    isMutating,
  });

  useLoadingToast(isMutating, isSwitching ? "アイテムを切り替え中" : "更新中です…");

  const submit = async (data: SaveUpdateFields) => {
    try {
      await trigger({ id: save.id, data });
      showToast("更新しました", "success");
      router.push(redirectPath);
    } catch (error) {
      showToast(err(error, "更新に失敗しました"), "error");
    }
  };

  return (
    <>
      {navigator}
      <SaveForm
        methods={methods}
        onSubmitAction={submit}
        isMutating={isMutating}
        submitLabel="更新"
        onCancel={() => router.push(redirectPath)}
      />
    </>
  );
}
