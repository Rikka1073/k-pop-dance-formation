'use client'

import { useState, useEffect } from 'react'

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // セッション中に一度だけ表示
    const shown = sessionStorage.getItem('splashShown')
    if (shown) return

    setVisible(true)
    sessionStorage.setItem('splashShown', '1')

    const fadeTimer = setTimeout(() => setFadeOut(true), 1600)
    const hideTimer = setTimeout(() => setVisible(false), 2100)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: '#08051A',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* 背景グロー */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #FF2D78 0%, #7C3AED 60%, transparent 100%)' }}
      />

      {/* ロゴ */}
      <div className="relative flex flex-col items-center gap-4">
        {/* アイコン */}
        <div className="relative w-16 h-16 mb-2">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #FF2D78, #7C3AED)', boxShadow: '0 0 40px rgba(255,45,120,0.5), 0 0 80px rgba(124,58,237,0.3)' }}
          />
          <svg className="relative w-16 h-16 p-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="5"  cy="12" r="2.2" fill="currentColor" strokeWidth="0" />
            <circle cx="12" cy="7"  r="2.2" fill="currentColor" strokeWidth="0" />
            <circle cx="19" cy="12" r="2.2" fill="currentColor" strokeWidth="0" />
            <circle cx="12" cy="17" r="2.2" fill="currentColor" strokeWidth="0" />
            <path strokeLinecap="round" strokeWidth="1.2" d="M5 12 L12 7 L19 12 L12 17 Z" opacity="0.5" />
          </svg>
        </div>

        {/* テキスト */}
        <div className="text-center leading-none">
          <div className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8B9CB8] mb-1">K-POP</div>
          <div
            className="text-3xl font-black tracking-[0.08em] uppercase"
            style={{ background: 'linear-gradient(90deg, #FF2D78, #c084fc, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Formation Viewer
          </div>
        </div>

        {/* ローディングドット */}
        <div className="flex items-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FF2D78, #7C3AED)',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
