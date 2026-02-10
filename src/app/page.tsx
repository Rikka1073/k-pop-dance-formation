'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { sampleArtist, sampleVideo, sampleFormationData } from '@/data/mock/sample-formation'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getVideos, VideoWithArtist } from '@/lib/supabase/queries'

interface VideoCardData {
  id: string
  title: string
  artistName: string
  youtubeVideoId: string
  members: { id: string; name: string; color: string }[]
  formationCount?: number
}

export default function HomePage() {
  const [videos, setVideos] = useState<VideoCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadVideos() {
      setIsLoading(true)

      // Start with sample video
      const allVideos: VideoCardData[] = [
        {
          id: sampleVideo.id,
          title: sampleVideo.title,
          artistName: sampleArtist.name,
          youtubeVideoId: sampleVideo.youtubeVideoId,
          members: sampleArtist.members.map((m) => ({
            id: m.id,
            name: m.name,
            color: m.color,
          })),
          formationCount: sampleFormationData.formations.length,
        },
      ]

      // Load from Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const dbVideos = await getVideos()
          for (const v of dbVideos) {
            allVideos.push({
              id: v.id,
              title: v.title,
              artistName: v.artist.name,
              youtubeVideoId: v.youtube_video_id,
              members: v.artist.members.map((m) => ({
                id: m.id,
                name: m.name,
                color: m.color,
              })),
            })
          }
        } catch (error) {
          console.error('Failed to load videos:', error)
        }
      }

      setVideos(allVideos)
      setIsLoading(false)
    }

    loadVideos()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">✨</span>
            <h1 className="text-5xl font-bold">
              <span className="text-pink-400">K-POP Formation</span>{' '}
              <span className="text-violet-400">Viewer</span>
            </h1>
            <span className="text-3xl">💫</span>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Watch K-POP dance videos with synchronized formation visualization.
            Perfect for learning choreography and understanding member positions.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400 text-white font-semibold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Formation
          </Link>
        </section>

        {/* コンテンツ */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Available Formations</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/viewer/${video.id}`}
                  className="group bg-gray-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-pink-400 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1 transition-all duration-200"
                >
                  {/* サムネイル */}
                  <div className="relative aspect-video bg-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <svg
                          className="w-8 h-8 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* メンバープレビュー */}
                    <div className="absolute inset-0 opacity-50">
                      {video.members.slice(0, 8).map((member, idx) => {
                        const angle = (idx / video.members.length) * 2 * Math.PI
                        const x = 50 + 25 * Math.cos(angle)
                        const y = 50 + 25 * Math.sin(angle)
                        return (
                          <div
                            key={member.id}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              backgroundColor: member.color,
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-1 group-hover:text-pink-400 transition-colors truncate">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{video.artistName}</p>

                    {/* メンバーアイコン */}
                    <div className="flex gap-1 flex-wrap">
                      {video.members.slice(0, 8).map((member) => (
                        <div
                          key={member.id}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: member.color }}
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {video.members.length > 8 && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-600 text-white text-xs">
                          +{video.members.length - 8}
                        </div>
                      )}
                    </div>

                    {/* メタ情報 */}
                    <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-4 text-xs text-gray-500">
                      {video.formationCount !== undefined && (
                        <span>{video.formationCount} formations</span>
                      )}
                      <span>{video.members.length} members</span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* プレースホルダーカード */}
              <Link
                href="/editor"
                className="bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700 p-8 flex flex-col items-center justify-center text-center hover:border-pink-400 hover:bg-gray-800/70 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Add your own formation</p>
              </Link>
            </div>
          )}
        </section>

        {/* 説明セクション */}
        <section className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Sync with Video</h3>
            <p className="text-gray-400 text-sm">
              Formation positions update in real-time as the video plays
            </p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Track Members</h3>
            <p className="text-gray-400 text-sm">
              Select a member to highlight their position and movement path
            </p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">➡️</span>
            </div>
            <h3 className="text-white font-semibold mb-2">See Movement</h3>
            <p className="text-gray-400 text-sm">
              Arrows show where each member will move next
            </p>
          </div>
        </section>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
