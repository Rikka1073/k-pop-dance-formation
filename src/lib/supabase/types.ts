export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      members: {
        Row: {
          id: string
          artist_id: string
          name: string
          color: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          name: string
          color: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          name?: string
          color?: string
          display_order?: number
          created_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          artist_id: string
          youtube_video_id: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          youtube_video_id: string
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          youtube_video_id?: string
          title?: string
          created_at?: string
        }
      }
      formation_data: {
        Row: {
          id: string
          video_id: string
          contributor_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          contributor_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          contributor_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      formations: {
        Row: {
          id: string
          formation_data_id: string
          time: number
          name: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          formation_data_id: string
          time: number
          name?: string | null
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          formation_data_id?: string
          time?: number
          name?: string | null
          display_order?: number
          created_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          formation_id: string
          member_id: string
          x: number
          y: number
          created_at: string
        }
        Insert: {
          id?: string
          formation_id: string
          member_id: string
          x: number
          y: number
          created_at?: string
        }
        Update: {
          id?: string
          formation_id?: string
          member_id?: string
          x?: number
          y?: number
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Artist = Database['public']['Tables']['artists']['Row']
export type Member = Database['public']['Tables']['members']['Row']
export type Video = Database['public']['Tables']['videos']['Row']
export type FormationData = Database['public']['Tables']['formation_data']['Row']
export type Formation = Database['public']['Tables']['formations']['Row']
export type Position = Database['public']['Tables']['positions']['Row']
