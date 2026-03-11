'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout'
import { getAllFormationDataForAdmin, AdminFormationEntry } from '@/lib/supabase/queries'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPage() {
  const [entries, setEntries] = useState<AdminFormationEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllFormationDataForAdmin()
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header title="管理者ダッシュボード" />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-wide text-white">
            フォーメーション 編集履歴
          </h2>
          <span className="text-xs text-[var(--foreground-muted)]">
            {!isLoading && `${entries.length} 件`}
          </span>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #FF2D78, #7C3AED)',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,45,120,0.15)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,45,120,0.12)' }}>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">アーティスト</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">動画タイトル</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">F数</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">作成日時</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">最終更新</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                  >
                    <td className="px-4 py-3 font-bold text-white">
                      {entry.video?.artist?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground-muted)] max-w-xs truncate">
                      {entry.video?.title ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--foreground-muted)]">
                      {entry.formations?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground-muted)] text-xs whitespace-nowrap">
                      {entry.created_at ? formatDate(entry.created_at) : '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground-muted)] text-xs whitespace-nowrap">
                      {entry.updated_at ? formatDate(entry.updated_at) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/viewer/${entry.video?.id}`}
                          className="px-3 py-1 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                          style={{ background: 'rgba(124,58,237,0.15)', color: '#9D5CF0', border: '1px solid rgba(124,58,237,0.25)' }}
                        >
                          View
                        </a>
                        <a
                          href={`/editor/${entry.video?.id}`}
                          className="px-3 py-1 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                          style={{ background: 'rgba(255,45,120,0.12)', color: '#FF6BA8', border: '1px solid rgba(255,45,120,0.25)' }}
                        >
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {entries.length === 0 && (
              <div className="py-16 text-center text-[var(--foreground-muted)] text-sm">
                データがありません
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
