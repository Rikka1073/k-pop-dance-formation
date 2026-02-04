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
    <motion.div
      className={cn(
        'absolute flex flex-col items-center cursor-pointer',
        'transform -translate-x-1/2 -translate-y-1/2'
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onClick={onClick}
    >
      {/* アイコン円 */}
      <motion.div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          'text-white font-bold text-sm shadow-lg',
          'transition-all duration-200'
        )}
        style={{
          backgroundColor: member.color,
          boxShadow: isSelected
            ? `0 0 0 3px white, 0 0 0 5px ${member.color}, 0 4px 12px rgba(0,0,0,0.3)`
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {member.name.charAt(0)}
      </motion.div>

      {/* 名前ラベル */}
      <div
        className={cn(
          'mt-1 px-2 py-0.5 rounded text-xs font-medium',
          'bg-black/70 text-white whitespace-nowrap'
        )}
      >
        {member.name}
      </div>
    </motion.div>
  )
}
