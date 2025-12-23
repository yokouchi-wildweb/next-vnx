#!/bin/bash
# =============================================================================
# expert-panel-tmux.sh
# 専門家パネルを4分割tmuxペインで視覚的に実行
# =============================================================================

set -e

# 引数チェック
if [ -z "$1" ]; then
    echo "使用方法: $0 \"分析対象のテーマ\""
    echo "例: $0 \"新しい認証フローの実装方針\""
    exit 1
fi

TOPIC="$1"
SESSION_NAME="expert-panel-$(date +%s)"

# tmuxの存在確認
if ! command -v tmux &> /dev/null; then
    echo "エラー: tmuxがインストールされていません"
    echo ""
    echo "インストール方法:"
    echo "  macOS:  brew install tmux"
    echo "  Ubuntu: sudo apt install tmux"
    echo "  WSL:    sudo apt install tmux"
    echo ""
    echo "代替: Claude Code内で /expert-panel コマンドを使用してください"
    exit 1
fi

# セッション作成
tmux new-session -d -s "$SESSION_NAME" -x 200 -y 50

# 4分割レイアウト
tmux split-window -h -t "$SESSION_NAME"
tmux split-window -v -t "$SESSION_NAME:0.0"
tmux split-window -v -t "$SESSION_NAME:0.2"

# 各ペインにラベルとコマンドを設定
# ペイン0: セキュリティ
tmux send-keys -t "$SESSION_NAME:0.0" "echo '🔐 セキュリティ専門家'" Enter
tmux send-keys -t "$SESSION_NAME:0.0" "claude -p 'あなたはセキュリティの専門家です。以下の実装方針・設計について、セキュリティの観点から深く分析してください。脆弱性、認証認可、データ保護の観点で評価し、リスクレベルと具体的な推奨対策を提示してください。

【分析対象】
$TOPIC'" Enter

# ペイン1: パフォーマンス
tmux send-keys -t "$SESSION_NAME:0.1" "echo '⚡ パフォーマンス専門家'" Enter
tmux send-keys -t "$SESSION_NAME:0.1" "claude -p 'あなたはパフォーマンスの専門家です。以下の実装方針・設計について、パフォーマンスの観点から深く分析してください。レスポンス、スケーラビリティ、リソース効率の観点で評価し、ボトルネックと最適化提案を提示してください。

【分析対象】
$TOPIC'" Enter

# ペイン2: 保守性
tmux send-keys -t "$SESSION_NAME:0.2" "echo '🔧 保守性専門家'" Enter
tmux send-keys -t "$SESSION_NAME:0.2" "claude -p 'あなたは保守性の専門家です。以下の実装方針・設計について、保守性の観点から深く分析してください。可読性、テスタビリティ、変更容易性の観点で評価し、技術的負債のリスクと改善提案を提示してください。

【分析対象】
$TOPIC'" Enter

# ペイン3: アーキテクチャ
tmux send-keys -t "$SESSION_NAME:0.3" "echo '🏗️ アーキテクチャ専門家'" Enter
tmux send-keys -t "$SESSION_NAME:0.3" "claude -p 'あなたはアーキテクチャの専門家です。以下の実装方針・設計について、アーキテクチャの観点から深く分析してください。設計原則、既存構造との整合性、拡張性の観点で評価し、代替設計案があれば提示してください。

【分析対象】
$TOPIC'" Enter

# セッションにアタッチ
echo "🚀 専門家パネルを起動しました"
echo "   セッション: $SESSION_NAME"
echo ""
echo "📊 4つの専門家が並列で分析中..."
echo "   🔐 セキュリティ (左上)"
echo "   ⚡ パフォーマンス (左下)"
echo "   🔧 保守性 (右上)"
echo "   🏗️ アーキテクチャ (右下)"
echo ""
echo "💡 操作方法:"
echo "   ペイン移動: Ctrl+B → 矢印キー"
echo "   セッション終了: Ctrl+B → :kill-session"
echo ""

tmux attach -t "$SESSION_NAME"
