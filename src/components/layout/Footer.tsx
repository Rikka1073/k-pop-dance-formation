import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--foreground-muted)] text-sm">
            © 2025 K-POP Formation Viewer
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-[var(--foreground-muted)] hover:text-pink-400 text-sm transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-[var(--foreground-muted)] hover:text-pink-400 text-sm transition-colors"
            >
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
