'use client'

import { useState, useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  getFormationDataByVideoId,
  getVideoById,
  createFormationData,
  createFormation,
  createPosition,
  deleteFormation as deleteFormationFromDB,
  deleteFormationDataByVideoId,
} from '@/lib/supabase/queries'
import {
  sampleArtist,
  sampleVideo,
  sampleFormationData,
} from '@/data/mock/sample-formation'

// Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface EditorFormation {
  id: string
  time: number
  name: string
  positions: (Position & { member: Member })[]
}

export default function EditVideoPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.videoId as string

  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Video settings (read-only for existing videos)
  const [youtubeVideoId, setYoutubeVideoId] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [contributorName, setContributorName] = useState('')
  const [videoDuration, setVideoDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Members
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  // Formations
  const [formations, setFormations] = useState<EditorFormation[]>([])
  const [currentFormationId, setCurrentFormationId] = useState<string | null>(null)

  // DB IDs for updating
  const [formationDataId, setFormationDataId] = useState<string | null>(null)

  // Get current formation
  const currentFormation = formations.find((f) => f.id === currentFormationId)

  // Load existing data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setLoadError(null)

      // Check if this is the sample video
      if (videoId === sampleVideo.id) {
        setYoutubeVideoId(sampleVideo.youtubeVideoId)
        setVideoTitle(sampleVideo.title)
        setArtistName(sampleArtist.name)
        setContributorName(sampleFormationData.contributorName || '')
        setMembers(sampleArtist.members)
        setFormations(
          sampleFormationData.formations.map((f) => ({
            id: f.id,
            time: f.time,
            name: f.name || '',
            positions: f.positions.map((p) => ({
              ...p,
              member: sampleArtist.members.find((m) => m.id === p.memberId)!,
            })),
          }))
        )
        if (sampleFormationData.formations.length > 0) {
          setCurrentFormationId(sampleFormationData.formations[0].id)
        }
        setIsLoading(false)
        return
      }

      // Load from Supabase
      if (!isSupabaseConfigured()) {
        setLoadError('Supabaseが設定されていません')
        setIsLoading(false)
        return
      }

      try {
        // Try to get formation data first
        const formationData = await getFormationDataByVideoId(videoId)

        if (formationData) {
          setFormationDataId(formationData.id)
          setYoutubeVideoId(formationData.video.youtube_video_id)
          setVideoTitle(formationData.video.title)
          setArtistName(formationData.video.artist.name)
          setContributorName(formationData.contributor_name || '')

          const loadedMembers: Member[] = formationData.video.artist.members.map((m) => ({
            id: m.id,
            artistId: m.artist_id,
            name: m.name,
            color: m.color,
            order: m.display_order,
          }))
          setMembers(loadedMembers)

          const loadedFormations: EditorFormation[] = formationData.formations.map((f) => ({
            id: f.id,
            time: f.time,
            name: f.name || '',
            positions: f.positions.map((p) => ({
              memberId: p.member_id,
              x: p.x,
              y: p.y,
              member: loadedMembers.find((m) => m.id === p.member_id)!,
            })),
          }))
          setFormations(loadedFormations)

          if (loadedFormations.length > 0) {
            setCurrentFormationId(loadedFormations[0].id)
          }
        } else {
          // Try to get video without formation data
          const video = await getVideoById(videoId)
          if (video) {
            setYoutubeVideoId(video.youtube_video_id)
            setVideoTitle(video.title)
            setArtistName(video.artist.name)

            const loadedMembers: Member[] = video.artist.members.map((m) => ({
              id: m.id,
              artistId: m.artist_id,
              name: m.name,
              color: m.color,
              order: m.display_order,
            }))
            setMembers(loadedMembers)
          } else {
            setLoadError('動画が見つかりません')
          }
        }
      } catch (err) {
        console.error('Load error:', err)
        setLoadError('データの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [videoId])

  // ============ Video Handlers ============

  const handleDurationChange = useCallback((duration: number) => {
    setVideoDuration(duration)
  }, [])

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

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
    if (videoId === sampleVideo.id) {
      alert('サンプルデータは編集できません')
      return
    }

    if (!isSupabaseConfigured()) {
      alert('Supabaseが設定されていません')
      return
    }

    if (formations.length === 0) {
      alert('フォーメーションを追加してください')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // Delete old formation data first
      await deleteFormationDataByVideoId(videoId)

      // Create new formation data
      const newFormationData = await createFormationData(
        videoId,
        contributorName || undefined
      )

      // Create formations and positions
      for (let i = 0; i < formations.length; i++) {
        const f = formations[i]
        const dbFormation = await createFormation(
          newFormationData.id,
          f.time,
          f.name || null,
          i
        )

        // Create positions
        for (const pos of f.positions) {
          await createPosition(dbFormation.id, pos.memberId, pos.x, pos.y)
        }
      }

      alert('保存が完了しました！')
      router.push(`/viewer/${videoId}`)
    } catch (error) {
      console.error('Save error:', error)
      setSaveError(error instanceof Error ? error.message : '保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header title="Formation Editor" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header title="Formation Editor" />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-red-400">{loadError}</div>
          <a href="/" className="text-purple-400 hover:underline">
            ホームに戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header title={`Edit: ${videoTitle}`} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Video Info Banner */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold">{videoTitle}</h2>
              <p className="text-gray-400 text-sm">{artistName}</p>
            </div>
            <a
              href={`/viewer/${videoId}`}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              View Mode →
            </a>
          </div>
        </div>

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
            {/* Members (read-only display) */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Members</h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <span className="text-white text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>

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
              disabled={formations.length === 0 || isSaving || videoId === sampleVideo.id}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>

            {videoId === sampleVideo.id && (
              <p className="text-yellow-500 text-xs text-center">
                サンプルデータは編集できません
              </p>
            )}

            {/* Error Message */}
            {saveError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {saveError}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
