// src/features/sample/hooks/useRestoreSample.ts

"use client";

import { useRestoreDomain } from "@/lib/crud/hooks";
import { sampleClient } from "../services/client/sampleClient";

export const useRestoreSample = () => useRestoreDomain("samples/restore", sampleClient.restore!, "samples");
