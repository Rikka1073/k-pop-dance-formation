'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { VideoCard } from '@/components/home'
import { VideoCardSkeleton } from '@/components/ui'
import { sampleArtist, sampleVideo, sampleFormationData } from '@/data/mock/sample-formation'
import { generateDemoVideos, DEMO_VIDEO_TOTAL, DEMO_PAGE_SIZE, DemoVideo } from '@/data/mock/demo-videos'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideos } from '@/lib/supabase/queries'

interface VideoCardData {
  id: string
  title: string
  artistName: string
  youtubeVideoId: string
  members: { id: string; name: string; color: string }[]
  formationCount?: number
  isDemo?: boolean
}

export default function HomePage() {
  const [videos, setVideos] = useState<VideoCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [demoVideos, setDemoVideos] = useState<DemoVideo[]>([])
  const [demoPage, setDemoPage] = useState(0)
  const [hasMoreDemo, setHasMoreDemo] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [demoSessionId, setDemoSessionId] = useState(0)

  // Intersection Observer ref for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Load real videos
  useEffect(() => {
    async function loadVideos() {
      setIsLoading(true)

      const allVideos: VideoCardData[] = [
        {
          id: sampleVideo.id,
          title: sampleVideo.title,
          artistName: sampleArtist.name,
          youtubeVideoId: sampleVideo.youtubeVideoId,
          members: sampleArtist.members.map((m) => ({
            id: m.id,
            name: m.name,
            color: m.color,
          })),
          formationCount: sampleFormationData.formations.length,
        },
      ]

      if (isSupabaseConfigured()) {
        try {
          const dbVideos = await getVideos()
          for (const v of dbVideos) {
            allVideos.push({
              id: v.id,
              title: v.title,
              artistName: v.artist.name,
              youtubeVideoId: v.youtube_video_id,
              members: v.artist.members.map((m) => ({
                id: m.id,
                name: m.name,
                color: m.color,
              })),
            })
          }
        } catch (error) {
          console.error('Failed to load videos:', error)
        }
      }

      setVideos(allVideos)
      setIsLoading(false)
    }

    loadVideos()
  }, [])


  // Load more demo videos
  const loadMoreDemoVideos = useCallback(() => {
    if (isLoadingMore || !hasMoreDemo) return

    setIsLoadingMore(true)

    // Simulate network delay
    setTimeout(() => {
      const startIndex = demoPage * DEMO_PAGE_SIZE
      const newVideos = generateDemoVideos(DEMO_PAGE_SIZE, startIndex)

      setDemoVideos(prev => [...prev, ...newVideos])
      setDemoPage(prev => prev + 1)
      setHasMoreDemo(startIndex + DEMO_PAGE_SIZE < DEMO_VIDEO_TOTAL)
      setIsLoadingMore(false)
    }, 500)
  }, [demoPage, hasMoreDemo, isLoadingMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!demoMode || !hasMoreDemo) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreDemoVideos()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [demoMode, hasMoreDemo, loadMoreDemoVideos])

  // Toggle demo mode
  const toggleDemoMode = () => {
    if (demoMode) {
      // デモモードをOFFにする時はデータをリセット
      setDemoVideos([])
      setDemoPage(0)
      setHasMoreDemo(true)
      setDemoMode(false)
    } else {
      // デモモードをONにする時は新しいセッションIDを生成して初期データをロード
      const newSessionId = Date.now()
      setDemoSessionId(newSessionId)
      const initial = generateDemoVideos(DEMO_PAGE_SIZE, 0)
      setDemoVideos(initial)
      setDemoPage(1)
      setHasMoreDemo(DEMO_PAGE_SIZE < DEMO_VIDEO_TOTAL)
      setDemoMode(true)
    }
  }

  // Combined videos list
  const displayVideos: VideoCardData[] = demoMode
    ? [
        ...videos,
        ...demoVideos.map(v => ({
          ...v,
          id: `${demoSessionId}-${v.id}`, // セッションIDを追加してユニークにする
          isDemo: true
        })),
      ]
    : videos

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <section className="text-center mb-20 relative pt-8">
          {/* 背景: 複数のグローオーブ */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
              className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[80px] opacity-30"
              style={{ background: 'radial-gradient(ellipse, #FF2D78 0%, #7C3AED 50%, transparent 70%)', animation: 'float-orb 7s ease-in-out infinite' }}
            />
            <div
              className="absolute top-[40px] left-[15%] w-[200px] h-[200px] rounded-full blur-[60px] opacity-20"
              style={{ background: '#FF2D78', animation: 'float-orb 5s ease-in-out infinite 1s' }}
            />
            <div
              className="absolute top-[20px] right-[12%] w-[180px] h-[180px] rounded-full blur-[60px] opacity-20"
              style={{ background: '#7C3AED', animation: 'float-orb 6s ease-in-out infinite 2s' }}
            />
          </div>

          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass border border-[#FF2D78]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D78]" style={{ animation: 'glow-ping 2s ease infinite', boxShadow: '0 0 6px #FF2D78' }} />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--foreground-muted)]">
              K-POP Dance Formation Tool
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black tracking-tight mb-2 leading-none" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
            <span className="shimmer-text">Formation</span>
            <br />
            <span
              style={{ background: 'linear-gradient(135deg, #e2e8f0 30%, #8B9CB8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Viewer
            </span>
          </h1>

          <p className="text-[var(--foreground-muted)] text-base max-w-lg mx-auto mb-10 leading-relaxed mt-6" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
            K-POPダンス動画とフォーメーションをリアルタイム同期。<br />
            振り付け学習・メンバー位置確認に最適なツール。
          </p>

          {/* CTA */}
          <Link
            href="/editor"
            className="group inline-flex items-center gap-2.5 px-8 py-4 text-white font-bold rounded-2xl text-base relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF2D78, #c026d3, #7C3AED)',
              boxShadow: '0 0 30px rgba(255,45,120,0.35), 0 4px 20px rgba(124,58,237,0.25)',
            }}
          >
            {/* Shimmer overlay */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', backgroundSize: '200% auto' }} />
            <svg className="w-4.5 h-4.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="relative z-10 tracking-wide">新規作成</span>
          </Link>
        </section>

        {/* コンテンツ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-black uppercase tracking-widest text-[var(--foreground)]">
                フォーメーション一覧
              </h2>
              {demoMode && (
                <span className="text-xs font-medium text-[#FF6BA8] tracking-wide">
                  {displayVideos.length} / {videos.length + DEMO_VIDEO_TOTAL}
                </span>
              )}
            </div>

            {/* デモモードトグル */}
            <button
              onClick={toggleDemoMode}
              className="px-4 py-2 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-200"
              style={demoMode
                ? { background: 'linear-gradient(135deg,#FF2D78,#7C3AED)', color: '#fff', boxShadow: '0 0 16px rgba(255,45,120,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'var(--foreground-muted)', border: '1px solid rgba(255,45,120,0.15)' }
              }
            >
              {demoMode ? '● Demo ON' : 'Demo'}
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {displayVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    artistName={video.artistName}
                    youtubeVideoId={video.youtubeVideoId}
                    members={video.members}
                    formationCount={video.formationCount}
                    isDemo={video.isDemo}
                  />
                ))}

                {/* プレースホルダーカード（デモモードでない時のみ） */}
                {!demoMode && (
                  <Link
                    href="/editor"
                    className="bg-[var(--card-bg)]/50 rounded-2xl border-2 border-dashed border-[var(--card-border)] p-8 flex flex-col items-center justify-center text-center hover:border-pink-400 hover:bg-[var(--card-bg)]/70 hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-[var(--foreground-muted)]"
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
                    <p className="text-[var(--foreground-muted)] text-sm">新しいフォーメーションを追加</p>
                  </Link>
                )}
              </div>

              {/* 無限スクロール用のローディング表示 */}
              {demoMode && hasMoreDemo && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center items-center py-12"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>読み込み中...</span>
                    </div>
                  ) : (
                    <div className="h-10" />
                  )}
                </div>
              )}

              {/* デモモードで全て読み込み完了 */}
              {demoMode && !hasMoreDemo && (
                <div className="text-center py-8 text-[var(--foreground-muted)]">
                  全 {displayVideos.length} 件を表示中
                </div>
              )}
            </>
          )}
        </section>

        {/* 説明セクション */}
        <section className="mt-20 grid grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.893L15 14M4 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
                </svg>
              ),
              label: '動画と同期',
              desc: '動画再生に合わせてフォーメーションがリアルタイムで更新',
              accent: '#FF2D78',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              label: 'メンバー追跡',
              desc: 'メンバーを選択して位置と動線をハイライト表示',
              accent: '#c026d3',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              ),
              label: '動線表示',
              desc: '矢印で各メンバーの次の移動先を表示',
              accent: '#7C3AED',
            },
          ].map(({ icon, label, desc, accent }) => (
            <div key={label} className="group glass rounded-2xl p-6 hover:border-[rgba(255,45,120,0.3)] transition-all duration-300 hover:-translate-y-1">
              {/* Top accent line */}
              <div className="h-px w-12 mb-5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              {/* Icon */}
              <div className="mb-4" style={{ color: accent }}>
                {icon}
              </div>
              <h3 className="text-[var(--foreground)] font-bold mb-2 tracking-wide text-sm uppercase">{label}</h3>
              <p className="text-[var(--foreground-muted)] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
                {desc}
              </p>
            </div>
          ))}
        </section>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
