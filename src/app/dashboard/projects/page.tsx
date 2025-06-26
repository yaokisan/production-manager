'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSupabase } from '@/components/providers/supabase-provider'
import Link from 'next/link'
import { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    client_name: '',
    description: ''
  })
  const { user } = useSupabase()
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProjects(data)
    }
    setIsLoading(false)
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    console.log('Creating project with user:', user.id)
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: newProject.name,
        client_name: newProject.client_name,
        description: newProject.description,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Project creation error:', error)
      alert(`エラー: ${error.message}`)
    } else if (data) {
      console.log('Project created successfully:', data)
      setProjects([data, ...projects])
      setNewProject({ name: '', client_name: '', description: '' })
      setShowCreateForm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">プロジェクト</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          新規プロジェクト作成
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">新規プロジェクト作成</h3>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  プロジェクト名 *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="例: A社YouTubeチャンネル"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  クライアント名
                </label>
                <input
                  type="text"
                  value={newProject.client_name}
                  onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="例: 株式会社A"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="プロジェクトの概要を入力"
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
                  作成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">プロジェクトがありません</h3>
          <p className="mt-1 text-sm text-gray-500">新しいプロジェクトを作成して始めましょう。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {project.name}
              </h3>
              {project.client_name && (
                <p className="text-sm text-gray-600 mb-2">
                  クライアント: {project.client_name}
                </p>
              )}
              {project.description && (
                <p className="text-sm text-gray-500 line-clamp-3">
                  {project.description}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  作成日: {new Date(project.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}