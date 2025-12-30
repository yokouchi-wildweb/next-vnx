/**
 * Lab - 実験場一覧
 * 画面モックを作成し、engine/ への汎用化を検討する場所
 */
import Link from 'next/link'

const experiments = [
  {
    id: '001-basic-scene',
    title: '基本シーン',
    description: '背景 + 立ち絵 + 台詞表示',
    status: 'wip',
  },
  {
    id: '002-ai-dialogue',
    title: 'AIダイアログ',
    description: 'LLMによる動的な文章の受け答え',
    status: 'wip',
  },
  {
    id: '004-tunnel-background',
    title: 'トンネル背景',
    description: '中心から放射状に広がる多角形グリッド背景（四角形/六角形）',
    status: 'wip',
  },
]

export default function LabIndexPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Lab - 実験場</h1>
      <p className="text-gray-400 mb-8">
        画面モックを作成し、engine/ への汎用化を検討する場所
      </p>

      <div className="grid gap-4">
        {experiments.map((exp) => (
          <Link
            key={exp.id}
            href={`/lab/${exp.id}`}
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm px-2 py-1 bg-yellow-600 rounded">
                {exp.status}
              </span>
              <h2 className="text-xl font-semibold">{exp.title}</h2>
            </div>
            <p className="text-gray-400 mt-2">{exp.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
