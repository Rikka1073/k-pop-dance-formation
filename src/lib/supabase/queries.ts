import { supabase } from './client'
import type {
  Artist,
  Member,
  Video,
  FormationData,
  Formation,
  Position,
} from './types'

// Error for when Supabase is not configured
class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
    this.name = 'SupabaseNotConfiguredError'
  }
}

function getSupabaseClient() {
  if (!supabase) {
    throw new SupabaseNotConfiguredError()
  }
  return supabase
}

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
  const client = getSupabaseClient()
  const { data, error } = await client
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
  const client = getSupabaseClient()
  const { data, error } = await client
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
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('artists')
    .insert({ name } as never)
    .select()
    .single()

  if (error) throw error
  return data as Artist
}

// ============ Members ============

export async function createMember(
  artistId: string,
  name: string,
  color: string,
  displayOrder: number
): Promise<Member> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('members')
    .insert({
      artist_id: artistId,
      name,
      color,
      display_order: displayOrder,
    } as never)
    .select()
    .single()

  if (error) throw error
  return data as Member
}

export async function updateMember(
  id: string,
  updates: { name?: string; color?: string; display_order?: number }
): Promise<Member> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('members')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Member
}

// ============ Videos ============

export async function getVideos(): Promise<VideoWithArtist[]> {
  const client = getSupabaseClient()
  const { data, error } = await client
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
  const client = getSupabaseClient()
  const { data, error } = await client
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
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('videos')
    .insert({
      artist_id: artistId,
      youtube_video_id: youtubeVideoId,
      title,
    } as never)
    .select()
    .single()

  if (error) throw error
  return data as Video
}

// ============ Formation Data ============

export async function getFormationDataByVideoId(
  videoId: string
): Promise<FullFormationData | null> {
  const client = getSupabaseClient()

  // Get the most recent formation_data for this video
  const { data, error } = await client
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
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('getFormationDataByVideoId error:', error)
    throw error
  }

  // Return null if no data found
  if (!data || data.length === 0) {
    return null
  }

  const result = data[0] as FullFormationData

  // Sort formations by time
  if (result?.formations) {
    result.formations.sort((a, b) => a.time - b.time)
  }

  return result
}

export async function createFormationData(
  videoId: string,
  contributorName?: string
): Promise<FormationData> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('formation_data')
    .insert({
      video_id: videoId,
      contributor_name: contributorName,
    } as never)
    .select()
    .single()

  if (error) throw error
  return data as FormationData
}

export async function deleteFormationDataByVideoId(videoId: string): Promise<void> {
  const client = getSupabaseClient()
  const { error } = await client
    .from('formation_data')
    .delete()
    .eq('video_id', videoId)

  if (error) throw error
}

// ============ Formations ============

export async function createFormation(
  formationDataId: string,
  time: number,
  name: string | null,
  displayOrder: number
): Promise<Formation> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('formations')
    .insert({
      formation_data_id: formationDataId,
      time,
      name,
      display_order: displayOrder,
    } as never)
    .select()
    .single()

  if (error) throw error
  return data as Formation
}

export async function updateFormation(
  id: string,
  updates: { time?: number; name?: string | null }
): Promise<Formation> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('formations')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Formation
}

export async function deleteFormation(id: string): Promise<void> {
  const client = getSupabaseClient()
  const { error } = await client.from('formations').delete().eq('id', id)
  if (error) throw error
}

// ============ Positions ============

export async function createPosition(
  formationId: string,
  memberId: string,
  x: number,
  y: number
): Promise<Position> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('positions')
    .insert({
      formation_id: formationId,
      member_id: memberId,
      x,
      y,
    } as never)
    .select()
    .single()

  if (error) throw error
  return data as Position
}

export async function updatePosition(
  id: string,
  updates: { x?: number; y?: number }
): Promise<Position> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('positions')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Position
}

export async function upsertPositions(
  positions: { formation_id: string; member_id: string; x: number; y: number }[]
): Promise<Position[]> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('positions')
    .upsert(positions as never, {
      onConflict: 'formation_id,member_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) throw error
  return data as Position[]
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
