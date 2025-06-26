'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useParams } from 'next/navigation'
import { Database } from '@/types/database'
import Link from 'next/link'

type Project = Database['public']['Tables']['projects']['Row']
type Video = Database['public']['Tables']['videos']['Row']

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'deadline' | 'status' | 'publish'>('deadline')
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    publish_date: ''
  })
  const { user } = useSupabase()
  const supabase = createClient()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    fetchProjectData()
  }, [projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProjectData = async () => {
    const [projectResult, videosResult] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single(),
      supabase
        .from('videos')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
    ])

    if (!projectResult.error && projectResult.data) {
      setProject(projectResult.data)
    }

    if (!videosResult.error && videosResult.data) {
      setVideos(videosResult.data)
    }

    setIsLoading(false)
  }

  const createVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { data, error } = await supabase
      .from('videos')
      .insert({
        project_id: projectId,
        title: newVideo.title,
        description: newVideo.description,
        publish_date: newVideo.publish_date || null,
        created_by: user.id,
        status: 'draft',
        current_step: '初稿'
      })
      .select()
      .single()

    if (!error && data) {
      setVideos([data, ...videos])
      setNewVideo({ title: '', description: '', publish_date: '' })
      setShowCreateForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const sortedVideos = [...videos].sort((a, b) => {
    switch (activeTab) {
      case 'deadline':
        if (!a.publish_date && !b.publish_date) return 0
        if (!a.publish_date) return 1
        if (!b.publish_date) return -1
        return new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime()
      case 'status':
        return a.status.localeCompare(b.status)
      case 'publish':
        if (!a.publish_date && !b.publish_date) return 0
        if (!a.publish_date) return 1
        if (!b.publish_date) return -1
        return new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime()
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">プロジェクトが見つかりません</h2>
          <Link href="/dashboard/projects" className="text-indigo-600 hover:text-indigo-500">
            プロジェクト一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <nav className="text-sm breadcrumbs mb-4">
          <Link href="/dashboard/projects" className="text-indigo-600 hover:text-indigo-500">
            プロジェクト
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{project.name}</span>
        </nav>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
              {project.client_name && (
                <p className="text-gray-600 mb-2">クライアント: {project.client_name}</p>
              )}
              {project.description && (
                <p className="text-gray-700">{project.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              新規動画追加
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('deadline')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'deadline'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              締切順
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'status'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ステータス順
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'publish'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              公開日順
            </button>
          </nav>
        </div>

        <div className="p-6">
          {sortedVideos.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">動画がありません</h3>
              <p className="mt-1 text-sm text-gray-500">新しい動画を追加して始めましょう。</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVideos.map((video) => (
                <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{video.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(video.status)}`}>
                          {video.status === 'draft' && 'ドラフト'}
                          {video.status === 'in_progress' && '制作中'}
                          {video.status === 'review' && 'レビュー中'}
                          {video.status === 'completed' && '完了'}
                        </span>
                        {video.current_step && (
                          <span>現在: {video.current_step}</span>
                        )}
                        {video.publish_date && (
                          <span>公開予定: {new Date(video.publish_date).toLocaleDateString('ja-JP')}</span>
                        )}
                      </div>
                      {video.description && (
                        <p className="mt-2 text-gray-600 text-sm">{video.description}</p>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/videos/${video.id}`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      詳細 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">新規動画追加</h3>
            <form onSubmit={createVideo}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  動画タイトル *
                </label>
                <input
                  type="text"
                  required
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="例: 商品レビュー#1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="動画の概要を入力"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公開予定日
                </label>
                <input
                  type="date"
                  value={newVideo.publish_date}
                  onChange={(e) => setNewVideo({ ...newVideo, publish_date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}