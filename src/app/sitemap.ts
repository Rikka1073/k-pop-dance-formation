import { MetadataRoute } from 'next'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideos } from '@/lib/supabase/queries'
import { sampleVideo } from '@/data/mock/sample-formation'

const BASE_URL = 'https://example.com'

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
  ]

  // Add sample video
  const videoPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/viewer/${sampleVideo.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

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
