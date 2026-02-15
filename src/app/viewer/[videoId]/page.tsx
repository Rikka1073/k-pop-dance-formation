'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout'
import {
  YouTubePlayer,
  YouTubePlayerHandle,
  FormationStage,
  Timeline,
  MemberList,
} from '@/components/viewer'
import { useFormationSync } from '@/hooks'
import { Member, Formation, Position } from '@/types'
import {
  sampleArtist,
  sampleVideo,
  sampleFormationData,
} from '@/data/mock/sample-formation'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getFormationDataByVideoId, getVideoById } from '@/lib/supabase/queries'

// Transform DB data to app format
interface ViewerData {
  artistName: string
  videoTitle: string
  youtubeVideoId: string
  contributorName?: string
  members: Member[]
  formations: Formation[]
}

export default function ViewerPage() {
  const params = useParams()
  const videoId = params.videoId as string

  // Data loading
  const [viewerData, setViewerData] = useState<ViewerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Player ref
  const playerRef = useRef<YouTubePlayerHandle>(null)

  // 状態管理
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [showMovementArrows, setShowMovementArrows] = useState(true)
  const [stageFlipped, setStageFlipped] = useState(true) // デフォルト: 観客側が下

  // Load data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)

      // Check if this is the sample video
      if (videoId === sampleVideo.id) {
        setViewerData({
          artistName: sampleArtist.name,
          videoTitle: sampleVideo.title,
          youtubeVideoId: sampleVideo.youtubeVideoId,
          contributorName: sampleFormationData.contributorName,
          members: sampleArtist.members,
          formations: sampleFormationData.formations,
        })
        setIsLoading(false)
        return
      }

      // Try to load from Supabase
      if (!isSupabaseConfigured()) {
        setError('データが見つかりません')
        setIsLoading(false)
        return
      }

      try {
        // First try to get formation data
        const formationData = await getFormationDataByVideoId(videoId)

        if (formationData) {
          // Transform DB data
          const members: Member[] = formationData.video.artist.members.map((m) => ({
            id: m.id,
            artistId: m.artist_id,
            name: m.name,
            color: m.color,
            order: m.display_order,
          }))

          const formations: Formation[] = formationData.formations.map((f) => ({
            id: f.id,
            time: f.time,
            name: f.name || undefined,
            positions: f.positions.map((p) => ({
              memberId: p.member_id,
              x: p.x,
              y: p.y,
            })),
          }))

          setViewerData({
            artistName: formationData.video.artist.name,
            videoTitle: formationData.video.title,
            youtubeVideoId: formationData.video.youtube_video_id,
            contributorName: formationData.contributor_name || undefined,
            members,
            formations,
          })
        } else {
          // Try to get video without formation data
          const video = await getVideoById(videoId)
          if (video) {
            const members: Member[] = video.artist.members.map((m) => ({
              id: m.id,
              artistId: m.artist_id,
              name: m.name,
              color: m.color,
              order: m.display_order,
            }))

            setViewerData({
              artistName: video.artist.name,
              videoTitle: video.title,
              youtubeVideoId: video.youtube_video_id,
              members,
              formations: [],
            })
          } else {
            setError('動画が見つかりません')
          }
        }
      } catch (err) {
        console.error('Load error:', err)
        setError('データの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [videoId])

  // フォーメーションがない場合は円形の初期位置を生成
  const defaultPositions = useMemo(() => {
    if (!viewerData?.members || viewerData.members.length === 0) return []
    const count = viewerData.members.length
    return viewerData.members.map((m, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2
      const radius = Math.min(25, 15 + count * 2)
      return {
        memberId: m.id,
        x: Math.round(50 + radius * Math.cos(angle)),
        y: Math.round(50 + radius * Math.sin(angle)),
      }
    })
  }, [viewerData?.members])

  // フォーメーションがない場合はデフォルトのフォーメーションを使用
  const effectiveFormations = useMemo(() => {
    if (viewerData?.formations && viewerData.formations.length > 0) {
      return viewerData.formations
    }
    // デフォルトのフォーメーションを生成
    return [{
      id: 'default',
      time: 0,
      name: 'Initial Position',
      positions: defaultPositions,
    }]
  }, [viewerData?.formations, defaultPositions])

  // フォーメーション同期
  const { currentFormation, nextFormation, interpolatedPositions } = useFormationSync({
    formations: effectiveFormations,
    members: viewerData?.members || [],
    currentTime,
  })

  // コールバック
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur)
  }, [])

  const handleStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing)
  }, [])

  const handleMemberSelect = useCallback((memberId: string | null) => {
    setSelectedMemberId(memberId)
  }, [])

  const handleSeek = useCallback((time: number) => {
    playerRef.current?.seekTo(time)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-white">読み込み中...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !viewerData) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-red-400">{error || 'データが見つかりません'}</div>
          <a href="/" className="text-pink-400 hover:underline">
            ホームに戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header title={viewerData.videoTitle} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* メインコンテンツ - 2カラムレイアウト（タブレット以上） */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* YouTube Player */}
          <div>
            <h2 className="text-[var(--foreground-muted)] text-sm font-medium mb-2">動画</h2>
            <YouTubePlayer
              ref={playerRef}
              videoId={viewerData.youtubeVideoId}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onStateChange={handleStateChange}
            />
          </div>

          {/* Formation Stage */}
          <div>
            <h2 className="text-[var(--foreground-muted)] text-sm font-medium mb-2">フォーメーション</h2>
            <FormationStage
              positions={interpolatedPositions}
              nextFormation={nextFormation}
              selectedMemberId={selectedMemberId}
              showMovementArrows={showMovementArrows}
              onMemberClick={handleMemberSelect}
              flipped={stageFlipped}
            />
          </div>
        </div>

        {/* タイムライン */}
        <div className="mb-6">
          <Timeline
            formations={viewerData.formations}
            currentTime={currentTime}
            duration={duration}
            currentFormationName={currentFormation?.name}
            onSeek={handleSeek}
          />
        </div>

        {/* 下部コントロール - 2カラム */}
        <div className="grid grid-cols-2 gap-6">
          {/* メンバー一覧 */}
          <MemberList
            members={viewerData.members}
            selectedMemberId={selectedMemberId}
            onMemberSelect={handleMemberSelect}
          />

          {/* オプション */}
          <div className="bg-[var(--card-bg)] rounded-2xl p-4">
            <h3 className="text-pink-400 font-semibold mb-3">オプション</h3>
            <div className="space-y-3">
              {/* 動線表示切替 */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showMovementArrows}
                  onChange={(e) => setShowMovementArrows(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--card-border)] bg-[var(--background-tertiary)] text-pink-500 focus:ring-pink-400 focus:ring-offset-gray-900"
                />
                <span className="text-[var(--foreground)] text-sm group-hover:text-pink-300 transition-colors">移動矢印を表示</span>
              </label>

              {/* ステージ反転 */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={stageFlipped}
                  onChange={(e) => setStageFlipped(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--card-border)] bg-[var(--background-tertiary)] text-pink-500 focus:ring-pink-400 focus:ring-offset-gray-900"
                />
                <span className="text-[var(--foreground)] text-sm group-hover:text-pink-300 transition-colors">観客視点（観客側を下に）</span>
              </label>

              {/* 現在のフォーメーション情報 */}
              <div className="pt-3 border-t border-[var(--card-border)]">
                <p className="text-[var(--foreground-muted)] text-xs mb-1">現在のフォーメーション</p>
                <p className="text-[var(--foreground)] font-medium">
                  {currentFormation?.name || 'なし'}
                </p>
              </div>

              {/* 次のフォーメーション情報 */}
              {nextFormation && (
                <div>
                  <p className="text-[var(--foreground-muted)] text-xs mb-1">次のフォーメーション</p>
                  <p className="text-[var(--foreground)] font-medium">{nextFormation.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* アーティスト情報 + Edit */}
        <div className="mt-6 p-4 bg-[var(--card-bg)]/50 rounded-2xl flex items-center justify-between">
          <p className="text-[var(--foreground-muted)] text-sm">
            <span className="text-pink-300 font-medium">{viewerData.artistName}</span>
            {' • '}
            {viewerData.members.length}人
            {' • '}
            {viewerData.formations.length}フォーメーション
            {viewerData.contributorName && (
              <>
                {' • '}
                作成者: {viewerData.contributorName}
              </>
            )}
          </p>
          <a
            href={`/editor/${videoId}`}
            className="px-4 py-2 bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] text-[var(--foreground)] text-sm rounded-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            編集
          </a>
        </div>
      </main>
    </div>
  )
}
