// src/features/foo/hooks/useDeleteFoo.ts

"use client";

import { useDeleteDomain } from "@/lib/crud/hooks";
import { fooClient } from "../services/client/fooClient";

export const useDeleteFoo = () => useDeleteDomain("foo/delete", fooClient.delete, "foo");
