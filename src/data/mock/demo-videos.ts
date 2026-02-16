// Demo video data for testing infinite scroll
// These are mock videos that won't actually play

const KPOP_GROUPS = [
  { name: 'BLACKPINK', members: ['Jisoo', 'Jennie', 'Rosé', 'Lisa'] },
  { name: 'BTS', members: ['RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'] },
  { name: 'TWICE', members: ['Nayeon', 'Jeongyeon', 'Momo', 'Sana', 'Jihyo', 'Mina', 'Dahyun', 'Chaeyoung', 'Tzuyu'] },
  { name: 'aespa', members: ['Karina', 'Giselle', 'Winter', 'Ningning'] },
  { name: 'NewJeans', members: ['Minji', 'Hanni', 'Danielle', 'Haerin', 'Hyein'] },
  { name: 'IVE', members: ['Yujin', 'Gaeul', 'Rei', 'Wonyoung', 'Liz', 'Leeseo'] },
  { name: 'LE SSERAFIM', members: ['Sakura', 'Kim Chaewon', 'Huh Yunjin', 'Kazuha', 'Hong Eunchae'] },
  { name: 'ITZY', members: ['Yeji', 'Lia', 'Ryujin', 'Chaeryeong', 'Yuna'] },
  { name: 'Stray Kids', members: ['Bang Chan', 'Lee Know', 'Changbin', 'Hyunjin', 'Han', 'Felix', 'Seungmin', 'I.N'] },
  { name: 'ENHYPEN', members: ['Jungwon', 'Heeseung', 'Jay', 'Jake', 'Sunghoon', 'Sunoo', 'Ni-ki'] },
  { name: '(G)I-DLE', members: ['Miyeon', 'Minnie', 'Soyeon', 'Yuqi', 'Shuhua'] },
  { name: 'NMIXX', members: ['Lily', 'Haewon', 'Sullyoon', 'Jinni', 'BAE', 'Jiwoo', 'Kyujin'] },
  { name: 'Kep1er', members: ['Yujin', 'Xiaoting', 'Mashiro', 'Chaehyun', 'Dayeon', 'Hikaru', 'Huening Bahiyyih', 'Youngeun', 'Yeseo'] },
  { name: 'SEVENTEEN', members: ['S.Coups', 'Jeonghan', 'Joshua', 'Jun', 'Hoshi', 'Wonwoo', 'Woozi', 'DK', 'Mingyu', 'The8', 'Seungkwan', 'Vernon', 'Dino'] },
  { name: 'NCT 127', members: ['Taeil', 'Johnny', 'Taeyong', 'Yuta', 'Doyoung', 'Jaehyun', 'Jungwoo', 'Mark', 'Haechan'] },
]

const SONG_TEMPLATES = [
  '{group} - {song} Dance Practice',
  '{group} "{song}" Dance Practice (Moving Ver.)',
  '{group} - {song} (Choreography Video)',
  '[DANCE] {group} - {song}',
  '{group} - {song} MV Dance Cover',
]

const SONG_NAMES = [
  'Supernova', 'Drama', 'Magnetic', 'How Sweet', 'Ditto', 'OMG',
  'Super Shy', 'New Jeans', 'Hype Boy', 'Attention', 'Cookie',
  'Pink Venom', 'Shut Down', 'DDU-DU DDU-DU', 'Kill This Love', 'Lovesick Girls',
  'Dynamite', 'Butter', 'Permission to Dance', 'Boy With Luv', 'DNA',
  'Next Level', 'Savage', 'Black Mamba', 'Dreams Come True', 'Spicy',
  'I AM', 'ELEVEN', 'Love Dive', 'After LIKE', 'Kitsch',
  'ANTIFRAGILE', 'UNFORGIVEN', 'FEARLESS', 'Smart', 'Perfect Night',
  'WANNABE', 'DALLA DALLA', 'SNEAKERS', 'CAKE', 'LOCO',
  'MIROH', 'God\'s Menu', 'Back Door', 'MANIAC', 'S-Class',
  'Bite Me', 'Sweet Venom', 'Drunk-Dazed', 'Given-Taken', 'Polaroid Love',
  'TOMBOY', 'Queencard', 'Nxde', 'LATATA', 'HWAA',
  'DICE', 'Love Me Like This', 'Party O\'Clock', 'Soñar', 'O.O',
  'Very Nice', 'Don\'t Wanna Cry', 'Getting Closer', 'HOT', 'Super',
  'Kick It', 'Sticker', 'Cherry Bomb', '2 Baddies', 'Fact Check',
]

const MEMBER_COLORS = [
  '#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B5A',
  '#B8A9C9', '#88D8B0', '#FFAAA5', '#A8E6CF', '#DDA0DD',
  '#87CEEB', '#F0E68C', '#DDA0DD', '#98D8C8', '#F7DC6F',
]

export interface DemoVideo {
  id: string
  title: string
  artistName: string
  youtubeVideoId: string
  members: { id: string; name: string; color: string }[]
  formationCount: number
}

// Generate a deterministic pseudo-random number based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateDemoVideos(count: number, startIndex: number = 0): DemoVideo[] {
  const videos: DemoVideo[] = []

  for (let i = 0; i < count; i++) {
    const index = startIndex + i
    const seed = index + 1

    // Select group deterministically
    const groupIndex = Math.floor(seededRandom(seed * 1) * KPOP_GROUPS.length)
    const group = KPOP_GROUPS[groupIndex]

    // Select song deterministically
    const songIndex = Math.floor(seededRandom(seed * 2) * SONG_NAMES.length)
    const song = SONG_NAMES[songIndex]

    // Select title template deterministically
    const templateIndex = Math.floor(seededRandom(seed * 3) * SONG_TEMPLATES.length)
    const template = SONG_TEMPLATES[templateIndex]
    const title = template.replace('{group}', group.name).replace('{song}', song)

    // Generate members with colors
    const members = group.members.map((name, idx) => ({
      id: `demo-${index}-member-${idx}`,
      name,
      color: MEMBER_COLORS[idx % MEMBER_COLORS.length],
    }))

    // Random formation count (3-15)
    const formationCount = 3 + Math.floor(seededRandom(seed * 4) * 13)

    videos.push({
      id: `demo-video-${index}`,
      title,
      artistName: group.name,
      youtubeVideoId: 'dQw4w9WgXcQ', // Placeholder video ID
      members,
      formationCount,
    })
  }

  return videos
}

// Total number of demo videos available
export const DEMO_VIDEO_TOTAL = 100
export const DEMO_PAGE_SIZE = 12
