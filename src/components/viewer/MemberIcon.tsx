'use client'

import { motion } from 'framer-motion'
import { Member } from '@/types'
import { cn } from '@/lib/utils'

interface MemberIconProps {
  member: Member
  x: number
  y: number
  isSelected?: boolean
  size?: number
  onClick?: () => void
}

export function MemberIcon({ member, x, y, isSelected, size = 40, onClick }: MemberIconProps) {
  const fontSize = size >= 40 ? 14 : size >= 32 ? 12 : 10
  return (
    <div
      className={cn(
        'absolute flex flex-col items-center cursor-pointer',
        'transition-all duration-500 ease-in-out',
        '-translate-x-1/2 -translate-y-1/2'
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={onClick}
    >
      {/* アイコン円 */}
      <motion.div
        className={cn(
          'rounded-full flex items-center justify-center',
          'text-black font-bold shadow-lg'
        )}
        style={{
          width: size,
          height: size,
          fontSize,
          backgroundColor: member.color,
          boxShadow: isSelected
            ? `0 0 0 3px white, 0 0 0 5px ${member.color}, 0 4px 16px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
        whileHover={{
          scale: 1.15,
          rotate: [0, -5, 5, -5, 0],
          transition: { rotate: { duration: 0.4 } }
        }}
        whileTap={{ scale: 0.95 }}
        animate={isSelected ? {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 2 }
        } : {}}
      >
        {member.name.charAt(0)}
      </motion.div>

      {/* 名前ラベル */}
      <div
        className={cn(
          'mt-0.5 px-1.5 py-0.5 rounded-lg font-medium',
          'bg-black/70 text-white whitespace-nowrap',
          isSelected && 'bg-gradient-to-r from-pink-500/80 to-violet-500/80'
        )}
        style={{ fontSize: fontSize - 2 }}
      >
        {member.name}
      </div>
    </div>
  )
}
