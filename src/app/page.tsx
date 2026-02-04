import Link from 'next/link'
import { Header } from '@/components/layout'
import { sampleArtist, sampleVideo, sampleFormationData } from '@/data/mock/sample-formation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            K-POP Formation Viewer
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch K-POP dance videos with synchronized formation visualization.
            Perfect for learning choreography and understanding member positions.
          </p>
        </section>

        {/* サンプルコンテンツ */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Available Formations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* サンプルカード */}
            <Link
              href={`/viewer/${sampleVideo.id}`}
              className="group bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
            >
              {/* サムネイル */}
              <div className="relative aspect-video bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* フォーメーションプレビュー */}
                <div className="absolute inset-0 opacity-50">
                  {sampleFormationData.formations[0].positions.map((pos, idx) => (
                    <div
                      key={idx}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        backgroundColor: sampleArtist.members[idx]?.color || '#fff',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* コンテンツ */}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                  {sampleVideo.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{sampleArtist.name}</p>

                {/* メンバーアイコン */}
                <div className="flex gap-1">
                  {sampleArtist.members.map((member) => (
                    <div
                      key={member.id}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: member.color }}
                      title={member.name}
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                </div>

                {/* メタ情報 */}
                <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-4 text-xs text-gray-500">
                  <span>{sampleFormationData.formations.length} formations</span>
                  <span>{sampleArtist.members.length} members</span>
                </div>
              </div>
            </Link>

            {/* プレースホルダーカード */}
            <div className="bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">More formations coming soon</p>
            </div>
          </div>
        </section>

        {/* 説明セクション */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Sync with Video</h3>
            <p className="text-gray-400 text-sm">
              Formation positions update in real-time as the video plays
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Track Members</h3>
            <p className="text-gray-400 text-sm">
              Select a member to highlight their position and movement path
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">➡️</span>
            </div>
            <h3 className="text-white font-semibold mb-2">See Movement</h3>
            <p className="text-gray-400 text-sm">
              Arrows show where each member will move next
            </p>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          K-POP Formation Viewer - Phase 1 MVP
        </div>
      </footer>
    </div>
  )
}
