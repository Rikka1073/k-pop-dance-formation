'use client'

export function VideoCardSkeleton() {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--card-border)] animate-pulse">
      {/* サムネイル部分 */}
      <div className="aspect-video bg-[var(--background-tertiary)]" />

      {/* テキスト部分 */}
      <div className="p-4 space-y-3">
        {/* タイトル */}
        <div className="h-4 bg-[var(--background-tertiary)] rounded-full w-3/4" />
        <div className="h-3 bg-[var(--background-tertiary)] rounded-full w-1/2" />

        {/* メンバーアイコン */}
        <div className="flex gap-1.5 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-[var(--background-tertiary)]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
