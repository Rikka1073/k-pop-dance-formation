'use client'

import Link from 'next/link'

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
      {/* サムネイル */}
      <div className="relative aspect-video overflow-hidden bg-[var(--background-secondary)]">
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 group-hover:from-black/40 transition-all duration-300" />

        {/* 再生ボタン */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full absolute transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(255,45,120,0.75)', boxShadow: '0 0 20px rgba(255,45,120,0.6)' }}
            />
            <svg className="w-5 h-5 text-white ml-0.5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Formation count badge */}
        {formationCount !== undefined && (
          <div
            className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider"
            style={{
              background: 'rgba(8,5,26,0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,45,120,0.3)',
              color: '#FF6BA8',
            }}
          >
            {formationCount}
            <span className="text-[var(--foreground-muted)] font-normal ml-0.5">formations</span>
          </div>
        )}

        {/* デモバッジ */}
        {isDemo && (
          <div
            className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wider"
            style={{ background: 'rgba(255,45,120,0.8)', color: '#fff' }}
          >
            DEMO
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {/* Artist */}
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FF6BA8] mb-1">{artistName}</p>

        {/* Title */}
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
    </>
  )

  const cardBase = `group rounded-2xl overflow-hidden transition-all duration-300`
  const cardStyle = {
    background: 'rgba(22,18,53,0.8)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,45,120,0.14)',
  }
  const cardHoverClass = isDemo
    ? 'cursor-not-allowed opacity-75'
    : ''

  if (isDemo) {
    return (
      <div className={`${cardBase} ${cardHoverClass}`} style={cardStyle}>
        {CardContent}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={cardBase}
      style={cardStyle}
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
      {CardContent}
    </Link>
  )
}
