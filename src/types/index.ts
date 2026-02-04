// Artist（アーティスト）
export type Artist = {
  id: string
  name: string
  members: Member[]
  createdAt: Date
}

// Member（メンバー）
export type Member = {
  id: string
  artistId: string
  name: string
  color: string // HEX
  order: number
}

// Video（動画）
export type Video = {
  id: string
  artistId: string
  youtubeVideoId: string
  title: string
  createdAt: Date
}

// FormationData（フォーメーションデータ）
export type FormationData = {
  id: string
  videoId: string
  contributorName?: string
  formations: Formation[]
  createdAt: Date
  updatedAt: Date
}

// Formation（フォーメーション）
export type Formation = {
  id: string
  time: number // 秒（小数点可）
  name?: string
  positions: Position[]
}

// Position（位置）
export type Position = {
  memberId: string
  x: number // 0-100（%）
  y: number // 0-100（%）
}

// 補間された位置（アニメーション用）
export type InterpolatedPosition = Position & {
  member: Member
}
