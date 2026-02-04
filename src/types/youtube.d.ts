export interface YTPlayerOptions {
  videoId?: string
  width?: number | string
  height?: number | string
  playerVars?: YTPlayerVars
  events?: YTPlayerEvents
}

export interface YTPlayerVars {
  autoplay?: 0 | 1
  controls?: 0 | 1
  disablekb?: 0 | 1
  enablejsapi?: 0 | 1
  fs?: 0 | 1
  iv_load_policy?: 1 | 3
  modestbranding?: 0 | 1
  playsinline?: 0 | 1
  rel?: 0 | 1
  start?: number
  end?: number
}

export interface YTPlayerEvents {
  onReady?: (event: YTPlayerEvent) => void
  onStateChange?: (event: YTOnStateChangeEvent) => void
  onError?: (event: YTOnErrorEvent) => void
}

export interface YTPlayerEvent {
  target: YTPlayer
}

export interface YTOnStateChangeEvent {
  target: YTPlayer
  data: number
}

export interface YTOnErrorEvent {
  target: YTPlayer
  data: number
}

export interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  seekTo(seconds: number, allowSeekAhead?: boolean): void
  getCurrentTime(): number
  getDuration(): number
  getPlayerState(): number
  destroy(): void
}

export interface YTPlayerConstructor {
  new (elementId: string | HTMLElement, options: YTPlayerOptions): YTPlayer
}

declare global {
  interface Window {
    YT: {
      Player: YTPlayerConstructor
    }
    onYouTubeIframeAPIReady: () => void
  }
}
