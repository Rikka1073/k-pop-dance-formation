'use client'

import { useState, useEffect } from 'react'
import { Member } from '@/types'

interface CoordinateInputProps {
  member: Member
  x: number
  y: number
  onPositionChange: (memberId: string, x: number, y: number) => void
}

export function CoordinateInput({
  member,
  x,
  y,
  onPositionChange,
}: CoordinateInputProps) {
  const [localX, setLocalX] = useState(x.toString())
  const [localY, setLocalY] = useState(y.toString())

  // Sync with props when they change externally (e.g., from drag)
  useEffect(() => {
    setLocalX(Math.round(x).toString())
    setLocalY(Math.round(y).toString())
  }, [x, y])

  const handleXChange = (value: string) => {
    setLocalX(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onPositionChange(member.id, num, y)
    }
  }

  const handleYChange = (value: string) => {
    setLocalY(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onPositionChange(member.id, x, num)
    }
  }

  const adjustX = (delta: number) => {
    const newX = Math.max(0, Math.min(100, Math.round(x) + delta))
    onPositionChange(member.id, newX, y)
  }

  const adjustY = (delta: number) => {
    const newY = Math.max(0, Math.min(100, Math.round(y) + delta))
    onPositionChange(member.id, x, newY)
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
        {/* X coordinate */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm w-8">X:</label>
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
            onBlur={() => setLocalX(Math.round(x).toString())}
            min={0}
            max={100}
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
          <span className="text-gray-500 text-xs">%</span>
        </div>

        {/* Y coordinate */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm w-8">Y:</label>
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
            onBlur={() => setLocalY(Math.round(y).toString())}
            min={0}
            max={100}
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
          <span className="text-gray-500 text-xs">%</span>
        </div>
      </div>

      {/* Hint */}
      <p className="text-gray-500 text-xs mt-3">
        0-100%の範囲で指定（左上が0,0）
      </p>
    </div>
  )
}
