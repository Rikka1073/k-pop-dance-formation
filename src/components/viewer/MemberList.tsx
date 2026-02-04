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
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Members</h3>
      <div className="space-y-2">
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id

          return (
            <button
              key={member.id}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg transition-all',
                isSelected
                  ? 'bg-white/20 ring-2 ring-white/50'
                  : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => onMemberSelect(isSelected ? null : member.id)}
            >
              {/* カラーアイコン */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: member.color }}
              >
                {member.name.charAt(0)}
              </div>

              {/* 名前 */}
              <span className="text-white text-sm font-medium">{member.name}</span>

              {/* 選択インジケーター */}
              {isSelected && (
                <span className="ml-auto text-xs text-white/60">Selected</span>
              )}
            </button>
          )
        })}
      </div>

      {/* 選択解除ボタン */}
      {selectedMemberId && (
        <button
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          onClick={() => onMemberSelect(null)}
        >
          Clear Selection
        </button>
      )}
    </div>
  )
}
