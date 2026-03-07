export type TemplateType =
  | 'circle'
  | 'line'
  | 'column'
  | 'two-rows'
  | 'v-shape'
  | 'diagonal'
  | 'triangle'
  | 'diamond'

export interface TemplateInfo {
  id: TemplateType
  label: string
  labelEn: string
}

export const TEMPLATES: TemplateInfo[] = [
  { id: 'circle',    label: '円形',   labelEn: 'Circle'   },
  { id: 'line',      label: '横一列', labelEn: 'Line'     },
  { id: 'column',    label: '縦一列', labelEn: 'Column'   },
  { id: 'two-rows',  label: '二列',   labelEn: '2 Rows'   },
  { id: 'v-shape',   label: 'V字',    labelEn: 'V-Shape'  },
  { id: 'diagonal',  label: '斜め',   labelEn: 'Diagonal' },
  { id: 'triangle',  label: '三角',   labelEn: 'Triangle' },
  { id: 'diamond',   label: 'ダイヤ', labelEn: 'Diamond'  },
]

/** メンバー数に合わせてフォーメーションの座標リスト (0–100) を返す */
export function getTemplatePositions(
  template: TemplateType,
  count: number
): { x: number; y: number }[] {
  if (count === 0) return []

  switch (template) {
    // ── 円形 ──────────────────────────────────────────────
    case 'circle': {
      const radius = Math.min(30, 16 + count * 1.8)
      return Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2
        return {
          x: Math.round(50 + radius * Math.cos(angle)),
          y: Math.round(50 + radius * Math.sin(angle)),
        }
      })
    }

    // ── 横一列 ────────────────────────────────────────────
    case 'line': {
      if (count === 1) return [{ x: 50, y: 50 }]
      return Array.from({ length: count }, (_, i) => ({
        x: Math.round(10 + (i / (count - 1)) * 80),
        y: 50,
      }))
    }

    // ── 縦一列 ────────────────────────────────────────────
    case 'column': {
      if (count === 1) return [{ x: 50, y: 50 }]
      return Array.from({ length: count }, (_, i) => ({
        x: 50,
        y: Math.round(20 + (i / (count - 1)) * 60),
      }))
    }

    // ── 二列 (前列 + 後列) ───────────────────────────────
    case 'two-rows': {
      const frontCount = Math.ceil(count / 2)
      const backCount  = count - frontCount
      const positions: { x: number; y: number }[] = []
      // 前列 (y=65)
      for (let i = 0; i < frontCount; i++) {
        positions.push({
          x: frontCount === 1 ? 50 : Math.round(15 + (i / (frontCount - 1)) * 70),
          y: 65,
        })
      }
      // 後列 (y=35)
      for (let i = 0; i < backCount; i++) {
        positions.push({
          x: backCount === 1 ? 50 : Math.round(20 + (i / (backCount - 1)) * 60),
          y: 35,
        })
      }
      return positions
    }

    // ── V字 (尖端が後方、両翼が前方へ広がる) ────────────
    case 'v-shape': {
      if (count === 1) return [{ x: 50, y: 50 }]
      if (count === 2) return [{ x: 30, y: 60 }, { x: 70, y: 60 }]
      const tip   = { x: 50, y: 22 }
      const leftEnd  = { x: 12, y: 75 }
      const rightEnd = { x: 88, y: 75 }
      const half = Math.ceil(count / 2)
      const positions: { x: number; y: number }[] = []
      // 左翼
      for (let i = 0; i < half; i++) {
        const t = i / (half - 1 || 1)
        positions.push({
          x: Math.round(tip.x + (leftEnd.x  - tip.x) * t),
          y: Math.round(tip.y + (leftEnd.y  - tip.y) * t),
        })
      }
      // 右翼 (先端を除く)
      const rightCount = count - half
      for (let i = 1; i <= rightCount; i++) {
        const t = i / (rightCount || 1)
        positions.push({
          x: Math.round(tip.x + (rightEnd.x - tip.x) * t),
          y: Math.round(tip.y + (rightEnd.y - tip.y) * t),
        })
      }
      return positions
    }

    // ── 斜め (左奥 → 右前) ───────────────────────────────
    case 'diagonal': {
      if (count === 1) return [{ x: 50, y: 50 }]
      return Array.from({ length: count }, (_, i) => ({
        x: Math.round(12 + (i / (count - 1)) * 76),
        y: Math.round(22 + (i / (count - 1)) * 56),
      }))
    }

    // ── 三角 (前方1人 → 後方に広がる) ───────────────────
    case 'triangle': {
      if (count === 1) return [{ x: 50, y: 68 }]
      if (count === 2) return [{ x: 50, y: 68 }, { x: 50, y: 30 }]
      const positions: { x: number; y: number }[] = []
      // 先頭1人を前方中央に
      positions.push({ x: 50, y: 70 })
      const rest = count - 1
      // 残りを後列に均等配置 (段を増やす)
      let remaining = rest
      let row = 1
      while (remaining > 0) {
        const inRow = Math.min(row + 1, remaining)
        const y = Math.round(70 - row * (50 / Math.ceil(Math.log2(count + 1) + 1)))
        for (let i = 0; i < inRow; i++) {
          positions.push({
            x: inRow === 1 ? 50 : Math.round(50 - (inRow - 1) * 10 + i * 20),
            y,
          })
        }
        remaining -= inRow
        row++
      }
      return positions
    }

    // ── ダイヤモンド ─────────────────────────────────────
    case 'diamond': {
      if (count === 1) return [{ x: 50, y: 50 }]
      if (count <= 4) {
        // 基本4点
        const base = [
          { x: 50, y: 15 }, // 後方
          { x: 15, y: 50 }, // 左
          { x: 85, y: 50 }, // 右
          { x: 50, y: 85 }, // 前方
        ]
        return base.slice(0, count)
      }
      // 4点を頂点に残りをエッジに均等配置
      const corners = [
        { x: 50, y: 15 },
        { x: 85, y: 50 },
        { x: 50, y: 85 },
        { x: 15, y: 50 },
      ]
      const extras = count - 4
      const perEdge = Math.floor(extras / 4)
      const remainder = extras % 4
      const positions = [...corners]
      for (let e = 0; e < 4; e++) {
        const from = corners[e]
        const to   = corners[(e + 1) % 4]
        const edgeCount = perEdge + (e < remainder ? 1 : 0)
        for (let i = 1; i <= edgeCount; i++) {
          const t = i / (edgeCount + 1)
          positions.push({
            x: Math.round(from.x + (to.x - from.x) * t),
            y: Math.round(from.y + (to.y - from.y) * t),
          })
        }
      }
      return positions
    }
  }
}
