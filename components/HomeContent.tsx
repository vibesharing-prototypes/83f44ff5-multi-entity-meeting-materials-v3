'use client'

import { useMemo } from 'react'
import { SECTIONS } from '@/components/sections'
import { AgentActivityProvider } from '@/components/AgentActivityContext'
import AgentActivityBanner from '@/components/AgentActivityBanner'
import BookBuilding from '@/components/BookBuilding'
import PlanningSuggestions from '@/components/PlanningSuggestions'
import QuickActionsBar from '@/components/QuickActionsBar'
import AgentUsecaseHeroes from '@/components/AgentUsecaseHeroes'
import Footer from '@/components/Footer'
import { ProtoStateProvider, useProtoState } from '@/components/ProtoStateContext'

function getSectionIndex(title: string): number | undefined {
  const i = SECTIONS.findIndex(s => s.title === title)
  return i >= 0 ? i : undefined
}

function HomeContentInner() {
  const getSectionIndexCb = useMemo(() => getSectionIndex, [])
  const state = useProtoState()

  const glowClass = state === 'calm'
    ? 'hero-glow-calm'
    : state === 'busy'
    ? 'hero-glow-busy'
    : 'hero-glow-critical'

  return (
    <AgentActivityProvider getSectionIndex={getSectionIndexCb}>
      <div className="flex-1 overflow-y-auto py-4 relative">
        {/* Full-width glow overlay */}
        <div className={`hero-glow ${glowClass}`} aria-hidden />

        <div className="mx-auto w-full max-w-6xl px-6 pb-24 relative">
          <div className="mb-6">
            <AgentActivityBanner />
          </div>
            <div className="mb-8">
              <QuickActionsBar />
            </div>
            <div className="flex flex-col gap-6">
              <BookBuilding />
              <PlanningSuggestions />
            </div>
          <AgentUsecaseHeroes />
          <Footer />
        </div>
      </div>
    </AgentActivityProvider>
  )
}

export default function HomeContent() {
  return (
    <ProtoStateProvider>
      <HomeContentInner />
    </ProtoStateProvider>
  )
}
