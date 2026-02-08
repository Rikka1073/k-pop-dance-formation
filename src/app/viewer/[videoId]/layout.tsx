import { Metadata } from 'next'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideoById } from '@/lib/supabase/queries'
import { sampleVideo, sampleArtist } from '@/data/mock/sample-formation'

const BASE_URL = 'https://example.com'

type Props = {
  params: Promise<{ videoId: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params

  // Check if this is the sample video
  if (videoId === sampleVideo.id) {
    return {
      title: `${sampleVideo.title} - ${sampleArtist.name}`,
      description: `${sampleArtist.name}の「${sampleVideo.title}」のフォーメーションを動画と同期して確認できます。`,
      openGraph: {
        title: `${sampleVideo.title} - ${sampleArtist.name}`,
        description: `${sampleArtist.name}の「${sampleVideo.title}」のフォーメーションを動画と同期して確認できます。`,
        url: `${BASE_URL}/viewer/${videoId}`,
        type: 'video.other',
        images: [`https://img.youtube.com/vi/${sampleVideo.youtubeVideoId}/maxresdefault.jpg`],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${sampleVideo.title} - ${sampleArtist.name}`,
        description: `${sampleArtist.name}の「${sampleVideo.title}」のフォーメーションを確認`,
        images: [`https://img.youtube.com/vi/${sampleVideo.youtubeVideoId}/maxresdefault.jpg`],
      },
    }
  }

  // Try to fetch from database
  if (isSupabaseConfigured()) {
    try {
      const video = await getVideoById(videoId)
      if (video) {
        return {
          title: `${video.title} - ${video.artist.name}`,
          description: `${video.artist.name}の「${video.title}」のフォーメーションを動画と同期して確認できます。`,
          openGraph: {
            title: `${video.title} - ${video.artist.name}`,
            description: `${video.artist.name}の「${video.title}」のフォーメーションを動画と同期して確認できます。`,
            url: `${BASE_URL}/viewer/${videoId}`,
            type: 'video.other',
            images: [`https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`],
          },
          twitter: {
            card: 'summary_large_image',
            title: `${video.title} - ${video.artist.name}`,
            description: `${video.artist.name}の「${video.title}」のフォーメーションを確認`,
            images: [`https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`],
          },
        }
      }
    } catch (error) {
      console.error('Failed to fetch video metadata:', error)
    }
  }

  // Fallback metadata
  return {
    title: 'Formation Viewer',
    description: 'K-POPダンスのフォーメーションを動画と同期して確認できます。',
  }
}

export default function ViewerLayout({ children }: Props) {
  return <>{children}</>
}
