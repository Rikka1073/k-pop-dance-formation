'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-[var(--card-bg)] border-b border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-2xl group-hover:animate-pulse">✨</span>
          <span className="text-pink-400 dark:text-pink-400 font-bold text-lg">Formation</span>
          <span className="text-violet-400 dark:text-violet-400 font-bold text-lg">Viewer</span>
          <span className="text-2xl group-hover:animate-pulse">💫</span>
        </Link>

        <div className="flex items-center gap-4">
          {title && (
            <h1 className="text-[var(--foreground-muted)] text-sm font-medium truncate max-w-md">
              {title}
            </h1>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
