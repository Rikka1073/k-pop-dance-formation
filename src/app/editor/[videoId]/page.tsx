'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout'
import { Button, LoadingSpinner } from '@/components/ui'
import {
  EditorStage,
  FormationList,
  MemberSettings,
  CoordinateInput,
} from '@/components/editor'
import { YouTubePlayer, YouTubePlayerHandle, Timeline } from '@/components/viewer'
import { Member, Position } from '@/types'
import { isSupabaseConfigured } from '@/lib/supabase'
import { TemplateType, getTemplatePositions } from '@/lib/formation-templates'
import {
  getFormationDataByVideoId,
  getVideoById,
  createFormationData,
  createFormation,
  createPosition,
  createMember,
  updateMember,
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

const DEFAULT_COLORS = [
  '#FF2D78', '#FF6B9D', '#FFAAA5', '#FF8B5A', '#FFD166',
  '#FFE66D', '#C8F7A6', '#88D8B0', '#06D6A0', '#95E1D3',
  '#4ECDC4', '#45B7D1', '#4A90D9', '#7C3AED', '#9D5CF0',
  '#C084FC', '#B8A9C9', '#F472B6', '#FB7185', '#A8DADC',
]

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

  const playerRef = useRef<YouTubePlayerHandle>(null)

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

  // Stage view option
  const [stageFlipped, setStageFlipped] = useState(true) // デフォルト: 観客側が下

  // Formations
  const [formations, setFormations] = useState<EditorFormation[]>([])
  const [currentFormationId, setCurrentFormationId] = useState<string | null>(null)

  // DB IDs for updating
  const [formationDataId, setFormationDataId] = useState<string | null>(null)

  // ローカルで追加した（未DB保存）メンバーのID集合
  const [addedMemberLocalIds, setAddedMemberLocalIds] = useState<Set<string>>(new Set())
  // 既存メンバーの変更追跡（name/color）
  const [updatedMemberIds, setUpdatedMemberIds] = useState<Set<string>>(new Set())

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

  const handleSeek = useCallback((time: number) => {
    playerRef.current?.seekTo(time)
  }, [])

  // ============ Formation Handlers ============

  const handleAddFormation = (template: TemplateType | 'inherit' = 'inherit') => {
    // 直前のフォーメーションを探す（現在時刻より前で最も近いもの、なければ最後のもの）
    const prevFormation = formations.length > 0
      ? (formations.filter(f => f.time <= currentTime).sort((a, b) => b.time - a.time)[0]
         ?? formations[formations.length - 1])
      : null

    const positions = (template === 'inherit' && prevFormation)
      ? members.map((m) => {
          const prev = prevFormation.positions.find(p => p.memberId === m.id)
          return { memberId: m.id, x: prev?.x ?? 50, y: prev?.y ?? 50, member: m }
        })
      : (() => {
          const pts = getTemplatePositions(template as TemplateType, members.length)
          return members.map((m, index) => ({
            memberId: m.id,
            x: pts[index]?.x ?? 50,
            y: pts[index]?.y ?? 50,
            member: m,
          }))
        })()

    const newFormation: EditorFormation = {
      id: generateId(),
      time: currentTime,
      name: `Formation ${formations.length + 1}`,
      positions,
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

  // ============ Member Handlers ============

  const handleAddMember = () => {
    const newId = generateId()
    const artistId = members.find(m => !addedMemberLocalIds.has(m.id))?.artistId || ''
    const newMember: Member = {
      id: newId,
      artistId,
      name: `Member ${members.length + 1}`,
      color: DEFAULT_COLORS[members.length % DEFAULT_COLORS.length],
      order: members.length,
    }
    setMembers(prev => [...prev, newMember])
    setAddedMemberLocalIds(prev => new Set([...prev, newId]))
    // 全フォーメーションにセンター位置で追加
    setFormations(prev => prev.map(f => ({
      ...f,
      positions: [...f.positions, { memberId: newId, x: 50, y: 50, member: newMember }],
    })))
  }

  const handleUpdateMember = (memberId: string, updates: { name?: string; color?: string }) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m))
    setFormations(prev => prev.map(f => ({
      ...f,
      positions: f.positions.map(p =>
        p.memberId === memberId ? { ...p, member: { ...p.member, ...updates } } : p
      ),
    })))
    // 既存メンバー（DB登録済み）の変更を記録
    if (!addedMemberLocalIds.has(memberId)) {
      setUpdatedMemberIds(prev => new Set([...prev, memberId]))
    }
  }

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId))
    setFormations(prev => prev.map(f => ({
      ...f,
      positions: f.positions.filter(p => p.memberId !== memberId),
    })))
    setAddedMemberLocalIds(prev => { const s = new Set(prev); s.delete(memberId); return s })
    setUpdatedMemberIds(prev => { const s = new Set(prev); s.delete(memberId); return s })
    if (selectedMemberId === memberId) setSelectedMemberId(null)
  }

  // ============ Save Handler ============
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async (redirectToViewer: boolean = false) => {
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
      // 新規追加メンバーをDBに保存し、ローカルID→DB IDのマップを作る
      const idMap: Record<string, string> = {}
      if (addedMemberLocalIds.size > 0) {
        const artistId = members.find(m => !addedMemberLocalIds.has(m.id))?.artistId || ''
        for (const member of members) {
          if (addedMemberLocalIds.has(member.id)) {
            const dbMember = await createMember(artistId, member.name, member.color, member.order)
            idMap[member.id] = (dbMember as { id: string }).id
          }
        }
        // StateをDB IDで更新
        setMembers(prev => prev.map(m => idMap[m.id] ? { ...m, id: idMap[m.id] } : m))
        setAddedMemberLocalIds(new Set())
      }

      // 既存メンバーの名前/カラー変更をDBに反映
      if (isSupabaseConfigured() && updatedMemberIds.size > 0) {
        for (const memberId of updatedMemberIds) {
          const member = members.find(m => m.id === memberId)
          if (member) {
            await updateMember(memberId, { name: member.name, color: member.color })
          }
        }
        setUpdatedMemberIds(new Set())
      }

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

        // Create positions (ローカルIDをDB IDに変換)
        for (const pos of f.positions) {
          const resolvedId = idMap[pos.memberId] || pos.memberId
          await createPosition(dbFormation.id, resolvedId, pos.x, pos.y)
        }
      }

      setLastSaved(new Date())

      if (redirectToViewer) {
        router.push(`/viewer/${videoId}`)
      }
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
      <div className="min-h-screen bg-[var(--background)]">
        <Header title="フォーメーション編集" />
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header title="フォーメーション編集" />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-red-400">{loadError}</div>
          <a href="/" className="text-pink-400 hover:underline">
            ホームに戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header title={`編集: ${videoTitle}`} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Video Info Banner */}
        <div
          className="rounded-2xl px-5 py-3.5 mb-6 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,45,120,0.12)' }}
        >
          <div>
            <h2 className="text-white font-black tracking-wide">{videoTitle}</h2>
            <p className="text-[var(--foreground-muted)] text-xs mt-0.5 tracking-wide">{artistName}</p>
          </div>
          <a
            href={`/viewer/${videoId}`}
            className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgba(124,58,237,0.12)', color: '#9D5CF0', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            View →
          </a>
        </div>

        {/* Main Content - Video & Formation side by side (same as Viewer) */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Video */}
          <div>
            <h2 className="text-[var(--foreground-muted)] text-sm font-medium mb-2">動画</h2>
            <YouTubePlayer
              ref={playerRef}
              videoId={youtubeVideoId}
              onDurationChange={handleDurationChange}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Formation Stage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[var(--foreground-muted)] text-sm font-medium">
                フォーメーション
                {currentFormation && (
                  <span className="ml-2 text-pink-400">
                    - {currentFormation.name}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stageFlipped}
                    onChange={(e) => setStageFlipped(e.target.checked)}
                    className="w-3 h-3 rounded border-gray-600 bg-[var(--background-tertiary)] text-pink-500"
                  />
                  <span className="text-[var(--foreground-muted)] text-xs">観客視点</span>
                </label>

              </div>
            </div>
            <EditorStage
              positions={currentFormation?.positions || []}
              selectedMemberId={selectedMemberId}
              onPositionChange={handlePositionChange}
              onMemberSelect={setSelectedMemberId}
              flipped={!stageFlipped}
            />
          </div>
        </div>

        {/* タイムライン */}
        <div className="mb-6">
          <Timeline
            formations={formations}
            currentTime={currentTime}
            duration={videoDuration}
            currentFormationName={currentFormation?.name}
            onSeek={handleSeek}
          />
        </div>

        {/* Bottom Controls - 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left: Members */}
          <div className="rounded-2xl overflow-hidden" style={{ backdropFilter: 'blur(24px) saturate(160%)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,45,120,0.16)' }}>
            <div className="max-h-80 overflow-y-auto">
              <MemberSettings
                members={members}
                selectedMemberId={selectedMemberId}
                onMemberSelect={setSelectedMemberId}
                onMemberAdd={handleAddMember}
                onMemberUpdate={handleUpdateMember}
                onMemberDelete={handleDeleteMember}
                readOnly={videoId === sampleVideo.id}
              />
            </div>

            {/* Coordinate Input (when member selected) */}
            {selectedMemberId && currentFormation && (() => {
              const position = currentFormation.positions.find((p) => p.memberId === selectedMemberId)
              if (!position) return null
              return (
                <div className="px-4 pb-3 pt-2" style={{ borderTop: '1px solid rgba(255,45,120,0.12)' }}>
                  <p className="text-[var(--foreground-muted)] text-xs mb-1.5">位置</p>
                  <div className="flex items-center gap-2 text-sm font-mono">
                    <span className="text-[var(--foreground-muted)] text-xs">X</span>
                    <span className="text-white">{Math.round(position.x - 50)}</span>
                    <span className="text-[var(--foreground-muted)] text-xs ml-2">Y</span>
                    <span className="text-white">{Math.round(position.y - 50)}</span>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Center: Formations List */}
          <FormationList
            formations={formations}
            currentFormationId={currentFormationId}
            onFormationSelect={handleSelectFormation}
            onFormationAdd={handleAddFormation}
            onFormationDelete={handleDeleteFormation}
            onFormationTimeChange={handleFormationTimeChange}
            onFormationNameChange={handleFormationNameChange}
          />

          {/* Right: Position & Save */}
          <div className="space-y-4">
            {/* Coordinate Input (detailed) */}
            {selectedMemberId && currentFormation && (() => {
              const selectedMember = members.find((m) => m.id === selectedMemberId)
              const position = currentFormation.positions.find((p) => p.memberId === selectedMemberId)
              if (!selectedMember || !position) return null
              return (
                <CoordinateInput
                  member={selectedMember}
                  x={position.x}
                  y={position.y}
                  onPositionChange={handlePositionChange}
                />
              )
            })()}

            {/* Save Buttons */}
            <div className="rounded-2xl p-4 space-y-3" style={{ backdropFilter: 'blur(24px) saturate(160%)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,45,120,0.16)' }}>
              {/* Quick Save */}
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => handleSave(false)}
                disabled={formations.length === 0 || isSaving || videoId === sampleVideo.id}
              >
                {isSaving ? '保存中...' : '上書き保存'}
              </Button>

              {/* Save & View */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSave(true)}
                disabled={formations.length === 0 || isSaving || videoId === sampleVideo.id}
              >
                {isSaving ? '保存中...' : '保存してビューアーへ'}
              </Button>

              {/* Last saved time */}
              {lastSaved && (
                <p className="text-green-400 text-xs text-center">
                  ✓ 保存済み ({lastSaved.toLocaleTimeString('ja-JP')})
                </p>
              )}

              {videoId === sampleVideo.id && (
                <p className="text-yellow-500 text-xs text-center">
                  サンプルデータは編集できません
                </p>
              )}

              {/* Error Message */}
              {saveError && (
                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {saveError}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
