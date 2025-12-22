// src/features/foo/hooks/useUpdateFoo.ts

"use client";

import { useUpdateDomain } from "@/lib/crud/hooks";
import { fooClient } from "../services/client/fooClient";
import type { Foo } from "../entities";
import type { FooUpdateFields } from "../entities/form";

export const useUpdateFoo = () =>
  useUpdateDomain<Foo, FooUpdateFields>(
    "foo/update",
    fooClient.update,
    "foo",
  );
