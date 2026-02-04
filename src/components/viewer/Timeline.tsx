'use client'

import { Formation } from '@/types'
import { formatTime, cn } from '@/lib/utils'

interface TimelineProps {
  formations: Formation[]
  currentTime: number
  duration: number
  currentFormationName?: string
  onSeek?: (time: number) => void
}

export function Timeline({
  formations,
  currentTime,
  duration,
  currentFormationName,
  onSeek,
}: TimelineProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || duration === 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const time = percentage * duration
    onSeek(time)
  }

  return (
    <div className="space-y-2">
      {/* フォーメーション名表示 */}
      {currentFormationName && (
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-white text-sm font-medium">
            {currentFormationName}
          </span>
        </div>
      )}

      {/* タイムライン */}
      <div
        className="relative h-8 bg-gray-700 rounded-lg cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {/* プログレスバー */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${progress}%` }}
        />

        {/* フォーメーションマーカー */}
        {formations.map((formation) => {
          const markerPosition = duration > 0 ? (formation.time / duration) * 100 : 0
          const isActive = currentTime >= formation.time

          return (
            <div
              key={formation.id}
              className={cn(
                'absolute top-1 bottom-1 w-1 rounded-full transition-all',
                isActive ? 'bg-white' : 'bg-white/50'
              )}
              style={{ left: `${markerPosition}%` }}
              title={`${formation.name || 'Formation'} (${formatTime(formation.time)})`}
            />
          )
        })}

        {/* 現在位置インジケーター */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* 時間表示 */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
