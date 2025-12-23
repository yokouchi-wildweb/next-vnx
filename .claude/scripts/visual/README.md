# 視覚的並列実行スクリプト（tmux版）

tmuxを使用して、複数のClaude Codeエージェントを別々のペインで視覚的に並列実行するスクリプト集です。

## 動作要件

| 要件 | 詳細 |
|-----|------|
| tmux | 必須（インストールされていない場合はエラー） |
| claude CLI | Claude Codeがインストール済みであること |
| ターミナル | tmuxが動作するターミナル |

### 対応環境

| 環境 | 対応 | 備考 |
|-----|------|------|
| macOS | ✅ | `brew install tmux` |
| Linux | ✅ | `apt install tmux` |
| WSL | ✅ | `apt install tmux` |
| Windows (ネイティブ) | ❌ | tmux非対応 |

## スクリプト一覧

### 1. expert-panel-tmux.sh

4人の専門家が並列で分析（4分割ペイン）

```bash
.claude/scripts/visual/expert-panel-tmux.sh "分析対象のテーマ"
```

**例:**
```bash
.claude/scripts/visual/expert-panel-tmux.sh "新しい認証フローの実装方針"
```

**レイアウト:**
```
┌─────────────────┬─────────────────┐
│ 🔐 セキュリティ  │ 🔧 保守性        │
├─────────────────┼─────────────────┤
│ ⚡ パフォーマンス │ 🏗️ アーキテクチャ │
└─────────────────┴─────────────────┘
```

---

### 2. second-opinion-tmux.sh

複数の回答者が独立して検討（2〜5分割ペイン）

```bash
.claude/scripts/visual/second-opinion-tmux.sh <回数:2-5> "検討テーマ"
```

**例:**
```bash
.claude/scripts/visual/second-opinion-tmux.sh 3 "状態管理をReduxかZustandか"
```

**レイアウト（3名の場合）:**
```
┌─────────────────┬─────────────────┐
│ 👤 回答者 A     │                 │
├─────────────────┤ 👤 回答者 C     │
│ 👤 回答者 B     │                 │
└─────────────────┴─────────────────┘
```

---

### 3. brainstorm-tmux.sh

5チームが並列でアイデア出し（5分割ペイン）

```bash
.claude/scripts/visual/brainstorm-tmux.sh <アイデア数:10-30> "テーマ"
```

**例:**
```bash
.claude/scripts/visual/brainstorm-tmux.sh 20 "ユーザー体験改善のアイデア"
```

**レイアウト:**
```
┌─────────────────┬─────────────────┐
│ 🔧 改善・最適化  │ 👤 UX・体験     │
├─────────────────┼─────────────────┤
│ 🚀 革新・新規    │ ⚙️ 技術チャレンジ │
├─────────────────┤                 │
│ ✨ シンプル     │                 │
└─────────────────┴─────────────────┘
```

---

## tmux操作方法

| 操作 | キー |
|-----|------|
| ペイン間移動 | `Ctrl+B` → 矢印キー |
| ペインを最大化/復元 | `Ctrl+B` → `z` |
| セッション終了 | `Ctrl+B` → `:kill-session` |
| デタッチ（バックグラウンド化） | `Ctrl+B` → `d` |
| 再アタッチ | `tmux attach -t セッション名` |

**注意:** tmuxユーザーは `Ctrl+B` を2回押す必要がある場合があります（prefix keyの競合）

---

## tmuxが使えない場合

Claude Code内のスラッシュコマンドを使用してください:

```
/expert-panel 認証フローの実装方針
/second-opinion 3 状態管理の選択
/brainstorm 20 UX改善アイデア
```

これらはバックグラウンドで並列実行され、結果が統合されて表示されます。

---

## トラブルシューティング

### tmuxがインストールされていない

```bash
# macOS
brew install tmux

# Ubuntu/Debian/WSL
sudo apt update && sudo apt install tmux

# CentOS/RHEL
sudo yum install tmux
```

### セッションが残っている

```bash
# 全セッション確認
tmux list-sessions

# 特定セッション削除
tmux kill-session -t セッション名

# 全セッション削除
tmux kill-server
```

### ペインが小さすぎる

ターミナルウィンドウを大きくするか、`Ctrl+B` → `z` で個別ペインを最大化してください。
