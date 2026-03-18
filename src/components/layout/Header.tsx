'use client'

import Link from 'next/link'

interface HeaderProps {
  title?: string
  editHref?: string
}

export function Header({ title, editHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 relative" style={{ backdropFilter: 'blur(24px) saturate(160%)', background: 'rgba(8,5,26,0.75)', borderBottom: '1px solid rgba(255,45,120,0.12)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Icon mark */}
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#FF2D78] to-[#7C3AED] opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#FF2D78] to-[#7C3AED] blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <svg className="relative w-7 h-7 p-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="5"  cy="12" r="2.2" fill="currentColor" strokeWidth="0" />
              <circle cx="12" cy="7"  r="2.2" fill="currentColor" strokeWidth="0" />
              <circle cx="19" cy="12" r="2.2" fill="currentColor" strokeWidth="0" />
              <circle cx="12" cy="17" r="2.2" fill="currentColor" strokeWidth="0" />
              <path strokeLinecap="round" strokeWidth="1.2" d="M5 12 L12 7 L19 12 L12 17 Z" opacity="0.5" />
            </svg>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--foreground-muted)] group-hover:text-[#FF6BA8] transition-colors"
            >
              K-POP
            </span>
            <span
              className="text-[15px] font-black tracking-[0.06em] uppercase"
              style={{ background: 'linear-gradient(90deg, #FF2D78, #c084fc, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Formation Viewer
            </span>
          </div>
        </Link>

        {/* Center: Page title */}
        {title && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[var(--card-border)] text-lg font-thin select-none">|</span>
            <h1
              className="text-[var(--foreground-muted)] text-sm font-medium truncate max-w-xs tracking-wide"
              title={title}
            >
              {title}
            </h1>
          </div>
        )}

        {/* Right: Edit button */}
        {editHref && (
          <a
            href={editHref}
            className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'rgba(255,45,120,0.15)', color: '#FF6BA8', border: '1px solid rgba(255,45,120,0.3)' }}
          >
            ✏ Edit
          </a>
        )}
      </div>

      {/* Gradient border bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #FF2D78 30%, #c084fc 60%, #7C3AED, transparent)' }}
      />
    </header>
  )
}
