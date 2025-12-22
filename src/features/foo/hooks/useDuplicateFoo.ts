// src/features/foo/hooks/useDuplicateFoo.ts

"use client";

import { useDuplicateDomain } from "@/lib/crud/hooks";
import { fooClient } from "../services/client/fooClient";

export const useDuplicateFoo = () => useDuplicateDomain("foo/duplicate", fooClient.duplicate!, "foo");
