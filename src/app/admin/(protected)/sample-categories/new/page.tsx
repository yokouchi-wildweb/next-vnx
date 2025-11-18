export const dynamic = "force-dynamic";

import AdminSampleCategoryCreate from "@/features/sampleCategory/components/AdminSampleCategoryCreate";
import PageTitle from "../../../../../components/Admin/Elements/PageTitle";
import { Main } from "@/components/TextBlocks";


export const metadata = {
  title: "サンプルカテゴリ追加",
};

export default function AdminSampleCategoryCreatePage() {

  return (

    <Main containerType="plain">
      <PageTitle>サンプルカテゴリ追加</PageTitle>
      <AdminSampleCategoryCreate redirectPath="/admin/sample-categories" />
    </Main>

  );
}
