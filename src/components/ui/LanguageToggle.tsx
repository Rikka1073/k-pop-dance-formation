'use client'

interface LanguageToggleProps {
  lang: 'ja' | 'en'
  onToggle: (lang: 'ja' | 'en') => void
}

export function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onToggle('ja')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          lang === 'ja'
            ? 'bg-pink-500 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        日本語
      </button>
      <button
        onClick={() => onToggle('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          lang === 'en'
            ? 'bg-pink-500 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        English
      </button>
    </div>
  )
}
