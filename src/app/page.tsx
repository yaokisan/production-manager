'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useSupabase()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // ログイン済みの場合はダッシュボードへ
        router.replace('/dashboard')
      } else {
        // 未ログインの場合はログインページへ
        router.replace('/auth/login')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-sm text-gray-500">リダイレクト中...</p>
      </div>
    </div>
  )
}