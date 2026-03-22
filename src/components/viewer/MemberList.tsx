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
    <div
      className="rounded-3xl p-4"
      style={{
        backdropFilter: 'blur(24px) saturate(160%)',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,45,120,0.16)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]">
          Members
        </h3>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,45,120,0.12)', color: '#FF6BA8', border: '1px solid rgba(255,45,120,0.2)' }}
        >
          {members.length}
        </span>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-64 pr-1">
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id

          return (
            <button
              key={member.id}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left',
                isSelected ? '' : 'hover:-translate-x-0.5'
              )}
              style={isSelected ? {
                background: `linear-gradient(135deg, ${member.color}18, rgba(124,58,237,0.12))`,
                border: `1px solid ${member.color}50`,
                boxShadow: `0 0 16px ${member.color}20`,
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid transparent',
              }}
              onClick={() => onMemberSelect(isSelected ? null : member.id)}
            >
              {/* カラーアイコン */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-black font-black text-xs flex-shrink-0 transition-all duration-200"
                style={{
                  backgroundColor: member.color,
                  boxShadow: isSelected ? `0 0 14px ${member.color}80, 0 0 4px ${member.color}` : `0 0 0 ${member.color}00`,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {member.name.charAt(0)}
              </div>

              {/* 名前 */}
              <span className={cn(
                'text-sm font-semibold transition-colors flex-1 truncate tracking-wide',
                isSelected ? 'text-white' : 'text-[var(--foreground-muted)]'
              )}>
                {member.name}
              </span>

              {/* 選択インジケーター */}
              {isSelected && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: member.color, boxShadow: `0 0 6px ${member.color}`, animation: 'neon-pulse 2s ease infinite' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* 選択解除ボタン */}
      {selectedMemberId && (
        <button
          className="w-full mt-3 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-2xl hover:bg-white/[0.04]"
          style={{ color: 'var(--foreground-muted)', borderTop: '1px solid rgba(255,45,120,0.1)', marginTop: '12px', paddingTop: '12px' }}
          onClick={() => onMemberSelect(null)}
        >
          選択解除
        </button>
      )}
    </div>
  )
}
