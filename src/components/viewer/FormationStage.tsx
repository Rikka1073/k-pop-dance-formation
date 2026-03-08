'use client'

import { Formation, InterpolatedPosition } from '@/types'
import { MemberIcon } from './MemberIcon'
import { MovementArrow } from './MovementArrow'

// 奥行き: 奥は手前の何割の幅か
const PERSPECTIVE_RATIO = 0.55
const BACK_OFFSET = ((1 - PERSPECTIVE_RATIO) / 2) * 100 // 22.5

/** 論理 X (0-100) → 表示 X (0-100) */
function pX(logicalX: number, displayY: number, flipped: boolean): number {
  // flipped=true: FRONTが上(displayY=0)→wide, flipped=false: FRONTが下(displayY=100)→wide
  const frontFactor = flipped ? (100 - displayY) / 100 : displayY / 100
  const scale = PERSPECTIVE_RATIO + (1 - PERSPECTIVE_RATIO) * frontFactor
  const offset = ((1 - scale) / 2) * 100
  return offset + logicalX * scale
}

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
  const transformY = (y: number) => flipped ? 100 - y : y

  // SVG座標 (viewBox 0 0 100 100 で統一)
  // flipped=true → FRONT上(y=0), BACK下(y=100)
  // flipped=false → FRONT下(y=100), BACK上(y=0)
  const backY  = flipped ? 100 : 0
  const frontY = flipped ? 0   : 100

  // 台形頂点: FRONT側が幅広(100%), BACK側が幅狭(55%)
  const trapPoints = flipped
    ? `0,0 100,0 ${100 - BACK_OFFSET},100 ${BACK_OFFSET},100`
    : `${BACK_OFFSET},0 ${100 - BACK_OFFSET},0 100,100 0,100`

  // 台形外シェードの三角形 (BACK側コーナー)
  const shadeLPoints = flipped
    ? `0,0 0,100 ${BACK_OFFSET},100`
    : `0,0 ${BACK_OFFSET},0 0,100`
  const shadeRPoints = flipped
    ? `100,0 100,100 ${100 - BACK_OFFSET},100`
    : `${100 - BACK_OFFSET},0 100,0 100,100`

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, var(--stage-bg), var(--stage-bg-secondary))' }}
    >
      {/* ━━━ パース付きグリッド (viewBox 0 0 100 100, preserveAspectRatio=none) ━━━ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 台形外シェード */}
        <polygon points={shadeLPoints} fill="rgba(0,0,0,0.38)" />
        <polygon points={shadeRPoints} fill="rgba(0,0,0,0.38)" />

        {/* 横パースライン (Y=20,40,60,80) */}
        {[20, 40, 60, 80].map(dY => {
          const ff  = flipped ? (100 - dY) / 100 : dY / 100
          const sc  = PERSPECTIVE_RATIO + (1 - PERSPECTIVE_RATIO) * ff
          const off = ((1 - sc) / 2) * 100
          return (
            <line key={dY}
              x1={off} y1={dY} x2={100 - off} y2={dY}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.4"
            />
          )
        })}

        {/* 縦収束ライン (logicalX=25, 50, 75) */}
        {[25, 50, 75].map(lX => {
          const xFront = lX
          const xBack  = BACK_OFFSET + lX * PERSPECTIVE_RATIO
          return (
            <line key={lX}
              x1={flipped ? xFront : xBack}  y1={frontY}
              x2={flipped ? xBack  : xFront} y2={backY}
              stroke={lX === 50 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={lX === 50 ? '0.6' : '0.4'}
            />
          )
        })}

        {/* 台形アウトライン */}
        <polygon
          points={trapPoints}
          fill="none"
          stroke="rgba(255,45,120,0.22)"
          strokeWidth="0.6"
          strokeDasharray="3 2"
        />

        {/* FRONT ライン (ピンク強め) - FRONT端は常に全幅 */}
        <line
          x1={0} y1={frontY}
          x2={100} y2={frontY}
          stroke="rgba(255,45,120,0.45)" strokeWidth="1"
        />
      </svg>

      {/* BACK ラベル: flipped=true→下, flipped=false→上 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[var(--foreground-muted)] opacity-40"
        style={{ top: flipped ? 'auto' : '5px', bottom: flipped ? '5px' : 'auto' }}
      >
        BACK
      </div>
      {/* FRONT ラベル: flipped=true→上, flipped=false→下 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[#FF6BA8] opacity-60"
        style={{ top: flipped ? '5px' : 'auto', bottom: flipped ? 'auto' : '5px' }}
      >
        FRONT
      </div>

      {/* 動線矢印 */}
      {showMovementArrows && nextFormation &&
        positions.map((pos) => {
          const nextPos = nextFormation.positions.find(p => p.memberId === pos.memberId)
          if (!nextPos) return null
          const dY1 = transformY(pos.y)
          const dY2 = transformY(nextPos.y)
          return (
            <MovementArrow
              key={`arrow-${pos.memberId}`}
              fromX={pX(pos.x, dY1, flipped)}
              fromY={dY1}
              toX={pX(nextPos.x, dY2, flipped)}
              toY={dY2}
              member={pos.member}
              isHighlighted={selectedMemberId === pos.memberId}
            />
          )
        })}

      {/* メンバーアイコン */}
      {positions.map((pos) => {
        const dY = transformY(pos.y)
        const dX = pX(pos.x, dY, flipped)
        return (
          <MemberIcon
            key={pos.memberId}
            member={pos.member}
            x={dX}
            y={dY}
            isSelected={selectedMemberId === pos.memberId}
            onClick={() => onMemberClick?.(pos.memberId)}
          />
        )
      })}
    </div>
  )
}
