'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Member } from '@/types'
import { cn } from '@/lib/utils'

interface DraggableMemberIconProps {
  member: Member
  x: number
  y: number
  isSelected?: boolean
  onPositionChange: (x: number, y: number) => void
  onClick?: () => void
}

export function DraggableMemberIcon({
  member,
  x,
  y,
  isSelected,
  onPositionChange,
  onClick,
}: DraggableMemberIconProps) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const parent = containerRef.current.parentElement
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      const newX = ((e.clientX - rect.left) / rect.width) * 100
      const newY = ((e.clientY - rect.top) / rect.height) * 100

      const clampedX = Math.max(5, Math.min(95, newX))
      const clampedY = Math.max(5, Math.min(95, newY))

      onPositionChange(clampedX, clampedY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onPositionChange])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }, [onClick])

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute flex flex-col items-center cursor-grab select-none',
        '-translate-x-1/2 -translate-y-1/2',
        isDragging && 'cursor-grabbing z-50'
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* アイコン円 */}
      <motion.div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          'text-white font-bold text-sm shadow-lg',
        )}
        style={{
          backgroundColor: member.color,
          boxShadow: isSelected
            ? `0 0 0 3px white, 0 0 0 5px ${member.color}, 0 4px 16px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
        animate={
          isDragging
            ? { scale: 1.1 }
            : isSelected
            ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }
            : { scale: 1 }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {member.name.charAt(0)}
      </motion.div>

      {/* 名前ラベル */}
      <div
        className={cn(
          'mt-1 px-2 py-0.5 rounded-lg text-xs font-medium',
          'bg-black/70 text-white whitespace-nowrap',
          isSelected && 'bg-gradient-to-r from-pink-500/80 to-violet-500/80'
        )}
      >
        {member.name}
      </div>

      {/* 座標表示（ドラッグ中） */}
      {isDragging && (
        <div className="absolute -bottom-6 text-xs text-white/60 whitespace-nowrap">
          ({Math.round(x)}, {Math.round(y)})
        </div>
      )}
    </div>
  )
}
