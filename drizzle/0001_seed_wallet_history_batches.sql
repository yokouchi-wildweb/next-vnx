-- ダミーのポイント操作履歴（バッチ単位）を追加するマイグレーション
-- 増加のみのバッチ + 減少のみのバッチ

INSERT INTO wallet_histories (
  id,
  user_id,
  type,
  change_method,
  points_delta,
  balance_before,
  balance_after,
  source_type,
  request_batch_id,
  reason,
  meta,
  created_at
)
VALUES
  -- 増加バッチ（batch_gain_20251203）
  ('989b24a0-9b64-4ae4-9c61-ef1e13d4f1c0', '467e2241-0a90-4f4f-9c9c-3fb66c224305', 'regular_point', 'INCREMENT', 500, 1000, 1500, 'admin_action', 'c8b41230-9fb3-4c4f-ba3c-8c2e377ed001', '年末キャンペーン付与', jsonb_build_object('adminId', '5f6edd90-b810-4e67-bbe8-304122ed6f76'), '2025-12-03T18:55:00Z'),
  ('be3f3218-c058-4faf-a5a3-2c4dc1bdf4c7', '467e2241-0a90-4f4f-9c9c-3fb66c224305', 'regular_point', 'INCREMENT', 300, 1500, 1800, 'admin_action', 'c8b41230-9fb3-4c4f-ba3c-8c2e377ed001', '年末キャンペーン付与', jsonb_build_object('adminId', '5f6edd90-b810-4e67-bbe8-304122ed6f76'), '2025-12-03T18:56:10Z'),
  ('4d3d72bc-4bd6-4b32-9af0-0f665114a88b', '467e2241-0a90-4f4f-9c9c-3fb66c224305', 'regular_point', 'INCREMENT', 200, 1800, 2000, 'admin_action', 'c8b41230-9fb3-4c4f-ba3c-8c2e377ed001', '年末キャンペーン付与', jsonb_build_object('adminId', '5f6edd90-b810-4e67-bbe8-304122ed6f76'), '2025-12-03T18:57:25Z'),

  -- 減少バッチ（batch_spend_20251203）
  ('8b990b86-3d2d-471c-851d-55ed8f497a74', '467e2241-0a90-4f4f-9c9c-3fb66c224305', 'regular_point', 'DECREMENT', 400, 2000, 1600, 'admin_action', 'af1c6a36-52f5-4f6f-b4b2-8d2d7a01a002', '管理者調整: 誤付与分の回収', jsonb_build_object('adminId', '5f6edd90-b810-4e67-bbe8-304122ed6f76'), '2025-12-03T19:05:00Z'),
  ('0eef3ad0-74d7-4bb9-8b33-73182d2e8c53', '467e2241-0a90-4f4f-9c9c-3fb66c224305', 'regular_point', 'DECREMENT', 200, 1600, 1400, 'admin_action', 'af1c6a36-52f5-4f6f-b4b2-8d2d7a01a002', '管理者調整: 誤付与分の回収', jsonb_build_object('adminId', '5f6edd90-b810-4e67-bbe8-304122ed6f76'), '2025-12-03T19:06:12Z'),
  ('0beea00d-0229-43fb-a883-03d9a998cf11', '467e2241-0a90-4f4f-9c9c-3fb66c224305', 'regular_point', 'DECREMENT', 100, 1400, 1300, 'admin_action', 'af1c6a36-52f5-4f6f-b4b2-8d2d7a01a002', '管理者調整: 誤付与分の回収', jsonb_build_object('adminId', '5f6edd90-b810-4e67-bbe8-304122ed6f76'), '2025-12-03T19:07:45Z');
