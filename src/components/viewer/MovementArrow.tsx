'use client'

import { Member } from '@/types'

interface MovementArrowProps {
  fromX: number
  fromY: number
  toX: number
  toY: number
  member: Member
  isHighlighted?: boolean
}

export function MovementArrow({
  fromX,
  fromY,
  toX,
  toY,
  member,
  isHighlighted,
}: MovementArrowProps) {
  // 移動がない場合は表示しない
  if (Math.abs(fromX - toX) < 1 && Math.abs(fromY - toY) < 1) {
    return null
  }

  const arrowId = `arrow-${member.id}`
  const opacity = isHighlighted ? 0.9 : 0.4
  const strokeWidth = isHighlighted ? 3 : 2

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: isHighlighted ? 10 : 5 }}
    >
      <defs>
        <marker
          id={arrowId}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L10,5 L0,10 L3,5 Z" fill={member.color} fillOpacity={opacity} />
        </marker>
      </defs>

      <line
        x1={`${fromX}%`}
        y1={`${fromY}%`}
        x2={`${toX}%`}
        y2={`${toY}%`}
        stroke={member.color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeDasharray={isHighlighted ? 'none' : '5,5'}
        markerEnd={`url(#${arrowId})`}
      />
    </svg>
  )
}
