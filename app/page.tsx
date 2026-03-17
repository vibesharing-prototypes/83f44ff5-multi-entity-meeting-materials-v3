import type { Metadata } from 'next'
import ContextBar from '@/components/ContextBar'
import HomeContent from '@/components/HomeContent'
import HomeSidePanel from '@/components/HomeSidePanel'

export const metadata: Metadata = { title: 'Home' }

export default function Home() {
  return (
    <div className="flex h-full overflow-hidden bg-[#f0f0f1] dark:bg-zinc-950">
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <ContextBar />
        <HomeContent />
      </main>
      <HomeSidePanel />
    </div>
  )
}
