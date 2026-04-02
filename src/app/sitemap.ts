import { MetadataRoute } from 'next'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideos } from '@/lib/supabase/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/editor`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  const videoPages: MetadataRoute.Sitemap = []

  // Fetch videos from database if Supabase is configured
  if (isSupabaseConfigured()) {
    try {
      const videos = await getVideos()
      for (const video of videos) {
        videoPages.push({
          url: `${BASE_URL}/viewer/${video.id}`,
          lastModified: new Date(video.created_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    } catch (error) {
      console.error('Failed to fetch videos for sitemap:', error)
    }
  }

  return [...staticPages, ...videoPages]
}
