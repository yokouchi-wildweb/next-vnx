#!/bin/bash
# =============================================================================
# second-opinion-tmux.sh
# セカンドオピニオンを複数ペインで視覚的に実行
# =============================================================================

set -e

# 引数チェック
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "使用方法: $0 <回数:2-5> \"検討テーマ\""
    echo "例: $0 3 \"状態管理をReduxかZustandか\""
    exit 1
fi

COUNT="$1"
TOPIC="$2"
SESSION_NAME="second-opinion-$(date +%s)"

# 回数の検証
if [ "$COUNT" -lt 2 ] || [ "$COUNT" -gt 5 ]; then
    echo "エラー: 回数は2〜5の範囲で指定してください"
    exit 1
fi

# tmuxの存在確認
if ! command -v tmux &> /dev/null; then
    echo "エラー: tmuxがインストールされていません"
    echo ""
    echo "インストール方法:"
    echo "  macOS:  brew install tmux"
    echo "  Ubuntu: sudo apt install tmux"
    echo "  WSL:    sudo apt install tmux"
    echo ""
    echo "代替: Claude Code内で /second-opinion コマンドを使用してください"
    exit 1
fi

# ラベル配列
LABELS=("A" "B" "C" "D" "E")

# セッション作成
tmux new-session -d -s "$SESSION_NAME" -x 200 -y 50

# ペイン分割（回数に応じて）
case $COUNT in
    2)
        tmux split-window -h -t "$SESSION_NAME"
        ;;
    3)
        tmux split-window -h -t "$SESSION_NAME"
        tmux split-window -v -t "$SESSION_NAME:0.0"
        ;;
    4)
        tmux split-window -h -t "$SESSION_NAME"
        tmux split-window -v -t "$SESSION_NAME:0.0"
        tmux split-window -v -t "$SESSION_NAME:0.2"
        ;;
    5)
        tmux split-window -h -t "$SESSION_NAME"
        tmux split-window -v -t "$SESSION_NAME:0.0"
        tmux split-window -v -t "$SESSION_NAME:0.2"
        tmux split-window -v -t "$SESSION_NAME:0.1"
        ;;
esac

# 各ペインでエージェント起動
for i in $(seq 0 $((COUNT - 1))); do
    LABEL="${LABELS[$i]}"
    tmux send-keys -t "$SESSION_NAME:0.$i" "echo '👤 回答者 $LABEL'" Enter
    tmux send-keys -t "$SESSION_NAME:0.$i" "claude -p 'あなたは「回答者 $LABEL」です。

以下のテーマについて、あなた独自の視点で深く検討し、提案をしてください。
他の回答者の存在は意識せず、あなた自身の最善の分析と提案を行ってください。

【検討テーマ】
$TOPIC

【出力形式】
## 回答者 $LABEL の見解

### 要約（3行以内）

### 状況分析
- 現状の理解
- 重要な考慮点

### 提案するアプローチ
- 推奨する方針
- その理由

### トレードオフ分析
- メリット
- デメリット・リスク

### 結論
- 最終的な推奨
- 確信度: ⭐⭐⭐⭐⭐（5段階）'" Enter
done

# セッションにアタッチ
echo "🚀 セカンドオピニオンを起動しました"
echo "   セッション: $SESSION_NAME"
echo "   回答者数: $COUNT 名"
echo ""
echo "📊 回答者が並列で検討中..."
for i in $(seq 0 $((COUNT - 1))); do
    echo "   👤 回答者 ${LABELS[$i]}"
done
echo ""
echo "💡 操作方法:"
echo "   ペイン移動: Ctrl+B → 矢印キー"
echo "   セッション終了: Ctrl+B → :kill-session"
echo ""

tmux attach -t "$SESSION_NAME"
