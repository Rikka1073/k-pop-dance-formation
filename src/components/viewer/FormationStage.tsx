'use client'

import { Formation, Member, InterpolatedPosition } from '@/types'
import { MemberIcon } from './MemberIcon'
import { MovementArrow } from './MovementArrow'

interface FormationStageProps {
  positions: InterpolatedPosition[]
  nextFormation: Formation | null
  selectedMemberId: string | null
  showMovementArrows: boolean
  onMemberClick?: (memberId: string) => void
}

export function FormationStage({
  positions,
  nextFormation,
  selectedMemberId,
  showMovementArrows,
  onMemberClick,
}: FormationStageProps) {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden">
      {/* ステージグリッド（背景） */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* センターライン */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />

      {/* 「前方」「後方」ラベル */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        FRONT
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        BACK
      </div>

      {/* 動線矢印 */}
      {showMovementArrows &&
        nextFormation &&
        positions.map((pos) => {
          const nextPos = nextFormation.positions.find(
            (p) => p.memberId === pos.memberId
          )
          if (!nextPos) return null

          return (
            <MovementArrow
              key={`arrow-${pos.memberId}`}
              fromX={pos.x}
              fromY={pos.y}
              toX={nextPos.x}
              toY={nextPos.y}
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
          y={pos.y}
          isSelected={selectedMemberId === pos.memberId}
          onClick={() => onMemberClick?.(pos.memberId)}
        />
      ))}
    </div>
  )
}
