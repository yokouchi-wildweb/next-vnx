import type { ProxyHandler } from './types';
import { demoModeProxy } from './demoMode';
import { featureGateProxy } from './featureGate';
import { maintenanceProxy } from './maintenance';
import { redirectProxy } from './redirect';

export const proxyHandlers: ProxyHandler[] = [
  maintenanceProxy,  // メンテナンスモードを最優先で実行
  demoModeProxy,     // デモモード（メンテナンスの次に優先）
  featureGateProxy,
  redirectProxy,
];

export type { ProxyHandler } from './types';
