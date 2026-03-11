'use client'

import { Formation, InterpolatedPosition } from '@/types'
import { MemberIcon } from './MemberIcon'
import { MovementArrow } from './MovementArrow'

interface FormationStageProps {
  positions: InterpolatedPosition[]
  nextFormation: Formation | null
  selectedMemberId: string | null
  showMovementArrows: boolean
  onMemberClick?: (memberId: string) => void
  flipped?: boolean
}

export function FormationStage({
  positions,
  nextFormation,
  selectedMemberId,
  showMovementArrows,
  onMemberClick,
  flipped = true,
}: FormationStageProps) {
  // メンバー数に応じてアイコンサイズを決定
  const iconSize = positions.length <= 6 ? 44 : positions.length <= 9 ? 36 : positions.length <= 12 ? 30 : 24

  // flipped=true → 観客視点: Y軸反転 (FRONT=下, BACK=上)
  const transformY = (y: number) => flipped ? 100 - y : y

  const frontY = flipped ? 100 : 0
  const backY  = flipped ? 0   : 100

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, var(--stage-bg), var(--stage-bg-secondary))' }}
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
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.4"
          />
        ))}

        {/* 縦グリッドライン */}
        {[25, 50, 75].map(x => (
          <line key={x}
            x1={x} y1={0} x2={x} y2={100}
            stroke={x === 50 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}
            strokeWidth={x === 50 ? '0.6' : '0.4'}
          />
        ))}

        {/* ステージ外枠 */}
        <rect
          x={0} y={0} width={100} height={100}
          fill="none"
          stroke="rgba(255,45,120,0.22)"
          strokeWidth="0.6"
          strokeDasharray="3 2"
        />

        {/* FRONT ライン */}
        <line
          x1={0} y1={frontY}
          x2={100} y2={frontY}
          stroke="rgba(255,45,120,0.45)" strokeWidth="1"
        />
      </svg>

      {/* BACK ラベル */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[var(--foreground-muted)] opacity-40"
        style={{ top: backY === 0 ? '5px' : 'auto', bottom: backY === 100 ? '5px' : 'auto' }}
      >
        BACK
      </div>

      {/* FRONT ラベル */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[#FF6BA8] opacity-60"
        style={{ top: frontY === 0 ? '5px' : 'auto', bottom: frontY === 100 ? '5px' : 'auto' }}
      >
        FRONT
      </div>

      {/* L / R ラベル */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[var(--foreground-muted)] opacity-30">L</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[var(--foreground-muted)] opacity-30">R</div>

      {/* 動線矢印 */}
      {showMovementArrows && nextFormation &&
        positions.map((pos) => {
          const nextPos = nextFormation.positions.find(p => p.memberId === pos.memberId)
          if (!nextPos) return null
          return (
            <MovementArrow
              key={`arrow-${pos.memberId}`}
              fromX={pos.x}
              fromY={transformY(pos.y)}
              toX={nextPos.x}
              toY={transformY(nextPos.y)}
              member={pos.member}
              isHighlighted={selectedMemberId === pos.memberId}
            />
          )
        })}

      {/* メンバーアイコン */}
      {positions.map((pos) => (
        <MemberIcon
          key={pos.memberId}
          member={pos.member}
          x={pos.x}
          y={transformY(pos.y)}
          isSelected={selectedMemberId === pos.memberId}
          size={iconSize}
          onClick={() => onMemberClick?.(pos.memberId)}
        />
      ))}

      {/* drag to move ヒント */}
      <div className="absolute bottom-2 right-3 text-[8px] text-[var(--foreground-muted)] opacity-20">drag to move</div>
    </div>
  )
}
