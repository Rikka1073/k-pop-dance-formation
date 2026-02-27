'use client'

import Link from 'next/link'
import Image from 'next/image'

interface VideoCardProps {
  id: string
  title: string
  artistName: string
  youtubeVideoId: string
  members: { id: string; name: string; color: string }[]
  formationCount?: number
  isDemo?: boolean
}

export function VideoCard({
  id,
  title,
  artistName,
  youtubeVideoId,
  members,
  formationCount,
  isDemo = false,
}: VideoCardProps) {
  const href = isDemo ? '#' : `/viewer/${id}`
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`

  const CardContent = (
    <>
      {/* グラデーションアクセント */}
      <div className="h-1 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400" />
      {/* サムネイル */}
      <div className="relative aspect-video bg-[var(--background-secondary)] overflow-hidden">
        {/* YouTubeサムネイル */}
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        {/* 再生ボタン */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-pink-500/80 group-hover:scale-110 transition-all duration-200">
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* デモバッジ */}
        {isDemo && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-pink-500/80 text-white text-xs rounded-full">
            デモ
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        <h3 className="text-[var(--foreground)] font-semibold mb-1 group-hover:text-pink-400 transition-colors truncate">
          {title}
        </h3>
        <p className="text-[var(--foreground-muted)] text-sm mb-3">{artistName}</p>

        {/* メンバーアイコン */}
        <div className="flex gap-1 flex-wrap">
          {members.slice(0, 8).map((member) => (
            <div
              key={member.id}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: member.color }}
              title={member.name}
            >
              {member.name.charAt(0)}
            </div>
          ))}
          {members.length > 8 && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--background-tertiary)] text-[var(--foreground)] text-xs">
              +{members.length - 8}
            </div>
          )}
        </div>

        {/* メタ情報 */}
        <div className="mt-3 pt-3 border-t border-[var(--card-border)] flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
          {formationCount !== undefined && (
            <span>{formationCount}個のフォーメーション</span>
          )}
          <span>{members.length}人</span>
        </div>
      </div>
    </>
  )

  if (isDemo) {
    return (
      <div className="group bg-[var(--card-bg)] rounded-2xl overflow-hidden cursor-not-allowed opacity-90 border border-[var(--card-border)] shadow-sm">
        {CardContent}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-sm hover:ring-2 hover:ring-pink-400 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1 transition-all duration-200"
    >
      {CardContent}
    </Link>
  )
}
