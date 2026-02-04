'use client'

import { useMemo } from 'react'
import { Formation, Member, InterpolatedPosition } from '@/types'
import { getCurrentFormations, interpolatePositions } from '@/lib/utils'

interface UseFormationSyncOptions {
  formations: Formation[]
  members: Member[]
  currentTime: number
}

interface UseFormationSyncReturn {
  currentFormation: Formation | null
  nextFormation: Formation | null
  interpolatedPositions: InterpolatedPosition[]
}

export function useFormationSync({
  formations,
  members,
  currentTime,
}: UseFormationSyncOptions): UseFormationSyncReturn {
  const { current, next } = useMemo(
    () => getCurrentFormations(formations, currentTime),
    [formations, currentTime]
  )

  const interpolatedPositions = useMemo(() => {
    if (!current) {
      return []
    }
    return interpolatePositions(current, next, currentTime, members)
  }, [current, next, currentTime, members])

  return {
    currentFormation: current,
    nextFormation: next,
    interpolatedPositions,
  }
}
