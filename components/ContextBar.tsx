'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ENTITIES } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'

const MILESTONES = [
  'Agenda set',
  'Papers requested',
  'Papers received',
  'Pack drafted',
  'In review',
  'Approved',
]

// Active dot: always blue. Completed dots + lines: always green.
const STEP_COLORS = [
  { dot: 'bg-blue-500 dark:bg-blue-400', dotDone: 'bg-emerald-400 dark:bg-emerald-500', line: 'bg-emerald-200 dark:bg-emerald-800', glow: 'shadow-[0_0_0_3px_rgba(96,165,250,0.25)]' },
  { dot: 'bg-blue-500 dark:bg-blue-400', dotDone: 'bg-emerald-400 dark:bg-emerald-500', line: 'bg-emerald-200 dark:bg-emerald-800', glow: 'shadow-[0_0_0_3px_rgba(96,165,250,0.25)]' },
  { dot: 'bg-blue-500 dark:bg-blue-400', dotDone: 'bg-emerald-400 dark:bg-emerald-500', line: 'bg-emerald-200 dark:bg-emerald-800', glow: 'shadow-[0_0_0_3px_rgba(96,165,250,0.25)]' },
  { dot: 'bg-blue-500 dark:bg-blue-400', dotDone: 'bg-emerald-400 dark:bg-emerald-500', line: 'bg-emerald-200 dark:bg-emerald-800', glow: 'shadow-[0_0_0_3px_rgba(96,165,250,0.25)]' },
  { dot: 'bg-blue-500 dark:bg-blue-400', dotDone: 'bg-emerald-400 dark:bg-emerald-500', line: 'bg-emerald-200 dark:bg-emerald-800', glow: 'shadow-[0_0_0_3px_rgba(96,165,250,0.25)]' },
  { dot: 'bg-blue-500 dark:bg-blue-400', dotDone: 'bg-emerald-400 dark:bg-emerald-500', line: 'bg-emerald-200 dark:bg-emerald-800', glow: 'shadow-[0_0_0_3px_rgba(96,165,250,0.25)]' },
]

function getCurrentMilestoneIndex(completion: number): number {
  if (completion >= 96) return 5
  if (completion >= 81) return 4
  if (completion >= 61) return 3
  if (completion >= 41) return 2
  if (completion >= 21) return 1
  if (completion >= 1) return 0
  return -1
}

function MilestoneTracker({ completion }: { completion: number }) {
  const currentIdx = getCurrentMilestoneIndex(completion)

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center w-full">
        {MILESTONES.map((_, i) => {
          const c = STEP_COLORS[i]
          const isComplete = i < currentIdx
          const isCurrent = i === currentIdx
          return (
            <div
              key={i}
              className={`flex items-center ${i < MILESTONES.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`rounded-full flex-shrink-0 transition-all duration-200 ${
                  isCurrent
                    ? `w-3 h-3 ${c.dot} ${c.glow}`
                    : isComplete
                    ? `w-2 h-2 ${c.dotDone}`
                    : 'w-2 h-2 bg-zinc-200 dark:bg-zinc-700'
                }`}
              />
              {i < MILESTONES.length - 1 && (
                <div className={`flex-1 h-px transition-colors ${isComplete ? c.line : 'bg-zinc-200 dark:bg-zinc-700'}`} />
              )}
            </div>
          )
        })}
      </div>
      {currentIdx >= 0 ? (
        <span className="text-[11px] font-medium leading-none text-zinc-500 dark:text-zinc-400">
          {MILESTONES[currentIdx]}
        </span>
      ) : (
        <span className="text-[10px] font-medium leading-none text-zinc-400 dark:text-zinc-600">Not started</span>
      )}
    </div>
  )
}

interface ContextBarProps {
  currentEntityId?: number
}

export default function ContextBar({ currentEntityId }: ContextBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const inProgress = ENTITIES.filter(e => e.completion > 0 && e.completion < 100).length
  const approved = ENTITIES.filter(e => e.completion >= 96).length

  return (
    <div className="relative z-[60] border-b border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-shrink-0">
      {/* Header strip */}
      <div className="px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            {ENTITIES.length} Entities
          </span>
          <span className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
          <span className="text-sm text-slate-500 dark:text-zinc-400">Q1 2026</span>
          <span className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {inProgress} in progress
            </span>
            {approved > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {approved} approved
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(v => !v)}
          aria-expanded={isExpanded}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-400 dark:hover:border-zinc-600 active:bg-slate-100 dark:active:bg-zinc-700 transition-colors shadow-sm"
        >
          Manage entities
          <svg
            className={`w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>
      </div>

      {/* Expandable panel */}
      <div className={`absolute left-0 right-0 z-[60] overflow-hidden transition-[max-height,opacity] duration-200 shadow-xl ${isExpanded ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-lg">
            <div className="overflow-y-auto max-h-[calc(100vh-76px)]">

            {/* Table header */}
            <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_3.5fr_auto] gap-x-4 items-center px-5 py-3 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide">Entity</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide">Country</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide">Next Board Meeting</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide">Progress</span>
              <span />
            </div>

            {/* Entity rows */}
            {ENTITIES.map(entity => {
              const isActive = entity.id === currentEntityId
              return (
                <Link
                  key={entity.id}
                  href={`/entity/${entity.id}`}
                  className={`grid grid-cols-[2.5fr_1.5fr_1.5fr_3.5fr_auto] gap-x-4 items-center px-5 py-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-700'
                  }`}
                >
                    {/* Entity name + logo */}
                    <div className="flex items-center gap-3 min-w-0">
                      <EntityLogo entity={entity} />
                      <div className="min-w-0">
                        <p className={`text-[11px] font-semibold leading-snug truncate ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-zinc-200'}`}>
                          {entity.shortName}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">{entity.name}</p>
                      </div>
                    </div>

                    {/* Country */}
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500">{entity.country}</span>

                    {/* Next board */}
                    <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium">{entity.nextBoard}</span>

                    {/* Milestone tracker */}
                    <MilestoneTracker completion={entity.completion} />

                    {/* Chevron */}
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400 dark:text-blue-600' : 'text-slate-400 dark:text-zinc-600'}`}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 4l4 4-4 4" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
