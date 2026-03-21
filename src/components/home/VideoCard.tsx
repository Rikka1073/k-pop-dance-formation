'use client'

import Link from 'next/link'

interface VideoCardProps {
  id: string
  title: string
  artistName: string
  youtubeVideoId: string
  members: { id: string; name: string; color: string }[]
}

export function VideoCard({
  id,
  title,
  artistName,
  youtubeVideoId,
  members,
}: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`

  return (
    <Link
      href={`/viewer/${id}`}
      className="group rounded-3xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(22,18,53,0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,45,120,0.14)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,45,120,0.5)'
        el.style.boxShadow = '0 0 24px rgba(255,45,120,0.2), 0 8px 32px rgba(0,0,0,0.4)'
        el.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,45,120,0.14)'
        el.style.boxShadow = ''
        el.style.transform = ''
      }}
    >
      {/* サムネイル */}
      <div className="relative aspect-video overflow-hidden bg-[var(--background-secondary)]">
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 group-hover:from-black/40 transition-all duration-300" />

        {/* 再生ボタン */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
            style={{ background: 'rgba(255,45,120,0.85)', backdropFilter: 'blur(4px)', boxShadow: '0 0 20px rgba(255,45,120,0.5)' }}
          >
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

      </div>

      {/* コンテンツ */}
      <div className="p-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FF6BA8] mb-1">{artistName}</p>
        <h3 className="text-[var(--foreground)] font-bold mb-3 group-hover:text-white transition-colors truncate text-sm leading-snug">
          {title}
        </h3>

        {/* メンバーアイコン */}
        <div className="flex items-center gap-1 flex-wrap">
          {members.slice(0, 8).map((member) => (
            <div
              key={member.id}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black ring-1 ring-black/40"
              style={{ backgroundColor: member.color }}
              title={member.name}
            >
              {member.name.charAt(0)}
            </div>
          ))}
          {members.length > 8 && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--foreground-muted)' }}
            >
              +{members.length - 8}
            </div>
          )}
          <span className="ml-auto text-[10px] text-[var(--foreground-muted)]">{members.length}名</span>
        </div>
      </div>
    </Link>
  )
}
