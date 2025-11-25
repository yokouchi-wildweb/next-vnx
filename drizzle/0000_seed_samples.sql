-- drizzle/0000_seed_samples.sql

WITH upserted_categories AS (
    INSERT INTO sample_categories AS sc (id, name, description, created_at, updated_at)
    VALUES
      ('aaa11111-1111-1111-1111-111111111111', 'カテゴリA', '試作用カテゴリA', NOW(), NOW()),
      ('bbb22222-2222-2222-2222-222222222222', 'カテゴリB', '試作用カテゴリB', NOW(), NOW()),
      ('ccc33333-3333-3333-3333-333333333333', 'カテゴリC', '試作用カテゴリC', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = NOW()
    RETURNING id, name
),
seed AS (
    SELECT
      '11111111-1111-1111-1111-111111111111'::uuid AS id,
      (SELECT id FROM upserted_categories WHERE name = 'カテゴリA') AS sample_category_id,
      '季節限定ジャム'::text AS name,
      24::int AS number,
      48::int AS rich_number,
      NULL::boolean AS switch,
      NULL::boolean AS radio,
      'apple'::sample_select_enum AS select_value,
      ARRAY['apple', 'orange']::text[] AS multi_select_value,
      NULL::text AS main_image,
      '青森産りんごを使用した季節限定ジャム'::text AS description,
      '2024-04-11T09:15:00+09:00'::timestamptz AS created_at,
      '2024-06-21T09:30:00+09:00'::timestamptz AS updated_at
    UNION ALL
    SELECT
      '22222222-2222-2222-2222-222222222222',
      (SELECT id FROM upserted_categories WHERE name = 'カテゴリB'),
      'クラフトドリンク',
      120,
      180,
      NULL,
      NULL,
      'orange'::sample_select_enum,
      ARRAY['orange', 'cherry']::text[],
      NULL,
      'シトラスベースの微炭酸ドリンク',
      '2024-04-18T13:00:00+09:00',
      '2024-06-18T11:45:00+09:00'
    UNION ALL
    SELECT
      '33333333-3333-3333-3333-333333333333',
      (SELECT id FROM upserted_categories WHERE name = 'カテゴリC'),
      'フリーズドライベリー',
      45,
      60,
      NULL,
      NULL,
      'berry'::sample_select_enum,
      ARRAY['apple']::text[],
      NULL,
      'デザートトッピング向けベリー',
      '2024-04-25T08:30:00+09:00',
      '2024-06-15T15:20:00+09:00'
    UNION ALL
    SELECT
      '44444444-4444-4444-4444-444444444444',
      (SELECT id FROM upserted_categories WHERE name = 'カテゴリA'),
      'スパイスティーセット',
      80,
      100,
      NULL,
      NULL,
      'apple'::sample_select_enum,
      ARRAY[]::text[],
      NULL,
      'チャイ用ブレンドの飲み比べセット',
      '2024-05-02T10:00:00+09:00',
      '2024-06-10T14:10:00+09:00'
)
INSERT INTO samples AS s (
    id,
    sample_category_id,
    name,
    number,
    rich_number,
    switch,
    radio,
    "select",
    multi_select,
    main_image,
    description,
    created_at,
    updated_at
)
SELECT
    seed.id,
    seed.sample_category_id,
    seed.name,
    seed.number,
    seed.rich_number,
    seed.switch,
    seed.radio,
    seed.select_value,
    seed.multi_select_value,
    seed.main_image,
    seed.description,
    seed.created_at,
    seed.updated_at
FROM seed
ON CONFLICT (id) DO UPDATE SET
    sample_category_id = EXCLUDED.sample_category_id,
    name = EXCLUDED.name,
    number = EXCLUDED.number,
    rich_number = EXCLUDED.rich_number,
    switch = EXCLUDED.switch,
    radio = EXCLUDED.radio,
    "select" = EXCLUDED."select",
    multi_select = EXCLUDED.multi_select,
    main_image = EXCLUDED.main_image,
    description = EXCLUDED.description,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at;
