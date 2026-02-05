import { supabase } from './client'
import type {
  Artist,
  Member,
  Video,
  FormationData,
  Formation,
  Position,
} from './types'

// Artist with members
export type ArtistWithMembers = Artist & {
  members: Member[]
}

// Video with artist
export type VideoWithArtist = Video & {
  artist: ArtistWithMembers
}

// Formation with positions
export type FormationWithPositions = Formation & {
  positions: Position[]
}

// Full formation data with all relations
export type FullFormationData = FormationData & {
  video: VideoWithArtist
  formations: FormationWithPositions[]
}

// ============ Artists ============

export async function getArtists(): Promise<ArtistWithMembers[]> {
  const { data, error } = await supabase
    .from('artists')
    .select(`
      *,
      members (*)
    `)
    .order('name')

  if (error) throw error
  return data as ArtistWithMembers[]
}

export async function getArtistById(id: string): Promise<ArtistWithMembers | null> {
  const { data, error } = await supabase
    .from('artists')
    .select(`
      *,
      members (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as ArtistWithMembers
}

export async function createArtist(name: string): Promise<Artist> {
  const { data, error } = await supabase
    .from('artists')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ Members ============

export async function createMember(
  artistId: string,
  name: string,
  color: string,
  displayOrder: number
): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert({
      artist_id: artistId,
      name,
      color,
      display_order: displayOrder,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMember(
  id: string,
  updates: { name?: string; color?: string; display_order?: number }
): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ Videos ============

export async function getVideos(): Promise<VideoWithArtist[]> {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      artist:artists (
        *,
        members (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as VideoWithArtist[]
}

export async function getVideoById(id: string): Promise<VideoWithArtist | null> {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      artist:artists (
        *,
        members (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as VideoWithArtist
}

export async function createVideo(
  artistId: string,
  youtubeVideoId: string,
  title: string
): Promise<Video> {
  const { data, error } = await supabase
    .from('videos')
    .insert({
      artist_id: artistId,
      youtube_video_id: youtubeVideoId,
      title,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ Formation Data ============

export async function getFormationDataByVideoId(
  videoId: string
): Promise<FullFormationData | null> {
  const { data, error } = await supabase
    .from('formation_data')
    .select(`
      *,
      video:videos (
        *,
        artist:artists (
          *,
          members (*)
        )
      ),
      formations (
        *,
        positions (*)
      )
    `)
    .eq('video_id', videoId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Sort formations by time
  if (data?.formations) {
    data.formations.sort((a: Formation, b: Formation) => a.time - b.time)
  }

  return data as FullFormationData
}

export async function createFormationData(
  videoId: string,
  contributorName?: string
): Promise<FormationData> {
  const { data, error } = await supabase
    .from('formation_data')
    .insert({
      video_id: videoId,
      contributor_name: contributorName,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============ Formations ============

export async function createFormation(
  formationDataId: string,
  time: number,
  name: string | null,
  displayOrder: number
): Promise<Formation> {
  const { data, error } = await supabase
    .from('formations')
    .insert({
      formation_data_id: formationDataId,
      time,
      name,
      display_order: displayOrder,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFormation(
  id: string,
  updates: { time?: number; name?: string | null }
): Promise<Formation> {
  const { data, error } = await supabase
    .from('formations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFormation(id: string): Promise<void> {
  const { error } = await supabase.from('formations').delete().eq('id', id)
  if (error) throw error
}

// ============ Positions ============

export async function createPosition(
  formationId: string,
  memberId: string,
  x: number,
  y: number
): Promise<Position> {
  const { data, error } = await supabase
    .from('positions')
    .insert({
      formation_id: formationId,
      member_id: memberId,
      x,
      y,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePosition(
  id: string,
  updates: { x?: number; y?: number }
): Promise<Position> {
  const { data, error } = await supabase
    .from('positions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function upsertPositions(
  positions: { formation_id: string; member_id: string; x: number; y: number }[]
): Promise<Position[]> {
  const { data, error } = await supabase
    .from('positions')
    .upsert(positions, {
      onConflict: 'formation_id,member_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) throw error
  return data
}

// ============ Bulk Operations ============

export async function saveFullFormation(params: {
  videoId: string
  contributorName?: string
  formations: {
    time: number
    name?: string
    positions: { memberId: string; x: number; y: number }[]
  }[]
}): Promise<FormationData> {
  const { videoId, contributorName, formations } = params

  // Create formation data
  const formationData = await createFormationData(videoId, contributorName)

  // Create formations and positions
  for (let i = 0; i < formations.length; i++) {
    const f = formations[i]
    const formation = await createFormation(
      formationData.id,
      f.time,
      f.name || null,
      i
    )

    // Create positions for this formation
    for (const pos of f.positions) {
      await createPosition(formation.id, pos.memberId, pos.x, pos.y)
    }
  }

  return formationData
}
