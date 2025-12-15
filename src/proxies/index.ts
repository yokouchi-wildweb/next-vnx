import type { ProxyHandler } from './types';
import { featureGateProxy } from './featureGate';
import { maintenanceProxy } from './maintenance';
import { redirectProxy } from './redirect';

export const proxyHandlers: ProxyHandler[] = [
  maintenanceProxy,  // メンテナンスモードを最優先で実行
  featureGateProxy,
  redirectProxy,
];

export type { ProxyHandler } from './types';
