'use client'

import { motion } from 'framer-motion'
import { Member } from '@/types'
import { cn } from '@/lib/utils'

interface MemberIconProps {
  member: Member
  x: number
  y: number
  isSelected?: boolean
  onClick?: () => void
}

export function MemberIcon({ member, x, y, isSelected, onClick }: MemberIconProps) {
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
          'w-10 h-10 rounded-full flex items-center justify-center',
          'text-white font-bold text-sm shadow-lg'
        )}
        style={{
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
          'mt-1 px-2 py-0.5 rounded-lg text-xs font-medium',
          'bg-black/70 text-white whitespace-nowrap',
          isSelected && 'bg-gradient-to-r from-pink-500/80 to-violet-500/80'
        )}
      >
        {member.name}
      </div>
    </div>
  )
}
