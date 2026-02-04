'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout'
import {
  YouTubePlayer,
  FormationStage,
  Timeline,
  MemberList,
} from '@/components/viewer'
import { Button } from '@/components/ui'
import { useFormationSync } from '@/hooks'
import {
  sampleArtist,
  sampleVideo,
  sampleFormationData,
} from '@/data/mock/sample-formation'

export default function ViewerPage() {
  const params = useParams()
  const videoId = params.videoId as string

  // 状態管理
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [showMovementArrows, setShowMovementArrows] = useState(true)

  // フォーメーション同期
  const { currentFormation, nextFormation, interpolatedPositions } = useFormationSync({
    formations: sampleFormationData.formations,
    members: sampleArtist.members,
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

  return (
    <div className="min-h-screen bg-gray-950">
      <Header title={sampleVideo.title} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* メインコンテンツ - 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* YouTube Player */}
          <div>
            <h2 className="text-white/60 text-sm font-medium mb-2">Video</h2>
            <YouTubePlayer
              videoId={sampleVideo.youtubeVideoId}
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
            formations={sampleFormationData.formations}
            currentTime={currentTime}
            duration={duration}
            currentFormationName={currentFormation?.name}
          />
        </div>

        {/* 下部コントロール - 2カラム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* メンバー一覧 */}
          <MemberList
            members={sampleArtist.members}
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
            <span className="text-white font-medium">{sampleArtist.name}</span>
            {' • '}
            {sampleArtist.members.length} members
            {' • '}
            {sampleFormationData.formations.length} formations
            {sampleFormationData.contributorName && (
              <>
                {' • '}
                Contributed by {sampleFormationData.contributorName}
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}
