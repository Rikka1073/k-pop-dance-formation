'use client'

import { Member } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface MemberSettingsProps {
  members: Member[]
  selectedMemberId: string | null
  onMemberSelect: (memberId: string | null) => void
  onMemberAdd: () => void
  onMemberUpdate: (memberId: string, updates: { name?: string; color?: string }) => void
  onMemberDelete: (memberId: string) => void
  readOnly?: boolean
}

const PRESET_COLORS = [
  '#FF6B9D', // ピンク
  '#4ECDC4', // ティール
  '#FFE66D', // イエロー
  '#95E1D3', // ミント
  '#FF8B5A', // オレンジ
  '#B8A9C9', // ラベンダー
  '#88D8B0', // グリーン
  '#FFAAA5', // コーラル
]

export function MemberSettings({
  members,
  selectedMemberId,
  onMemberSelect,
  onMemberAdd,
  onMemberUpdate,
  onMemberDelete,
  readOnly = false,
}: MemberSettingsProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-pink-400 font-semibold">
          メンバー
          {readOnly && (
            <span className="ml-2 text-xs text-[var(--foreground-muted)] font-normal">
              (読み取り専用)
            </span>
          )}
        </h3>
        {!readOnly && (
          <Button size="sm" variant="secondary" onClick={onMemberAdd}>
            + 追加
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {members.length === 0 ? (
          <p className="text-[var(--foreground-muted)] text-sm text-center py-4">
            {readOnly
              ? 'アーティストを選択してください'
              : 'メンバーがいません。「+ 追加」をクリックして追加してください。'}
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className={cn(
                'p-3 rounded-xl transition-all duration-200',
                selectedMemberId === member.id
                  ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 ring-2 ring-pink-400/50'
                  : 'bg-[var(--background-tertiary)]/50 hover:bg-[var(--background-tertiary)]'
              )}
              onClick={() => onMemberSelect(member.id)}
            >
              <div className="flex items-center gap-3">
                {/* カラー表示 */}
                <div className="relative">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full border-2 border-white/30',
                      !readOnly && 'cursor-pointer'
                    )}
                    style={{ backgroundColor: member.color }}
                  />
                  {!readOnly && (
                    <input
                      type="color"
                      value={member.color}
                      onChange={(e) =>
                        onMemberUpdate(member.id, { color: e.target.value })
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                </div>

                {/* 名前 */}
                {readOnly ? (
                  <span className="flex-1 text-[var(--foreground)] text-sm">{member.name}</span>
                ) : (
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => onMemberUpdate(member.id, { name: e.target.value })}
                    placeholder="メンバー名"
                    className="flex-1 bg-[var(--background-secondary)] text-[var(--foreground)] text-sm px-2 py-1 rounded border-none outline-none"
                  />
                )}

                {/* 削除ボタン */}
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onMemberDelete(member.id)
                    }}
                    className="p-1 text-[var(--foreground-muted)] hover:text-red-400 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* プリセットカラー（編集可能時のみ） */}
              {!readOnly && selectedMemberId === member.id && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        'w-5 h-5 rounded-full transition-transform hover:scale-110',
                        member.color === color && 'ring-2 ring-white ring-offset-2 ring-offset-[var(--card-bg)]'
                      )}
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onMemberUpdate(member.id, { color })
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
