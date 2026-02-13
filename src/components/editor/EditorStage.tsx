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
  flipped?: boolean // true = 観客側が下（デフォルト）
}

export function EditorStage({
  positions,
  selectedMemberId,
  onPositionChange,
  onMemberSelect,
  flipped = true,
}: EditorStageProps) {
  // Y座標を反転（flipped=trueの時、観客側が下になる）
  const transformY = (y: number) => flipped ? 100 - y : y
  // ドラッグ時は逆変換が必要
  const inverseTransformY = (y: number) => flipped ? 100 - y : y
  return (
    <div
      className="relative w-full aspect-video bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-dashed border-gray-600"
      onClick={() => onMemberSelect(null)}
    >
      {/* グリッド */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="editor-grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#editor-grid)" />
        </svg>
      </div>

      {/* センターライン */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40" />

      {/* ラベル */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium">
        {flipped ? 'BACK' : 'FRONT (観客側)'}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium">
        {flipped ? 'FRONT (観客側)' : 'BACK'}
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-xs font-medium rotate-[-90deg]">
        LEFT
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 text-xs font-medium rotate-90">
        RIGHT
      </div>

      {/* ドラッグ可能なメンバーアイコン */}
      {positions.map((pos) => (
        <DraggableMemberIcon
          key={pos.memberId}
          member={pos.member}
          x={pos.x}
          y={transformY(pos.y)}
          isSelected={selectedMemberId === pos.memberId}
          onPositionChange={(x, y) => onPositionChange(pos.memberId, x, inverseTransformY(y))}
          onClick={() => onMemberSelect(pos.memberId)}
        />
      ))}

      {/* 編集ヒント */}
      <div className="absolute bottom-2 right-2 text-white/40 text-xs">
        Drag members to position
      </div>
    </div>
  )
}
