'use client'

import { Member } from '@/types'
import { cn } from '@/lib/utils'

interface MemberListProps {
  members: Member[]
  selectedMemberId: string | null
  onMemberSelect: (memberId: string | null) => void
}

export function MemberList({ members, selectedMemberId, onMemberSelect }: MemberListProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span className="text-pink-400">Members</span>
        <span className="text-xs text-gray-500">({members.length})</span>
      </h3>
      <div className="space-y-2">
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id

          return (
            <button
              key={member.id}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200',
                isSelected
                  ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 ring-2 ring-pink-400/50 shadow-lg shadow-pink-500/10'
                  : 'bg-white/5 hover:bg-white/10 hover:-translate-x-1'
              )}
              onClick={() => onMemberSelect(isSelected ? null : member.id)}
            >
              {/* カラーアイコン */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-transform duration-200',
                  isSelected && 'scale-110'
                )}
                style={{
                  backgroundColor: member.color,
                  boxShadow: isSelected ? `0 0 12px ${member.color}` : 'none'
                }}
              >
                {member.name.charAt(0)}
              </div>

              {/* 名前 */}
              <span className={cn(
                'text-sm font-medium transition-colors',
                isSelected ? 'text-pink-300' : 'text-white'
              )}>{member.name}</span>

              {/* 選択インジケーター */}
              {isSelected && (
                <span className="ml-auto text-xs text-pink-400/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  Selected
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 選択解除ボタン */}
      {selectedMemberId && (
        <button
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-pink-400 rounded-xl hover:bg-white/5 transition-all duration-200"
          onClick={() => onMemberSelect(null)}
        >
          Clear Selection
        </button>
      )}
    </div>
  )
}
