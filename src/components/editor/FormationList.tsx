'use client'

import { useState } from 'react'
import { Formation, Position, Member } from '@/types'
import { formatTime, cn } from '@/lib/utils'
import { TEMPLATES, TemplateType, getTemplatePositions } from '@/lib/formation-templates'

interface EditorFormation extends Omit<Formation, 'positions'> {
  positions: (Position & { member: Member })[]
}

interface FormationListProps {
  formations: EditorFormation[]
  currentFormationId: string | null
  onFormationSelect: (formationId: string) => void
  onFormationAdd: (template: TemplateType | 'inherit') => void
  onFormationDelete: (formationId: string) => void
  onFormationTimeChange: (formationId: string, time: number) => void
  onFormationNameChange: (formationId: string, name: string) => void
}

// テンプレートのミニプレビュー SVG
const PREVIEW_COUNT = 7
function TemplateDots({ template }: { template: TemplateType }) {
  const pts = getTemplatePositions(template, PREVIEW_COUNT)
  return (
    <svg viewBox="0 0 100 65" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y * 0.65} r="5" fill="currentColor" opacity="0.85" />
      ))}
    </svg>
  )
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
  const [showTemplates, setShowTemplates] = useState(false)

  const handleSelectTemplate = (template: TemplateType | 'inherit') => {
    onFormationAdd(template)
    setShowTemplates(false)
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]">
          Formations
        </h3>

        {/* テンプレートピッカートリガー */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200"
            style={{
              background: showTemplates
                ? 'linear-gradient(135deg,#FF2D78,#7C3AED)'
                : 'rgba(255,45,120,0.12)',
              color: showTemplates ? '#fff' : '#FF6BA8',
              border: '1px solid rgba(255,45,120,0.25)',
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>

          {/* テンプレートグリッド */}
          {showTemplates && (
            <>
              {/* backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />

              <div
                className="absolute right-0 top-full mt-2 z-50 rounded-3xl p-3 w-64"
                style={{
                  backdropFilter: 'blur(24px) saturate(160%)',
                  background: 'rgba(14,11,38,0.95)',
                  border: '1px solid rgba(255,45,120,0.2)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 40px rgba(255,45,120,0.08)',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--foreground-muted)] mb-2.5 px-1">
                  テンプレートを選択
                </p>

                {/* 引き継ぐボタン（優先表示） */}
                <button
                  onClick={() => handleSelectTemplate('inherit')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl mb-2 text-xs font-bold tracking-wide transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(124,58,237,0.2))',
                    border: '1px solid rgba(255,45,120,0.35)',
                    color: '#FF6BA8',
                  }}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  直前のフォーメーションを<br />引き継ぐ
                </button>

                <p className="text-[9px] text-[var(--foreground-muted)] opacity-50 mb-2 px-1">または テンプレートから作成</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {TEMPLATES.map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-150 hover:-translate-y-0.5 group"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,45,120,0.1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,45,120,0.12)'
                        e.currentTarget.style.borderColor = 'rgba(255,45,120,0.35)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.borderColor = 'rgba(255,45,120,0.1)'
                      }}
                    >
                      <div className="w-full aspect-video text-[#FF6BA8] group-hover:text-white transition-colors">
                        <TemplateDots template={tmpl.id} />
                      </div>
                      <span className="text-[9px] font-semibold tracking-wide text-[var(--foreground-muted)] group-hover:text-[#FF6BA8] transition-colors whitespace-nowrap">
                        {tmpl.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto px-1 py-1">
        {formations.length === 0 ? (
          <p className="text-[var(--foreground-muted)] text-sm text-center py-4">
            「追加」からフォーメーションを作成してください。
          </p>
        ) : (
          formations.map((formation, index) => (
            <div
              key={formation.id}
              className={cn(
                'p-3 rounded-2xl cursor-pointer transition-all duration-200',
                currentFormationId === formation.id
                  ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 ring-2 ring-pink-400/50 shadow-lg shadow-pink-500/10'
                  : 'bg-[var(--background-tertiary)]/50 hover:bg-[var(--background-tertiary)]'
              )}
              onClick={() => onFormationSelect(formation.id)}
            >
              <div className="flex items-center gap-3">
                {/* 番号 */}
                <div className="w-6 h-6 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-xs text-[var(--foreground)] font-medium flex-shrink-0">
                  {index + 1}
                </div>

                {/* 名前入力 */}
                <input
                  type="text"
                  value={formation.name || ''}
                  onChange={(e) => onFormationNameChange(formation.id, e.target.value)}
                  placeholder="フォーメーション名"
                  className="flex-1 bg-transparent text-[var(--foreground)] text-sm border-none outline-none placeholder:text-[var(--foreground-muted)] min-w-0"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* 時間入力 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={Math.round(formation.time)}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || /^\d*$/.test(value)) {
                        const num = parseInt(value, 10)
                        if (!isNaN(num) && num >= 0) {
                          onFormationTimeChange(formation.id, num)
                        } else if (value === '') {
                          onFormationTimeChange(formation.id, 0)
                        }
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-16 px-2 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] text-xs rounded-2xl border border-[var(--card-border)] outline-none text-center focus:border-pink-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[var(--foreground-muted)] text-xs">秒</span>
                </div>

                {/* 削除ボタン */}
                <button
                  onClick={(e) => { e.stopPropagation(); onFormationDelete(formation.id) }}
                  className="p-1 text-[var(--foreground-muted)] hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* ミニプレビュー */}
              <div className="mt-2 h-8 bg-[var(--card-bg)] rounded relative overflow-hidden">
                {formation.positions.map((pos) => (
                  <div
                    key={pos.memberId}
                    className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, backgroundColor: pos.member.color }}
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
