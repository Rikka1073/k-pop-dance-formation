'use client'

import { Member, Position } from '@/types'
import { DraggableMemberIcon } from './DraggableMemberIcon'

interface EditorPosition extends Position {
  member: Member
}

interface EditorStageProps {
  positions: EditorPosition[]
  selectedMemberId: string | null
  onPositionChange: (memberId: string, x: number, y: number) => void
  onMemberSelect: (memberId: string | null) => void
  flipped?: boolean
}

export function EditorStage({
  positions,
  selectedMemberId,
  onPositionChange,
  onMemberSelect,
  flipped = true,
}: EditorStageProps) {
  // メンバー数に応じてアイコンサイズを決定
  const iconSize = positions.length <= 6 ? 48 : positions.length <= 9 ? 40 : positions.length <= 12 ? 32 : 26

  // flipped=true → 観客視点: Y軸反転 (FRONT=下, BACK=上)
  const transformY        = (y: number) => flipped ? 100 - y : y
  const inverseTransformY = (y: number) => flipped ? 100 - y : y

  const frontY = flipped ? 100 : 0
  const backY  = flipped ? 0   : 100

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-dashed border-[var(--card-border)]"
      style={{ background: 'linear-gradient(to bottom, var(--stage-bg), var(--stage-bg-secondary))' }}
      onClick={() => onMemberSelect(null)}
    >
      {/* グリッド */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 横グリッドライン */}
        {[20, 40, 60, 80].map(y => (
          <line key={y}
            x1={0} y1={y} x2={100} y2={y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.4"
          />
        ))}

        {/* 縦グリッドライン */}
        {[25, 50, 75].map(x => (
          <line key={x}
            x1={x} y1={0} x2={x} y2={100}
            stroke={x === 50 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}
            strokeWidth={x === 50 ? '0.7' : '0.4'}
          />
        ))}

        {/* ステージ外枠 */}
        <rect
          x={0} y={0} width={100} height={100}
          fill="none"
          stroke="rgba(255,45,120,0.3)"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />

        {/* FRONT ライン */}
        <line
          x1={0} y1={frontY}
          x2={100} y2={frontY}
          stroke="rgba(255,45,120,0.55)" strokeWidth="1.2"
        />
      </svg>

      {/* ラベル */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[var(--foreground-muted)] opacity-40"
        style={{ top: backY === 0 ? '5px' : 'auto', bottom: backY === 100 ? '5px' : 'auto' }}
      >
        BACK
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[#FF6BA8] opacity-70"
        style={{ top: frontY === 0 ? '5px' : 'auto', bottom: frontY === 100 ? '5px' : 'auto' }}
      >
        FRONT
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] opacity-35 -rotate-90">L</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] opacity-35 rotate-90">R</div>

      {/* ドラッグ可能アイコン */}
      {positions.map((pos) => {
        const dY = transformY(pos.y)
        return (
          <DraggableMemberIcon
            key={pos.memberId}
            member={pos.member}
            x={pos.x}
            y={dY}
            isSelected={selectedMemberId === pos.memberId}
            size={iconSize}
            onPositionChange={(displayX, displayY) => {
              const logicalX = Math.max(0, Math.min(100, displayX))
              const logicalY = inverseTransformY(displayY)
              onPositionChange(pos.memberId, logicalX, logicalY)
            }}
            onClick={() => onMemberSelect(pos.memberId)}
          />
        )
      })}

      {/* ヒント */}
      <div className="absolute bottom-2 right-2 text-[9px] text-[var(--foreground-muted)] opacity-35 tracking-wider">
        drag to move
      </div>
    </div>
  )
}
