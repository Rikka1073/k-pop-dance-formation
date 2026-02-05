'use client'

import { useState, useRef, useEffect } from 'react'
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

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    if (!containerRef.current) return

    const parent = containerRef.current.parentElement
    if (!parent) return

    const rect = parent.getBoundingClientRect()
    const newX = ((info.point.x - rect.left) / rect.width) * 100
    const newY = ((info.point.y - rect.top) / rect.height) * 100

    // Clamp values between 5 and 95 to keep icons visible
    const clampedX = Math.max(5, Math.min(95, newX))
    const clampedY = Math.max(5, Math.min(95, newY))

    onPositionChange(clampedX, clampedY)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'absolute flex flex-col items-center cursor-grab',
        '-translate-x-1/2 -translate-y-1/2',
        isDragging && 'cursor-grabbing z-50'
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation()
          onClick?.()
        }
      }}
      whileDrag={{ scale: 1.1 }}
    >
      {/* アイコン円 */}
      <motion.div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          'text-white font-bold text-sm shadow-lg',
          'border-2 border-white/50'
        )}
        style={{
          backgroundColor: member.color,
          boxShadow: isSelected
            ? `0 0 0 3px white, 0 0 0 5px ${member.color}, 0 4px 12px rgba(0,0,0,0.3)`
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
        whileHover={{ scale: 1.05 }}
      >
        {member.name.charAt(0)}
      </motion.div>

      {/* 名前ラベル */}
      <div
        className={cn(
          'mt-1 px-2 py-0.5 rounded text-xs font-medium',
          'bg-black/80 text-white whitespace-nowrap'
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
    </motion.div>
  )
}
