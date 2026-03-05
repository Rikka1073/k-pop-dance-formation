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
        <section className="text-center mb-16 relative">
          {/* 背景グロー */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-[600px] h-[250px] bg-gradient-to-r from-pink-500/15 via-fuchsia-500/15 to-violet-500/15 blur-3xl rounded-full" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-4xl">✨</span>
            <h1 className="text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                K-POP Formation
              </span>{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                Viewer
              </span>
            </h1>
            <span className="text-4xl">💫</span>
          </div>
          <p className="text-[var(--foreground-muted)] text-lg max-w-2xl mx-auto mb-10">
            K-POPダンス動画とフォーメーションを同期表示。
            振り付けの学習やメンバーの位置確認に最適です。
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-1 hover:scale-105 transition-all duration-200 text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            新規作成
          </Link>
        </section>

        {/* コンテンツ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              フォーメーション一覧
              {demoMode && (
                <span className="ml-3 text-sm font-normal text-pink-400">
                  ({displayVideos.length} / {videos.length + DEMO_VIDEO_TOTAL})
                </span>
              )}
            </h2>

            {/* デモモードトグル */}
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                demoMode
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-[var(--card-bg)] text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)]'
              }`}
            >
              {demoMode ? 'デモモード ON' : 'デモモード'}
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
        <section className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-[var(--foreground)] font-semibold mb-2">動画と同期</h3>
            <p className="text-[var(--foreground-muted)] text-sm">
              動画再生に合わせてフォーメーションがリアルタイムで更新
            </p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-[var(--foreground)] font-semibold mb-2">メンバー追跡</h3>
            <p className="text-[var(--foreground-muted)] text-sm">
              メンバーを選択して位置と動線をハイライト表示
            </p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">➡️</span>
            </div>
            <h3 className="text-[var(--foreground)] font-semibold mb-2">動線表示</h3>
            <p className="text-[var(--foreground-muted)] text-sm">
              矢印で各メンバーの次の移動先を表示
            </p>
          </div>
        </section>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
