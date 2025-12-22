// src/features/foo/hooks/useFooList.ts

"use client";

import { useDomainList } from "@/lib/crud/hooks";
import { fooClient } from "../services/client/fooClient";
import type { Foo } from "../entities";
import type { SWRConfiguration } from "swr";

export const useFooList = (config?: SWRConfiguration) =>
  useDomainList<Foo>("foo", fooClient.getAll, config);
