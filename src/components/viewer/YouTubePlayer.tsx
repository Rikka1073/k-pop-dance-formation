'use client'

import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { useYouTubePlayer } from '@/hooks'

interface YouTubePlayerProps {
  videoId: string
  onTimeUpdate?: (time: number) => void
  onStateChange?: (isPlaying: boolean) => void
  onReady?: () => void
  onDurationChange?: (duration: number) => void
}

export interface YouTubePlayerHandle {
  seekTo: (seconds: number) => void
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(function YouTubePlayer({
  videoId,
  onTimeUpdate,
  onStateChange,
  onReady,
  onDurationChange,
}, ref) {
  const { playerRef, isReady, playerState, currentTime, duration, seekTo } = useYouTubePlayer({
    videoId,
    onReady: () => {
      onReady?.()
    },
    onStateChange: (state) => {
      onStateChange?.(state === 'playing')
    },
  })

  useImperativeHandle(ref, () => ({
    seekTo,
  }), [seekTo])

  // 時間更新の通知
  useEffect(() => {
    if (onTimeUpdate && isReady) {
      onTimeUpdate(currentTime)
    }
  }, [currentTime, isReady, onTimeUpdate])

  // Duration更新の通知
  useEffect(() => {
    if (onDurationChange && duration > 0) {
      onDurationChange(duration)
    }
  }, [duration, onDurationChange])

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <div ref={playerRef} className="absolute inset-0" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-sm">Loading...</div>
        </div>
      )}
    </div>
  )
})
