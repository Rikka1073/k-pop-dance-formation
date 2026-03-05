'use client'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 3つのドットが順番に跳ねるアニメーション */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-violet-500"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-sm text-[var(--foreground-muted)]">読み込み中...</p>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
