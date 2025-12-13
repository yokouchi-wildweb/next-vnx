// src/features/setting/components/common/EditSettingForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingUpdateSchema } from "@/features/core/setting/entities/schema";
import { SettingUpdateFields } from "@/features/core/setting/entities/form";
import type { Setting } from "@/features/core/setting/entities";
import { useUpdateSetting } from "@/features/core/setting/hooks/useUpdateSetting";
import { SettingForm } from "./SettingForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoadingToast } from "@/hooks/useLoadingToast";
import { err } from "@/lib/errors";

type Props = {
  setting: Setting;
  redirectPath?: string;
};

export default function EditSettingForm({ setting, redirectPath = "/" }: Props) {
  const methods = useForm<SettingUpdateFields>({
    resolver: zodResolver(SettingUpdateSchema),
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      adminHeaderLogoImageUrl: setting.adminHeaderLogoImageUrl ?? "",
      adminHeaderLogoImageDarkUrl: setting.adminHeaderLogoImageDarkUrl ?? "",
      adminListPerPage: setting.adminListPerPage ?? 100,
      adminFooterText: setting.adminFooterText ?? "",
    },
  });

  const router = useRouter();
  const { showLoadingToast, hideLoadingToast } = useLoadingToast();
  const { trigger, isMutating } = useUpdateSetting();

  const submit = async (data: SettingUpdateFields) => {
    showLoadingToast("更新中です…");
    try {
      await trigger({ id: setting.id, data });
      toast.success("設定を更新しました");
      router.push(redirectPath);
    } catch (error) {
      hideLoadingToast();
      toast.error(err(error, "更新に失敗しました"));
    }
  };

  return (
    <SettingForm
      methods={methods}
      onSubmitAction={submit}
      isMutating={isMutating}
      submitLabel="更新"
      processingLabel="処理中..."
    />
  );
}
