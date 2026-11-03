// 生成物・編集不可: pnpm registry:generate が src/features/save/domain.json から生成する
// client に出す表示用の写し(秘密・内部の項目は持たない)。詳細: src/lib/domain/README.md

import type { DomainDisplay } from "@/lib/domain/types/display";

export const domainDisplay = {
  "singular": "save",
  "plural": "saves",
  "label": "セーブデータ",
  "fields": [
    {
      "name": "scenario_id",
      "label": "シナリオID",
      "fieldType": "string",
      "formInput": "textInput"
    },
    {
      "name": "slot_number",
      "label": "スロット番号",
      "fieldType": "integer",
      "formInput": "numberInput"
    },
    {
      "name": "playhead",
      "label": "再生位置",
      "fieldType": "jsonb",
      "formInput": "hidden"
    },
    {
      "name": "play_state",
      "label": "プレイ状態",
      "fieldType": "jsonb",
      "formInput": "hidden"
    },
    {
      "name": "thumbnail",
      "label": "サムネイル（base64）",
      "fieldType": "string",
      "formInput": "hidden"
    },
    {
      "name": "play_time",
      "label": "プレイ時間（秒）",
      "fieldType": "integer",
      "formInput": "numberInput"
    }
  ],
  "relations": [
    {
      "domain": "user",
      "label": "ユーザー",
      "fieldName": "user_id",
      "fieldType": "uuid",
      "relationType": "belongsTo",
      "required": true
    }
  ],
  "searchFields": [
    "scenario_id"
  ],
  "useCreatedAt": true,
  "useUpdatedAt": true,
  "useSoftDelete": false
} as const satisfies DomainDisplay;
