import { Metadata } from 'next'

export const runtime = 'edge'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideoById } from '@/lib/supabase/queries'
import { sampleVideo, sampleArtist } from '@/data/mock/sample-formation'

type Props = {
  params: Promise<{ videoId: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params

  // 編集ページはインデックスさせない
  const base = {
    robots: { index: false, follow: false },
  }

  if (videoId === sampleVideo.id) {
    return { ...base, title: `編集: ${sampleVideo.title} - ${sampleArtist.name}` }
  }

  if (isSupabaseConfigured()) {
    try {
      const video = await getVideoById(videoId)
      if (video) {
        return { ...base, title: `編集: ${video.title} - ${video.artist.name}` }
      }
    } catch { /* ignore */ }
  }

  return { ...base, title: 'フォーメーション編集' }
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
