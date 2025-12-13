// src/features/sample/hooks/useHardDeleteSample.ts

"use client";

import { useHardDeleteDomain } from "@/lib/crud/hooks";
import { sampleClient } from "../services/client/sampleClient";

export const useHardDeleteSample = () => useHardDeleteDomain("samples/hard-delete", sampleClient.hardDelete!, "samples");
