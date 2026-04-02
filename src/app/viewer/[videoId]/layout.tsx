import { Metadata } from 'next'

export const runtime = 'edge'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideoById } from '@/lib/supabase/queries'
import Script from 'next/script'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type Props = {
  params: Promise<{ videoId: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params

  if (isSupabaseConfigured()) {
    try {
      const video = await getVideoById(videoId)
      if (video) {
        const title = `${video.title} - ${video.artist.name}`
        const description = `${video.artist.name}の「${video.title}」のフォーメーションを動画と同期して確認できます。`
        const ogImage = `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`
        return {
          title,
          description,
          alternates: { canonical: `${siteUrl}/viewer/${videoId}` },
          openGraph: { title, description, url: `${siteUrl}/viewer/${videoId}`, type: 'video.other', images: [ogImage] },
          twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
        }
      }
    } catch (error) {
      console.error('Failed to fetch video metadata:', error)
    }
  }

  return {
    title: 'Formation Viewer',
    description: 'K-POPダンスのフォーメーションを動画と同期して確認できます。',
  }
}

export default async function ViewerLayout({ params, children }: Props) {
  const { videoId } = await params

  // JSON-LD 構造化データ
  let jsonLd: object | null = null
  if (isSupabaseConfigured()) {
    try {
      const video = await getVideoById(videoId)
      if (video) {
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${video.title} - ${video.artist.name}`,
          description: `${video.artist.name}の「${video.title}」のダンスフォーメーション`,
          url: `${siteUrl}/viewer/${videoId}`,
        }
      }
    } catch { /* ignore */ }
  }

  return (
    <>
      {jsonLd && (
        <Script
          id="json-ld-viewer"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
