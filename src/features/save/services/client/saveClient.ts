// src/features/save/services/client/saveClient.ts

import { createApiClient } from "@/lib/crud/apiClientFactory";
import type { ApiClient } from "@/lib/crud/types";
import type { Save } from "@/features/save/entities";
import type {
  SaveCreateFields,
  SaveUpdateFields,
} from "@/features/save/entities/form";

export const saveClient: ApiClient<
  Save,
  SaveCreateFields,
  SaveUpdateFields
> = createApiClient<
  Save,
  SaveCreateFields,
  SaveUpdateFields
>("/api/save");
