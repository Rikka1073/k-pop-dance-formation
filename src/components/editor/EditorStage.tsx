'use client'

import { Member, Position } from '@/types'
import { DraggableMemberIcon } from './DraggableMemberIcon'

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

/** 表示 X → 論理 X (ドラッグ逆変換) */
function inversePX(displayX: number, displayY: number, flipped: boolean): number {
  const frontFactor = flipped ? (100 - displayY) / 100 : displayY / 100
  const scale = PERSPECTIVE_RATIO + (1 - PERSPECTIVE_RATIO) * frontFactor
  const offset = ((1 - scale) / 2) * 100
  return (displayX - offset) / scale
}

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
  const transformY        = (y: number) => flipped ? 100 - y : y
  const inverseTransformY = (y: number) => flipped ? 100 - y : y

  // flipped=true → FRONT上(y=0), BACK下(y=100)
  // flipped=false → FRONT下(y=100), BACK上(y=0)
  const backY  = flipped ? 100 : 0
  const frontY = flipped ? 0   : 100

  const trapPoints = flipped
    ? `0,0 100,0 ${100 - BACK_OFFSET},100 ${BACK_OFFSET},100`
    : `${BACK_OFFSET},0 ${100 - BACK_OFFSET},0 100,100 0,100`

  const shadeLPoints = flipped
    ? `0,0 0,100 ${BACK_OFFSET},100`
    : `0,0 ${BACK_OFFSET},0 0,100`
  const shadeRPoints = flipped
    ? `100,0 100,100 ${100 - BACK_OFFSET},100`
    : `${100 - BACK_OFFSET},0 100,0 100,100`

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-dashed border-[var(--card-border)]"
      style={{ background: 'linear-gradient(to bottom, var(--stage-bg), var(--stage-bg-secondary))' }}
      onClick={() => onMemberSelect(null)}
    >
      {/* ━━━ パース付きグリッド ━━━ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 台形外シェード */}
        <polygon points={shadeLPoints} fill="rgba(0,0,0,0.38)" />
        <polygon points={shadeRPoints} fill="rgba(0,0,0,0.38)" />

        {/* 横パースライン */}
        {[20, 40, 60, 80].map(dY => {
          const ff  = flipped ? (100 - dY) / 100 : dY / 100
          const sc  = PERSPECTIVE_RATIO + (1 - PERSPECTIVE_RATIO) * ff
          const off = ((1 - sc) / 2) * 100
          return (
            <line key={dY}
              x1={off} y1={dY} x2={100 - off} y2={dY}
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.4"
            />
          )
        })}

        {/* 縦収束ライン */}
        {[25, 50, 75].map(lX => {
          const xFront = lX
          const xBack  = BACK_OFFSET + lX * PERSPECTIVE_RATIO
          return (
            <line key={lX}
              x1={flipped ? xFront : xBack}  y1={frontY}
              x2={flipped ? xBack  : xFront} y2={backY}
              stroke={lX === 50 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}
              strokeWidth={lX === 50 ? '0.7' : '0.4'}
            />
          )
        })}

        {/* 台形アウトライン */}
        <polygon
          points={trapPoints}
          fill="none"
          stroke="rgba(255,45,120,0.3)"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />

        {/* FRONT ライン - FRONT端は常に全幅 */}
        <line
          x1={0} y1={frontY}
          x2={100} y2={frontY}
          stroke="rgba(255,45,120,0.55)" strokeWidth="1.2"
        />
      </svg>

      {/* ラベル */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[var(--foreground-muted)] opacity-40"
        style={{ top: flipped ? 'auto' : '5px', bottom: flipped ? '5px' : 'auto' }}
      >
        BACK
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase font-bold text-[#FF6BA8] opacity-70"
        style={{ top: flipped ? '5px' : 'auto', bottom: flipped ? 'auto' : '5px' }}
      >
        FRONT
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] opacity-35 -rotate-90">L</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] opacity-35 rotate-90">R</div>

      {/* ドラッグ可能アイコン (透視変換) */}
      {positions.map((pos) => {
        const dY = transformY(pos.y)
        const dX = pX(pos.x, dY, flipped)
        return (
          <DraggableMemberIcon
            key={pos.memberId}
            member={pos.member}
            x={dX}
            y={dY}
            isSelected={selectedMemberId === pos.memberId}
            onPositionChange={(displayX, displayY) => {
              const logicalX = Math.max(0, Math.min(100, inversePX(displayX, displayY, flipped)))
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
