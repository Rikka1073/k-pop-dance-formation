'use client'

import { useState, useEffect } from 'react'
import { Member } from '@/types'

interface CoordinateInputProps {
  member: Member
  x: number  // Internal: 0-100 (0=left, 100=right)
  y: number  // Internal: 0-100 (0=top, 100=bottom)
  onPositionChange: (memberId: string, x: number, y: number) => void
}

// Convert internal coords (0-100) to display coords (-50 to +50, center=0)
const toDisplay = (internal: number) => Math.round(internal - 50)
// Convert display coords to internal coords
const toInternal = (display: number) => display + 50

export function CoordinateInput({
  member,
  x,
  y,
  onPositionChange,
}: CoordinateInputProps) {
  // Display values: -50 (left/top) to +50 (right/bottom), 0 = center
  const [localX, setLocalX] = useState(toDisplay(x).toString())
  const [localY, setLocalY] = useState(toDisplay(y).toString())

  // Sync with props when they change externally (e.g., from drag)
  useEffect(() => {
    setLocalX(toDisplay(x).toString())
    setLocalY(toDisplay(y).toString())
  }, [x, y])

  const handleXChange = (value: string) => {
    setLocalX(value)
    const displayVal = parseInt(value)
    if (!isNaN(displayVal) && displayVal >= -50 && displayVal <= 50) {
      onPositionChange(member.id, toInternal(displayVal), y)
    }
  }

  const handleYChange = (value: string) => {
    setLocalY(value)
    const displayVal = parseInt(value)
    if (!isNaN(displayVal) && displayVal >= -50 && displayVal <= 50) {
      onPositionChange(member.id, x, toInternal(displayVal))
    }
  }

  const adjustX = (delta: number) => {
    const currentDisplay = toDisplay(x)
    const newDisplay = Math.max(-50, Math.min(50, currentDisplay + delta))
    onPositionChange(member.id, toInternal(newDisplay), y)
  }

  const adjustY = (delta: number) => {
    const currentDisplay = toDisplay(y)
    const newDisplay = Math.max(-50, Math.min(50, currentDisplay + delta))
    onPositionChange(member.id, x, toInternal(newDisplay))
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <h3 className="text-pink-400 font-semibold mb-3">Position</h3>

      {/* Member info */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: member.color }}
        >
          {member.name.charAt(0)}
        </div>
        <span className="text-white font-medium">{member.name}</span>
      </div>

      {/* Coordinate inputs */}
      <div className="space-y-3">
        {/* X coordinate (horizontal: - = left, + = right) */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm w-6">X:</label>
          <button
            onClick={() => adjustX(-5)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            -5
          </button>
          <button
            onClick={() => adjustX(-1)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={localX}
            onChange={(e) => handleXChange(e.target.value)}
            onBlur={() => setLocalX(toDisplay(x).toString())}
            min={-50}
            max={50}
            className="w-16 bg-gray-700 text-white text-center px-2 py-1.5 rounded-lg border-none outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={() => adjustX(1)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            +
          </button>
          <button
            onClick={() => adjustX(5)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            +5
          </button>
        </div>

        {/* Y coordinate (vertical: - = front/top, + = back/bottom) */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm w-6">Y:</label>
          <button
            onClick={() => adjustY(-5)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            -5
          </button>
          <button
            onClick={() => adjustY(-1)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={localY}
            onChange={(e) => handleYChange(e.target.value)}
            onBlur={() => setLocalY(toDisplay(y).toString())}
            min={-50}
            max={50}
            className="w-16 bg-gray-700 text-white text-center px-2 py-1.5 rounded-lg border-none outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={() => adjustY(1)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            +
          </button>
          <button
            onClick={() => adjustY(5)}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            +5
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 space-y-1">
        <p>X: <span className="text-gray-400">-50</span> ← 左 | 中央 <span className="text-pink-400">0</span> | 右 → <span className="text-gray-400">+50</span></p>
        <p>Y: <span className="text-gray-400">-50</span> ← 前 | 中央 <span className="text-pink-400">0</span> | 奥 → <span className="text-gray-400">+50</span></p>
      </div>
    </div>
  )
}
