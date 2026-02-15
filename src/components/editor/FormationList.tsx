'use client'

import { Formation, Position, Member } from '@/types'
import { formatTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface EditorFormation extends Omit<Formation, 'positions'> {
  positions: (Position & { member: Member })[]
}

interface FormationListProps {
  formations: EditorFormation[]
  currentFormationId: string | null
  onFormationSelect: (formationId: string) => void
  onFormationAdd: () => void
  onFormationDelete: (formationId: string) => void
  onFormationTimeChange: (formationId: string, time: number) => void
  onFormationNameChange: (formationId: string, name: string) => void
}

export function FormationList({
  formations,
  currentFormationId,
  onFormationSelect,
  onFormationAdd,
  onFormationDelete,
  onFormationTimeChange,
  onFormationNameChange,
}: FormationListProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-pink-400 font-semibold">フォーメーション</h3>
        <Button size="sm" onClick={onFormationAdd}>
          + 追加
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {formations.length === 0 ? (
          <p className="text-[var(--foreground-muted)] text-sm text-center py-4">
            フォーメーションがありません。「+ 追加」をクリックして作成してください。
          </p>
        ) : (
          formations.map((formation, index) => (
            <div
              key={formation.id}
              className={cn(
                'p-3 rounded-xl cursor-pointer transition-all duration-200',
                currentFormationId === formation.id
                  ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 ring-2 ring-pink-400/50'
                  : 'bg-[var(--background-tertiary)]/50 hover:bg-[var(--background-tertiary)]'
              )}
              onClick={() => onFormationSelect(formation.id)}
            >
              <div className="flex items-center gap-3">
                {/* 番号 */}
                <div className="w-6 h-6 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-xs text-[var(--foreground)] font-medium">
                  {index + 1}
                </div>

                {/* 名前入力 */}
                <input
                  type="text"
                  value={formation.name || ''}
                  onChange={(e) => onFormationNameChange(formation.id, e.target.value)}
                  placeholder="フォーメーション名"
                  className="flex-1 bg-transparent text-[var(--foreground)] text-sm border-none outline-none placeholder:text-[var(--foreground-muted)]"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* 時間入力 */}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formation.time}
                    onChange={(e) => {
                      const value = e.target.value
                      // 数字とドットのみ許可
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        const num = parseFloat(value)
                        if (!isNaN(num) && num >= 0) {
                          onFormationTimeChange(formation.id, num)
                        } else if (value === '' || value === '.') {
                          onFormationTimeChange(formation.id, 0)
                        }
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-20 px-2 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] text-sm rounded-lg border border-[var(--card-border)] outline-none text-center focus:border-pink-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[var(--foreground-muted)] text-xs">秒</span>
                </div>

                {/* 削除ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFormationDelete(formation.id)
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              {/* ミニプレビュー */}
              <div className="mt-2 h-8 bg-[var(--card-bg)] rounded relative overflow-hidden">
                {formation.positions.map((pos) => (
                  <div
                    key={pos.memberId}
                    className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      backgroundColor: pos.member.color,
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
