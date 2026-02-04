import { Artist, FormationData, Video } from '@/types'

// サンプルアーティスト「STELLAR」（4人組）
export const sampleArtist: Artist = {
  id: 'artist-stellar',
  name: 'STELLAR',
  members: [
    {
      id: 'member-luna',
      artistId: 'artist-stellar',
      name: 'Luna',
      color: '#FF6B9D', // ピンク
      order: 1,
    },
    {
      id: 'member-hana',
      artistId: 'artist-stellar',
      name: 'Hana',
      color: '#4ECDC4', // ティール
      order: 2,
    },
    {
      id: 'member-mina',
      artistId: 'artist-stellar',
      name: 'Mina',
      color: '#FFE66D', // イエロー
      order: 3,
    },
    {
      id: 'member-sora',
      artistId: 'artist-stellar',
      name: 'Sora',
      color: '#95E1D3', // ミント
      order: 4,
    },
  ],
  createdAt: new Date('2024-01-01'),
}

// サンプル動画
export const sampleVideo: Video = {
  id: 'video-sample',
  artistId: 'artist-stellar',
  youtubeVideoId: 'dQw4w9WgXcQ', // サンプル用（実際の動画IDに置き換え可能）
  title: 'STELLAR - Starlight (Dance Practice)',
  createdAt: new Date('2024-01-15'),
}

// サンプルフォーメーションデータ
export const sampleFormationData: FormationData = {
  id: 'formation-data-sample',
  videoId: 'video-sample',
  contributorName: 'Demo User',
  formations: [
    {
      id: 'formation-1',
      time: 0,
      name: 'Opening',
      positions: [
        { memberId: 'member-luna', x: 50, y: 30 },
        { memberId: 'member-hana', x: 30, y: 50 },
        { memberId: 'member-mina', x: 70, y: 50 },
        { memberId: 'member-sora', x: 50, y: 70 },
      ],
    },
    {
      id: 'formation-2',
      time: 5,
      name: 'V Formation',
      positions: [
        { memberId: 'member-luna', x: 50, y: 25 },
        { memberId: 'member-hana', x: 30, y: 45 },
        { memberId: 'member-mina', x: 70, y: 45 },
        { memberId: 'member-sora', x: 50, y: 65 },
      ],
    },
    {
      id: 'formation-3',
      time: 10,
      name: 'Line',
      positions: [
        { memberId: 'member-luna', x: 20, y: 50 },
        { memberId: 'member-hana', x: 40, y: 50 },
        { memberId: 'member-mina', x: 60, y: 50 },
        { memberId: 'member-sora', x: 80, y: 50 },
      ],
    },
    {
      id: 'formation-4',
      time: 15,
      name: 'Diamond',
      positions: [
        { memberId: 'member-luna', x: 50, y: 20 },
        { memberId: 'member-hana', x: 25, y: 50 },
        { memberId: 'member-mina', x: 75, y: 50 },
        { memberId: 'member-sora', x: 50, y: 80 },
      ],
    },
    {
      id: 'formation-5',
      time: 20,
      name: 'Staggered',
      positions: [
        { memberId: 'member-luna', x: 25, y: 35 },
        { memberId: 'member-hana', x: 45, y: 55 },
        { memberId: 'member-mina', x: 55, y: 35 },
        { memberId: 'member-sora', x: 75, y: 55 },
      ],
    },
    {
      id: 'formation-6',
      time: 25,
      name: 'Square',
      positions: [
        { memberId: 'member-luna', x: 35, y: 35 },
        { memberId: 'member-hana', x: 65, y: 35 },
        { memberId: 'member-mina', x: 35, y: 65 },
        { memberId: 'member-sora', x: 65, y: 65 },
      ],
    },
    {
      id: 'formation-7',
      time: 30,
      name: 'Cluster',
      positions: [
        { memberId: 'member-luna', x: 45, y: 45 },
        { memberId: 'member-hana', x: 55, y: 45 },
        { memberId: 'member-mina', x: 45, y: 55 },
        { memberId: 'member-sora', x: 55, y: 55 },
      ],
    },
    {
      id: 'formation-8',
      time: 35,
      name: 'Spread',
      positions: [
        { memberId: 'member-luna', x: 15, y: 30 },
        { memberId: 'member-hana', x: 85, y: 30 },
        { memberId: 'member-mina', x: 15, y: 70 },
        { memberId: 'member-sora', x: 85, y: 70 },
      ],
    },
    {
      id: 'formation-9',
      time: 40,
      name: 'Center Focus',
      positions: [
        { memberId: 'member-luna', x: 50, y: 40 },
        { memberId: 'member-hana', x: 30, y: 60 },
        { memberId: 'member-mina', x: 70, y: 60 },
        { memberId: 'member-sora', x: 50, y: 75 },
      ],
    },
    {
      id: 'formation-10',
      time: 45,
      name: 'Finale',
      positions: [
        { memberId: 'member-luna', x: 50, y: 30 },
        { memberId: 'member-hana', x: 30, y: 50 },
        { memberId: 'member-mina', x: 70, y: 50 },
        { memberId: 'member-sora', x: 50, y: 70 },
      ],
    },
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

// メンバーIDからメンバー情報を取得するヘルパー
export function getMemberById(memberId: string) {
  return sampleArtist.members.find((m) => m.id === memberId)
}
