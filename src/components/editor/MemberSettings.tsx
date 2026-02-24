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
                <div className="relative group/color flex-shrink-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full border-2 border-white/30',
                      !readOnly && 'cursor-pointer'
                    )}
                    style={{ backgroundColor: member.color }}
                  />
                  {!readOnly && (
                    <>
                      {/* ホバー時のペンアイコン */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <input
                        type="color"
                        value={member.color}
                        onChange={(e) =>
                          onMemberUpdate(member.id, { color: e.target.value })
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
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
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-[var(--foreground-muted)] mb-1.5">カラー選択</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          'w-6 h-6 rounded-full transition-transform hover:scale-110',
                          member.color === color && 'ring-2 ring-white ring-offset-2 ring-offset-[var(--card-bg)]'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => onMemberUpdate(member.id, { color })}
                      />
                    ))}
                    {/* カスタムカラー */}
                    <div className="relative group/custom">
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-[var(--foreground-muted)] flex items-center justify-center hover:border-pink-400 transition-colors cursor-pointer">
                        <svg className="w-3 h-3 text-[var(--foreground-muted)] group-hover/custom:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <input
                        type="color"
                        value={member.color}
                        onChange={(e) => onMemberUpdate(member.id, { color: e.target.value })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
