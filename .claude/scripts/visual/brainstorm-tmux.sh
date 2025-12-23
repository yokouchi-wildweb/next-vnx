#!/bin/bash
# =============================================================================
# brainstorm-tmux.sh
# ブレインストーミングを5分割ペインで視覚的に実行
# =============================================================================

set -e

# 引数チェック
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "使用方法: $0 <アイデア数:10-30> \"テーマ\""
    echo "例: $0 20 \"ユーザー体験改善のアイデア\""
    exit 1
fi

IDEA_COUNT="$1"
TOPIC="$2"
SESSION_NAME="brainstorm-$(date +%s)"

# アイデア数の検証
if [ "$IDEA_COUNT" -lt 10 ] || [ "$IDEA_COUNT" -gt 30 ]; then
    echo "エラー: アイデア数は10〜30の範囲で指定してください"
    exit 1
fi

# 各チームの担当数を計算
PER_TEAM=$((IDEA_COUNT / 5))

# tmuxの存在確認
if ! command -v tmux &> /dev/null; then
    echo "エラー: tmuxがインストールされていません"
    echo ""
    echo "インストール方法:"
    echo "  macOS:  brew install tmux"
    echo "  Ubuntu: sudo apt install tmux"
    echo "  WSL:    sudo apt install tmux"
    echo ""
    echo "代替: Claude Code内で /brainstorm コマンドを使用してください"
    exit 1
fi

# セッション作成
tmux new-session -d -s "$SESSION_NAME" -x 200 -y 50

# 5分割レイアウト
tmux split-window -h -t "$SESSION_NAME"
tmux split-window -v -t "$SESSION_NAME:0.0"
tmux split-window -v -t "$SESSION_NAME:0.2"
tmux split-window -v -t "$SESSION_NAME:0.1"

# チーム定義
declare -a TEAMS=(
    "🔧 改善・最適化|既存の改善・最適化"
    "🚀 革新・新規|全く新しいアプローチ"
    "👤 UX・体験|ユーザー視点・UX重視"
    "⚙️ 技術チャレンジ|技術的チャレンジ"
    "✨ シンプル・即効|シンプル・ミニマル"
)

# 各ペインでエージェント起動
for i in $(seq 0 4); do
    IFS='|' read -r EMOJI PERSPECTIVE <<< "${TEAMS[$i]}"
    tmux send-keys -t "$SESSION_NAME:0.$i" "echo '$EMOJI チーム'" Enter
    tmux send-keys -t "$SESSION_NAME:0.$i" "claude -p '以下のテーマについて、「$PERSPECTIVE」の観点から素早くアイデアを出してください。

【テーマ】
$TOPIC

【担当アイデア数】
約 $PER_TEAM 個

【ルール】
- 1アイデア = 1〜2文で簡潔に
- 実現可能性は一旦無視
- 批判せず、量を出す
- 突飛なアイデアも歓迎

【出力形式】
1. **アイデア名**: 説明（1文）
2. **アイデア名**: 説明（1文）
...'" Enter
done

# セッションにアタッチ
echo "🚀 ブレインストーミングを起動しました"
echo "   セッション: $SESSION_NAME"
echo "   目標アイデア数: $IDEA_COUNT 個（各チーム約 $PER_TEAM 個）"
echo ""
echo "📊 5チームが並列でアイデア出し中..."
echo "   🔧 改善・最適化チーム"
echo "   🚀 革新・新規チーム"
echo "   👤 UX・ユーザー体験チーム"
echo "   ⚙️ 技術チャレンジチーム"
echo "   ✨ シンプル・即効チーム"
echo ""
echo "💡 操作方法:"
echo "   ペイン移動: Ctrl+B → 矢印キー"
echo "   セッション終了: Ctrl+B → :kill-session"
echo ""

tmux attach -t "$SESSION_NAME"
