'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  createArtist,
  createMember,
  createVideo,
  createFormationData,
  createFormation,
  createPosition,
  ArtistWithMembers,
} from '@/lib/supabase/queries'

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

  // ============ Video Handlers ============

  const handleLoadVideo = () => {
    if (!youtubeVideoId.trim()) return
    setIsVideoLoaded(true)
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
    <div className="min-h-screen bg-gray-950">
      <Header title="Formation Editor" />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Step 1: Video Setup */}
        {!isVideoLoaded ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Step 1: Video Setup
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    YouTube Video ID or URL
                  </label>
                  <input
                    type="text"
                    value={youtubeVideoId}
                    onChange={(e) => {
                      // Extract video ID from URL if needed
                      const input = e.target.value
                      const match = input.match(
                        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
                      )
                      setYoutubeVideoId(match ? match[1] : input)
                    }}
                    placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g., BLACKPINK - DDU-DU DDU-DU Dance Practice"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Artist Selection */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Artist/Group
                  </label>

                  {/* Artist Mode Toggle */}
                  {existingArtists.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleArtistModeChange('existing')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          artistMode === 'existing'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        既存のアーティスト
                      </button>
                      <button
                        onClick={() => handleArtistModeChange('new')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          artistMode === 'new'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
                      >
                        <option value="">アーティストを選択...</option>
                        {existingArtists.map((artist) => (
                          <option key={artist.id} value={artist.id}>
                            {artist.name} ({artist.members.length}人)
                          </option>
                        ))}
                      </select>

                      {/* Show selected artist's members */}
                      {selectedArtistId && members.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-xs text-gray-400 mb-2">メンバー:</p>
                          <div className="flex flex-wrap gap-2">
                            {members.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-600 rounded-full"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: m.color }}
                                />
                                <span className="text-white text-xs">{m.name}</span>
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
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="e.g., DanceFan123"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleLoadVideo}
                  disabled={
                    !youtubeVideoId.trim() ||
                    !videoTitle.trim() ||
                    (artistMode === 'new' && !artistName.trim()) ||
                    (artistMode === 'existing' && !selectedArtistId)
                  }
                >
                  Load Video & Continue
                </Button>

                {isLoadingArtists && (
                  <p className="text-gray-400 text-sm text-center">
                    アーティスト情報を読み込み中...
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Editor UI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Video + Stage */}
              <div className="lg:col-span-2 space-y-4">
                {/* Video */}
                <div>
                  <h2 className="text-white/60 text-sm font-medium mb-2">
                    Video Reference
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
                    <h2 className="text-white/60 text-sm font-medium">
                      Formation Stage
                      {currentFormation && (
                        <span className="ml-2 text-purple-400">
                          - {currentFormation.name} ({currentFormation.time}s)
                        </span>
                      )}
                    </h2>
                    <span className="text-white/40 text-xs">
                      Current: {currentTime.toFixed(1)}s / {videoDuration.toFixed(1)}s
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
                  {isSaving ? 'Saving...' : 'Save Formation Data'}
                </Button>

                {/* Error Message */}
                {saveError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {saveError}
                  </div>
                )}

                {/* Info */}
                <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400">
                  <p className="mb-2">
                    <strong className="text-white">Tips:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {artistMode === 'new' && (
                      <li>First add members, then create formations</li>
                    )}
                    <li>Drag members on the stage to position them</li>
                    <li>Set the time for each formation to match the video</li>
                    <li>Preview by playing the video</li>
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
