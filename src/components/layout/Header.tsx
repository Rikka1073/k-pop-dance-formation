'use client'

import Link from 'next/link'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-2xl group-hover:animate-pulse">✨</span>
          <span className="text-pink-400 font-bold text-lg">Formation</span>
          <span className="text-violet-400 font-bold text-lg">Viewer</span>
          <span className="text-2xl group-hover:animate-pulse">💫</span>
        </Link>

        {title && (
          <h1 className="text-white/80 text-sm font-medium truncate max-w-md">
            {title}
          </h1>
        )}
      </div>
    </header>
  )
}
