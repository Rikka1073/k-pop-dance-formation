'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type PlayerState = 'unstarted' | 'playing' | 'paused' | 'buffering' | 'ended'

interface UseYouTubePlayerOptions {
  videoId: string
  onReady?: () => void
  onStateChange?: (state: PlayerState) => void
}

interface UseYouTubePlayerReturn {
  playerRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
  playerState: PlayerState
  currentTime: number
  duration: number
  play: () => void
  pause: () => void
  seekTo: (seconds: number) => void
}

// YouTube IFrame APIのスクリプトが読み込まれたかどうか
let isAPILoaded = false
let apiLoadPromise: Promise<void> | null = null

function loadYouTubeAPI(): Promise<void> {
  if (isAPILoaded) {
    return Promise.resolve()
  }

  if (apiLoadPromise) {
    return apiLoadPromise
  }

  apiLoadPromise = new Promise((resolve) => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      isAPILoaded = true
      resolve()
    }
  })

  return apiLoadPromise
}

function mapPlayerState(state: number): PlayerState {
  switch (state) {
    case YT.PlayerState.PLAYING:
      return 'playing'
    case YT.PlayerState.PAUSED:
      return 'paused'
    case YT.PlayerState.BUFFERING:
      return 'buffering'
    case YT.PlayerState.ENDED:
      return 'ended'
    default:
      return 'unstarted'
  }
}

export function useYouTubePlayer({
  videoId,
  onReady,
  onStateChange,
}: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const playerInstanceRef = useRef<YT.Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [playerState, setPlayerState] = useState<PlayerState>('unstarted')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // 現在時刻を定期的に更新
  useEffect(() => {
    if (!isReady || playerState !== 'playing') {
      return
    }

    const interval = setInterval(() => {
      if (playerInstanceRef.current) {
        setCurrentTime(playerInstanceRef.current.getCurrentTime())
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isReady, playerState])

  // プレイヤーの初期化
  useEffect(() => {
    let isMounted = true

    async function initPlayer() {
      await loadYouTubeAPI()

      if (!isMounted || !playerRef.current) {
        return
      }

      // 既存のプレイヤーがあれば破棄
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
      }

      playerInstanceRef.current = new YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          enablejsapi: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (!isMounted) return
            setIsReady(true)
            setDuration(event.target.getDuration())
            onReady?.()
          },
          onStateChange: (event) => {
            if (!isMounted) return
            const state = mapPlayerState(event.data)
            setPlayerState(state)
            setCurrentTime(event.target.getCurrentTime())
            onStateChange?.(state)
          },
        },
      })
    }

    initPlayer()

    return () => {
      isMounted = false
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
        playerInstanceRef.current = null
      }
    }
  }, [videoId, onReady, onStateChange])

  const play = useCallback(() => {
    playerInstanceRef.current?.playVideo()
  }, [])

  const pause = useCallback(() => {
    playerInstanceRef.current?.pauseVideo()
  }, [])

  const seekTo = useCallback((seconds: number) => {
    playerInstanceRef.current?.seekTo(seconds, true)
    setCurrentTime(seconds)
  }, [])

  return {
    playerRef,
    isReady,
    playerState,
    currentTime,
    duration,
    play,
    pause,
    seekTo,
  }
}
