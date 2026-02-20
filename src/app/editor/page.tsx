'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout'
import { Button } from '@/components/ui'
import {
  EditorStage,
  FormationList,
  MemberSettings,
} from '@/components/editor'
import { YouTubePlayer } from '@/components/viewer'
import { Member, Position } from '@/types'
import { isSupabaseConfigured } from '@/lib/supabase'
import {
  getArtists,
  getVideoByYoutubeId,
  createArtist,
  createMember,
  createVideo,
  createFormationData,
  createFormation,
  createPosition,
  ArtistWithMembers,
} from '@/lib/supabase/queries'
import { sampleVideo } from '@/data/mock/sample-formation'

// Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Default member colors
const DEFAULT_COLORS = [
  '#FF6B9D',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#FF8B5A',
  '#B8A9C9',
]

interface EditorFormation {
  id: string
  time: number
  name: string
  positions: (Position & { member: Member })[]
}

export default function EditorPage() {
  const router = useRouter()

  // Existing artists
  const [existingArtists, setExistingArtists] = useState<ArtistWithMembers[]>([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(true)

  // Artist selection
  const [artistMode, setArtistMode] = useState<'new' | 'existing'>('new')
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)

  // Video settings
  const [youtubeVideoId, setYoutubeVideoId] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [contributorName, setContributorName] = useState('')
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFetchingVideoInfo, setIsFetchingVideoInfo] = useState(false)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)

  // Members
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  // Formations
  const [formations, setFormations] = useState<EditorFormation[]>([])
  const [currentFormationId, setCurrentFormationId] = useState<string | null>(null)

  // Get current formation
  const currentFormation = formations.find((f) => f.id === currentFormationId)

  // Load existing artists on mount
  useEffect(() => {
    async function loadArtists() {
      if (!isSupabaseConfigured()) {
        setIsLoadingArtists(false)
        return
      }

      try {
        const artists = await getArtists()
        setExistingArtists(artists)
        // If there are existing artists, default to existing mode
        if (artists.length > 0) {
          setArtistMode('existing')
        }
      } catch (error) {
        console.error('Failed to load artists:', error)
      } finally {
        setIsLoadingArtists(false)
      }
    }

    loadArtists()
  }, [])

  // When selecting an existing artist, load their members
  const handleArtistSelect = (artistId: string) => {
    setSelectedArtistId(artistId)
    const artist = existingArtists.find((a) => a.id === artistId)
    if (artist) {
      setArtistName(artist.name)
      // Convert DB members to local members
      const loadedMembers: Member[] = artist.members.map((m) => ({
        id: m.id, // Use DB ID directly
        artistId: m.artist_id,
        name: m.name,
        color: m.color,
        order: m.display_order,
      }))
      setMembers(loadedMembers)
    }
  }

  // When switching to new artist mode, clear members
  const handleArtistModeChange = (mode: 'new' | 'existing') => {
    setArtistMode(mode)
    if (mode === 'new') {
      setSelectedArtistId(null)
      setArtistName('')
      setMembers([])
    } else {
      setArtistName('')
      setMembers([])
    }
  }

  // ============ Video Info Fetch ============

  // チャンネル名から不要な文言を除去
  const cleanChannelName = (channelName: string): string => {
    let name = channelName

    // "| レーベル名" や "｜ レーベル名" を除去
    name = name.replace(/\s*[|｜]\s*.+$/, '')

    // 括弧内の不要ワードを除去: "(Official)", "[Official Channel]" など
    name = name.replace(/\s*[\[(]\s*(?:official|공식|公式|channel|youtube|music)[\w\s]*[\])]/gi, '')

    // 末尾の不要ワードを繰り返し除去（複数単語対応: "Official YouTube Channel"）
    const noisePattern = /\s+(?:official|공식|公式|channel|youtube|tv|music|entertainment|records|label|labels)\s*$/gi
    let prev = ''
    while (prev !== name) {
      prev = name
      name = name.replace(noisePattern, '')
    }

    return name.trim()
  }

  // タイトルからアーティスト名を推測
  const extractArtistFromTitle = (title: string): string | null => {
    // パターン: "ARTIST - Song Title" or "ARTIST 'Song Title'" or "[MV] ARTIST - Song"
    const patterns = [
      /^\[?(?:MV|M\/V|Official|公式)?\]?\s*([^-–—]+?)\s*[-–—]/i,
      /^([^''"「『]+?)\s*[''""「『]/,
      /^(.+?)\s*[-–—]\s*.+(?:Dance Practice|안무|練習|Choreography)/i,
    ]

    for (const pattern of patterns) {
      const match = title.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }
    return null
  }

  // 重複チェック
  const checkDuplicate = useCallback(async (videoId: string): Promise<string | null> => {
    // サンプル動画との重複チェック
    if (videoId === sampleVideo.youtubeVideoId) {
      return `この動画は既にサンプルとして登録されています（${sampleVideo.title}）`
    }

    // Supabase内の動画との重複チェック
    if (isSupabaseConfigured()) {
      try {
        const existingVideo = await getVideoByYoutubeId(videoId)
        if (existingVideo) {
          return `この動画は既に登録されています（${existingVideo.title}）`
        }
      } catch (error) {
        console.error('Failed to check duplicate:', error)
      }
    }

    return null
  }, [])

  // YouTube oEmbed APIから動画情報を取得
  const fetchVideoInfo = useCallback(async (videoId: string) => {
    if (!videoId || videoId.length < 5) return

    setIsFetchingVideoInfo(true)
    setDuplicateError(null)

    try {
      // 重複チェック
      const duplicateMessage = await checkDuplicate(videoId)
      if (duplicateMessage) {
        setDuplicateError(duplicateMessage)
      }

      // 動画情報を取得
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      )
      if (response.ok) {
        const data = await response.json()
        // タイトルを自動設定
        if (data.title && !videoTitle) {
          setVideoTitle(data.title)
        }
        // アーティスト名を推測して自動設定（新規アーティストモードの場合のみ）
        if (artistMode === 'new' && !artistName) {
          const extracted = data.title ? extractArtistFromTitle(data.title) : null
          if (extracted) {
            setArtistName(extracted)
          } else if (data.author_name) {
            // フォールバック: チャンネル名からノイズワードを除去して使用
            const cleaned = cleanChannelName(data.author_name)
            if (cleaned) setArtistName(cleaned)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch video info:', error)
    } finally {
      setIsFetchingVideoInfo(false)
    }
  }, [videoTitle, artistMode, artistName, checkDuplicate])

  // ============ Video Handlers ============

  const handleLoadVideo = () => {
    if (!youtubeVideoId.trim()) return
    setIsVideoLoaded(true)
  }

  // YouTube IDが変わったら情報を取得
  const handleVideoIdChange = (input: string) => {
    // Extract video ID from URL if needed
    const match = input.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    )
    const videoId = match ? match[1] : input
    setYoutubeVideoId(videoId)
    setDuplicateError(null) // 入力が変わったらエラーをクリア

    // 有効なIDの場合は情報を取得
    if (videoId && videoId.length >= 11) {
      fetchVideoInfo(videoId)
    }
  }

  const handleVideoReady = () => {
    // Video is ready
  }

  const handleDurationChange = useCallback((duration: number) => {
    setVideoDuration(duration)
  }, [])

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  // ============ Member Handlers ============

  const handleAddMember = () => {
    // Only allow adding members for new artists
    if (artistMode === 'existing') {
      alert('既存アーティストのメンバーは変更できません')
      return
    }

    const newMember: Member = {
      id: generateId(),
      artistId: '',
      name: `Member ${members.length + 1}`,
      color: DEFAULT_COLORS[members.length % DEFAULT_COLORS.length],
      order: members.length,
    }
    setMembers([...members, newMember])

    // Add to all existing formations
    setFormations((prev) =>
      prev.map((f) => ({
        ...f,
        positions: [
          ...f.positions,
          {
            memberId: newMember.id,
            x: 50,
            y: 50,
            member: newMember,
          },
        ],
      }))
    )
  }

  const handleUpdateMember = (
    memberId: string,
    updates: { name?: string; color?: string }
  ) => {
    // Only allow updating members for new artists
    if (artistMode === 'existing') {
      alert('既存アーティストのメンバーは変更できません')
      return
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    )

    // Update member in formations
    setFormations((prev) =>
      prev.map((f) => ({
        ...f,
        positions: f.positions.map((p) =>
          p.memberId === memberId
            ? { ...p, member: { ...p.member, ...updates } }
            : p
        ),
      }))
    )
  }

  const handleDeleteMember = (memberId: string) => {
    // Only allow deleting members for new artists
    if (artistMode === 'existing') {
      alert('既存アーティストのメンバーは変更できません')
      return
    }

    setMembers((prev) => prev.filter((m) => m.id !== memberId))

    // Remove from formations
    setFormations((prev) =>
      prev.map((f) => ({
        ...f,
        positions: f.positions.filter((p) => p.memberId !== memberId),
      }))
    )

    if (selectedMemberId === memberId) {
      setSelectedMemberId(null)
    }
  }

  // ============ Formation Handlers ============

  const handleAddFormation = () => {
    // 円形に配置（上から時計回り）
    const count = members.length
    const newFormation: EditorFormation = {
      id: generateId(),
      time: currentTime,
      name: `Formation ${formations.length + 1}`,
      positions: members.map((m, index) => {
        const angle = (index / count) * 2 * Math.PI - Math.PI / 2 // 上から始める
        const radius = Math.min(25, 15 + count * 2) // メンバー数に応じて半径調整
        const x = 50 + radius * Math.cos(angle)
        const y = 50 + radius * Math.sin(angle)
        return {
          memberId: m.id,
          x: Math.round(x),
          y: Math.round(y),
          member: m,
        }
      }),
    }
    setFormations((prev) => [...prev, newFormation].sort((a, b) => a.time - b.time))
    setCurrentFormationId(newFormation.id)
  }

  const handleSelectFormation = (formationId: string) => {
    setCurrentFormationId(formationId)
  }

  const handleDeleteFormation = (formationId: string) => {
    setFormations((prev) => prev.filter((f) => f.id !== formationId))
    if (currentFormationId === formationId) {
      setCurrentFormationId(formations[0]?.id || null)
    }
  }

  const handleFormationTimeChange = (formationId: string, time: number) => {
    setFormations((prev) =>
      prev
        .map((f) => (f.id === formationId ? { ...f, time } : f))
        .sort((a, b) => a.time - b.time)
    )
  }

  const handleFormationNameChange = (formationId: string, name: string) => {
    setFormations((prev) =>
      prev.map((f) => (f.id === formationId ? { ...f, name } : f))
    )
  }

  // ============ Position Handlers ============

  const handlePositionChange = (memberId: string, x: number, y: number) => {
    if (!currentFormationId) return

    setFormations((prev) =>
      prev.map((f) =>
        f.id === currentFormationId
          ? {
              ...f,
              positions: f.positions.map((p) =>
                p.memberId === memberId ? { ...p, x, y } : p
              ),
            }
          : f
      )
    )
  }

  // ============ Save Handler ============
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!isSupabaseConfigured()) {
      alert('Supabaseが設定されていません。環境変数を確認してください。')
      return
    }

    if (members.length === 0) {
      alert('メンバーを追加してください。')
      return
    }

    if (formations.length === 0) {
      alert('フォーメーションを追加してください。')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      let artistId: string
      let memberIdMap = new Map<string, string>() // local ID -> DB ID

      if (artistMode === 'existing' && selectedArtistId) {
        // Use existing artist
        artistId = selectedArtistId
        // For existing artists, member IDs are already DB IDs
        members.forEach((m) => {
          memberIdMap.set(m.id, m.id)
        })
      } else {
        // Create new artist
        const artist = await createArtist(artistName)
        artistId = artist.id

        // Create members
        for (let i = 0; i < members.length; i++) {
          const m = members[i]
          const dbMember = await createMember(artistId, m.name, m.color, i)
          memberIdMap.set(m.id, dbMember.id)
        }
      }

      // Create video
      const video = await createVideo(artistId, youtubeVideoId, videoTitle)

      // Create formation data
      const formationData = await createFormationData(
        video.id,
        contributorName || undefined
      )

      // Create formations and positions
      for (let i = 0; i < formations.length; i++) {
        const f = formations[i]
        const dbFormation = await createFormation(
          formationData.id,
          f.time,
          f.name || null,
          i
        )

        // Create positions
        for (const pos of f.positions) {
          const dbMemberId = memberIdMap.get(pos.memberId)
          if (dbMemberId) {
            await createPosition(dbFormation.id, dbMemberId, pos.x, pos.y)
          }
        }
      }

      alert('保存が完了しました！')
      router.push(`/viewer/${video.id}`)
    } catch (error) {
      console.error('Save error:', error)
      setSaveError(error instanceof Error ? error.message : '保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header title="フォーメーション作成" />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Step 1: Video Setup */}
        {!isVideoLoaded ? (
          <div className="max-w-xl mx-auto">
            {/* 戻るボタン */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>ホームに戻る</span>
            </Link>

            <div className="bg-[var(--card-bg)] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
                ステップ1: 動画設定
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">
                    YouTube動画IDまたはURL
                    {isFetchingVideoInfo && (
                      <span className="ml-2 text-pink-400">情報を取得中...</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={youtubeVideoId}
                    onChange={(e) => handleVideoIdChange(e.target.value)}
                    placeholder="例: dQw4w9WgXcQ または https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-xl border border-[var(--card-border)] focus:border-pink-400 outline-none"
                  />
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    URLを入力するとタイトルとアーティスト名を自動取得します
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">
                    動画タイトル
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="例: BLACKPINK - DDU-DU DDU-DU Dance Practice"
                    className="w-full px-3 py-2 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-xl border border-[var(--card-border)] focus:border-pink-400 outline-none"
                  />
                </div>

                {/* Artist Selection */}
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-2">
                    アーティスト/グループ
                  </label>

                  {/* Artist Mode Toggle */}
                  {existingArtists.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleArtistModeChange('existing')}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm transition-colors ${
                          artistMode === 'existing'
                            ? 'bg-gradient-to-r from-pink-400 to-violet-400 text-[var(--foreground)]'
                            : 'bg-[var(--background-tertiary)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                        }`}
                      >
                        既存のアーティスト
                      </button>
                      <button
                        onClick={() => handleArtistModeChange('new')}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm transition-colors ${
                          artistMode === 'new'
                            ? 'bg-gradient-to-r from-pink-400 to-violet-400 text-[var(--foreground)]'
                            : 'bg-[var(--background-tertiary)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                        }`}
                      >
                        新規アーティスト
                      </button>
                    </div>
                  )}

                  {artistMode === 'existing' && existingArtists.length > 0 ? (
                    <div>
                      <select
                        value={selectedArtistId || ''}
                        onChange={(e) => handleArtistSelect(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-xl border border-[var(--card-border)] focus:border-pink-400 outline-none"
                      >
                        <option value="">-- 選択してください --</option>
                        {existingArtists.map((artist) => (
                          <option key={artist.id} value={artist.id}>
                            {artist.name} ({artist.members.length}人)
                          </option>
                        ))}
                      </select>

                      {/* Show selected artist's members */}
                      {selectedArtistId && members.length > 0 && (
                        <div className="mt-3 p-3 bg-[var(--background-tertiary)]/50 rounded-lg">
                          <p className="text-xs text-[var(--foreground-muted)] mb-2">メンバー:</p>
                          <div className="flex flex-wrap gap-2">
                            {members.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center gap-1.5 px-2 py-1 bg-[var(--background-secondary)] rounded-full"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: m.color }}
                                />
                                <span className="text-[var(--foreground)] text-xs">{m.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="e.g., BLACKPINK"
                      className="w-full px-3 py-2 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-xl border border-[var(--card-border)] focus:border-pink-400 outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">
                    お名前（任意）
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="例: ダンスファン123"
                    className="w-full px-3 py-2 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-xl border border-[var(--card-border)] focus:border-pink-400 outline-none"
                  />
                </div>

                {/* 重複エラー表示 */}
                {duplicateError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{duplicateError}</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleLoadVideo}
                  disabled={
                    !youtubeVideoId.trim() ||
                    !videoTitle.trim() ||
                    (artistMode === 'new' && !artistName.trim()) ||
                    (artistMode === 'existing' && !selectedArtistId) ||
                    !!duplicateError
                  }
                >
                  動画を読み込む
                </Button>

                {isLoadingArtists && (
                  <p className="text-[var(--foreground-muted)] text-sm text-center">
                    アーティスト情報を読み込み中...
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Editor UI */}
            {/* 戻るボタン */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  if (formations.length > 0) {
                    if (confirm('編集内容は保存されません。戻りますか？')) {
                      router.push('/')
                    }
                  } else {
                    router.push('/')
                  }
                }}
                className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>ホームに戻る</span>
              </button>
              <div className="text-sm text-[var(--foreground-muted)]">
                <span className="text-[var(--foreground)]">{videoTitle}</span>
                <span className="mx-2">-</span>
                <span>{artistName}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left: Video + Stage */}
              <div className="col-span-2 space-y-4">
                {/* Video */}
                <div>
                  <h2 className="text-[var(--foreground-muted)] text-sm font-medium mb-2">
                    動画
                  </h2>
                  <YouTubePlayer
                    videoId={youtubeVideoId}
                    onReady={handleVideoReady}
                    onDurationChange={handleDurationChange}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>

                {/* Stage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[var(--foreground-muted)] text-sm font-medium">
                      フォーメーション
                      {currentFormation && (
                        <span className="ml-2 text-pink-400">
                          - {currentFormation.name} ({currentFormation.time}秒)
                        </span>
                      )}
                    </h2>
                    <span className="text-[var(--foreground-muted)] text-xs">
                      現在: {currentTime.toFixed(1)}秒 / {videoDuration.toFixed(1)}秒
                    </span>
                  </div>
                  <EditorStage
                    positions={currentFormation?.positions || []}
                    selectedMemberId={selectedMemberId}
                    onPositionChange={handlePositionChange}
                    onMemberSelect={setSelectedMemberId}
                  />
                </div>
              </div>

              {/* Right: Settings */}
              <div className="space-y-4">
                {/* Members */}
                <MemberSettings
                  members={members}
                  selectedMemberId={selectedMemberId}
                  onMemberSelect={setSelectedMemberId}
                  onMemberAdd={handleAddMember}
                  onMemberUpdate={handleUpdateMember}
                  onMemberDelete={handleDeleteMember}
                  readOnly={artistMode === 'existing'}
                />

                {/* Formations */}
                <FormationList
                  formations={formations}
                  currentFormationId={currentFormationId}
                  onFormationSelect={handleSelectFormation}
                  onFormationAdd={handleAddFormation}
                  onFormationDelete={handleDeleteFormation}
                  onFormationTimeChange={handleFormationTimeChange}
                  onFormationNameChange={handleFormationNameChange}
                />

                {/* Save Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSave}
                  disabled={members.length === 0 || formations.length === 0 || isSaving}
                >
                  {isSaving ? '保存中...' : '保存する'}
                </Button>

                {/* Error Message */}
                {saveError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {saveError}
                  </div>
                )}

                {/* Info */}
                <div className="bg-[var(--card-bg)]/50 rounded-2xl p-3 text-xs text-[var(--foreground-muted)]">
                  <p className="mb-2">
                    <strong className="text-[var(--foreground)]">ヒント:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {artistMode === 'new' && (
                      <li>まずメンバーを追加し、フォーメーションを作成</li>
                    )}
                    <li>ステージ上でメンバーをドラッグして配置</li>
                    <li>動画に合わせてフォーメーションの時間を設定</li>
                    <li>動画を再生してプレビュー</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
