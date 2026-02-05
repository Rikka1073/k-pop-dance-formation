'use client'

import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout'
import {
  YouTubePlayer,
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

  // 状態管理
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [showMovementArrows, setShowMovementArrows] = useState(true)

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

  // フォーメーション同期
  const { currentFormation, nextFormation, interpolatedPositions } = useFormationSync({
    formations: viewerData?.formations || [],
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !viewerData) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-red-400">{error || 'データが見つかりません'}</div>
          <a href="/" className="text-purple-400 hover:underline">
            ホームに戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header title={viewerData.videoTitle} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* メインコンテンツ - 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* YouTube Player */}
          <div>
            <h2 className="text-white/60 text-sm font-medium mb-2">Video</h2>
            <YouTubePlayer
              videoId={viewerData.youtubeVideoId}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onStateChange={handleStateChange}
            />
          </div>

          {/* Formation Stage */}
          <div>
            <h2 className="text-white/60 text-sm font-medium mb-2">Formation</h2>
            <FormationStage
              positions={interpolatedPositions}
              nextFormation={nextFormation}
              selectedMemberId={selectedMemberId}
              showMovementArrows={showMovementArrows}
              onMemberClick={handleMemberSelect}
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
          />
        </div>

        {/* 下部コントロール - 2カラム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* メンバー一覧 */}
          <MemberList
            members={viewerData.members}
            selectedMemberId={selectedMemberId}
            onMemberSelect={handleMemberSelect}
          />

          {/* オプション */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Options</h3>
            <div className="space-y-3">
              {/* 動線表示切替 */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMovementArrows}
                  onChange={(e) => setShowMovementArrows(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                />
                <span className="text-white text-sm">Show movement arrows</span>
              </label>

              {/* 現在のフォーメーション情報 */}
              <div className="pt-3 border-t border-gray-700">
                <p className="text-gray-400 text-xs mb-1">Current Formation</p>
                <p className="text-white font-medium">
                  {currentFormation?.name || 'N/A'}
                </p>
              </div>

              {/* 次のフォーメーション情報 */}
              {nextFormation && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">Next Formation</p>
                  <p className="text-white font-medium">{nextFormation.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* アーティスト情報 */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">{viewerData.artistName}</span>
            {' • '}
            {viewerData.members.length} members
            {' • '}
            {viewerData.formations.length} formations
            {viewerData.contributorName && (
              <>
                {' • '}
                Contributed by {viewerData.contributorName}
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}
