import { Formation, Position, Member, InterpolatedPosition } from '@/types'

/**
 * 現在時刻に基づいて、現在のフォーメーションと次のフォーメーションを取得
 */
export function getCurrentFormations(
  formations: Formation[],
  currentTime: number
): { current: Formation | null; next: Formation | null } {
  if (formations.length === 0) {
    return { current: null, next: null }
  }

  // 時間順にソート
  const sorted = [...formations].sort((a, b) => a.time - b.time)

  // 現在時刻以前の最新フォーメーションを探す
  let currentIndex = -1
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].time <= currentTime) {
      currentIndex = i
      break
    }
  }

  // 現在時刻より前のフォーメーションがない場合は最初のフォーメーションを使用
  if (currentIndex === -1) {
    return { current: sorted[0], next: sorted[1] || null }
  }

  return {
    current: sorted[currentIndex],
    next: sorted[currentIndex + 1] || null,
  }
}

/**
 * 現在のフォーメーション位置を取得（補間なし、即座に切り替わる）
 */
export function interpolatePositions(
  current: Formation,
  next: Formation | null,
  currentTime: number,
  members: Member[]
): InterpolatedPosition[] {
  // 補間なし: 現在のフォーメーション位置をそのまま返す
  return current.positions.map((pos) => ({
    ...pos,
    member: members.find((m) => m.id === pos.memberId)!,
  }))
}

/**
 * 秒数をmm:ss形式にフォーマット
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * classNamesを結合するユーティリティ
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
