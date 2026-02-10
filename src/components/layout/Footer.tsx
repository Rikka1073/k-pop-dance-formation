import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 K-POP Formation Viewer
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-pink-400 text-sm transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-pink-400 text-sm transition-colors"
            >
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
