'use client'

import Link from 'next/link'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💃</span>
          <span className="text-white font-bold text-lg">Formation Viewer</span>
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
