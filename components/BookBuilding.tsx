'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BOOK_BUILDING_ITEMS, ENTITIES, type BookBuildingItem } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import { useAgentActivity } from '@/components/AgentActivityContext'
import { useProtoState } from '@/components/ProtoStateContext'

// ─── Agent workflow steps ────────────────────────────────────────────────────

function buildBookBuildingSteps(connectedApps: string[]): string[] {
  const steps: string[] = ['Retrieving task details from Entities']
  if (connectedApps.includes('Minutes')) steps.push('Opening document in Minutes')
  steps.push('Preparing task for processing')
  if (connectedApps.includes('Boards NextGen')) steps.push('Updating status in Boards NextGen')
  steps.push('Sending notification to stakeholders')
  return steps
}

// ─── Category config ─────────────────────────────────────────────────────────

type Category = BookBuildingItem['category']

const CATEGORY_CONFIG: Record<Category, {
  boxBg: string
  boxBorder: string
  iconColor: string
  badgeClasses: string
  badgeLabel: string
  icon: React.ReactNode
}> = {
  gap: {
    boxBg: 'bg-red-50',
    boxBorder: 'border-red-200',
    iconColor: 'text-red-500',
    badgeClasses: 'bg-red-50 border border-red-200 text-red-700',
    badgeLabel: 'Gap detected',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3.5" />
        <circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  overdue: {
    boxBg: 'bg-amber-50',
    boxBorder: 'border-amber-200',
    iconColor: 'text-amber-500',
    badgeClasses: 'bg-amber-50 border border-amber-200 text-amber-700',
    badgeLabel: 'Overdue',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" />
      </svg>
    ),
  },
  assignment: {
    boxBg: 'bg-amber-50',
    boxBorder: 'border-amber-200',
    iconColor: 'text-amber-500',
    badgeClasses: 'bg-amber-50 border border-amber-200 text-amber-700',
    badgeLabel: 'Needs assignment',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" />
        <path d="M11.5 3v3M13 4.5h-3" />
      </svg>
    ),
  },
  signature: {
    boxBg: 'bg-slate-100',
    boxBorder: 'border-slate-300',
    iconColor: 'text-slate-500',
    badgeClasses: 'bg-slate-100 border border-slate-300 text-slate-600',
    badgeLabel: 'Awaiting signatures',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12l3-1 6-6-2-2-6 6-1 3z" />
        <path d="M11 3l2 2" />
      </svg>
    ),
  },
  approval: {
    boxBg: 'bg-slate-100',
    boxBorder: 'border-slate-300',
    iconColor: 'text-slate-500',
    badgeClasses: 'bg-slate-100 border border-slate-300 text-slate-600',
    badgeLabel: 'Awaiting approval',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M5 8l2.5 2.5L11 5.5" />
      </svg>
    ),
  },
}


// ─── Detail modal ─────────────────────────────────────────────────────────────

function BookBuildingModal({ item, onClose }: { item: BookBuildingItem; onClose: () => void }) {
  const entity = ENTITIES.find(e => e.id === item.entityId)!
  const agentActivity = useAgentActivity()
  const cfg = CATEGORY_CONFIG[item.category]

  function handleRunInBackground() {
    if (agentActivity) {
      const jobId = agentActivity.addJob({
        type: 'action',
        entityId: entity.id,
        entityShortName: entity.shortName,
        title: item.title,
        workflowSteps: buildBookBuildingSteps(entity.connectedApps),
      })
      setTimeout(() => agentActivity.completeJob(jobId), 30_000)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]" />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:bg-slate-300 dark:active:bg-zinc-600 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5 pr-8">
            <EntityLogo entity={entity} size="md" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 leading-snug">{entity.country}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 leading-snug truncate">{entity.name}</p>
            </div>
          </div>

          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${cfg.badgeClasses}`}>
            {cfg.badgeLabel}
          </span>

          <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mt-3 mb-2 leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
            {item.detail}
          </p>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-zinc-800">
          <button onClick={onClose} className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {agentActivity && (
              <button
                onClick={handleRunInBackground}
                className="text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
              >
                Run in background
              </button>
            )}
            <Link
              href={`/entity/${item.entityId}`}
              className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors"
            >
              {item.actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type ItemStatus = 'applying' | 'applied'

const VISIBLE_COUNT = 3

export default function BookBuilding() {
  const [selectedItem, setSelectedItem] = useState<BookBuildingItem | null>(null)
  const [itemStatus, setItemStatus] = useState<Record<number, ItemStatus>>({})
  const [showAll, setShowAll] = useState(false)
  const state = useProtoState()
  const agentActivity = useAgentActivity()

  function handleCTA(e: React.MouseEvent, item: BookBuildingItem) {
    e.stopPropagation()
    const entity = ENTITIES.find(en => en.id === item.entityId)
    if (!entity || !agentActivity) return
    setItemStatus(prev => ({ ...prev, [item.id]: 'applying' }))
    const jobId = agentActivity.addJob({
      type: 'action',
      entityId: entity.id,
      entityShortName: entity.shortName,
      title: item.title,
      workflowSteps: buildBookBuildingSteps(entity.connectedApps),
    })
    setTimeout(() => {
      setItemStatus(prev => ({ ...prev, [item.id]: 'applied' }))
      agentActivity.completeJob(jobId)
    }, 30_000)
  }

  const stateItems = BOOK_BUILDING_ITEMS.filter(i => i.states.includes(state))
  const visibleItems = showAll ? stateItems : stateItems.slice(0, VISIBLE_COUNT)
  const hasMore = stateItems.length > VISIBLE_COUNT

  return (
    <section className="flex flex-col">
      <div className="mb-3">
        <h2 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
          Book Building
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
          Gaps and missing items detected in your board packs.
        </p>
      </div>

      <div className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-700 divide-y divide-slate-100 dark:divide-zinc-800 flex flex-col">
        {visibleItems.map((item, i) => {
          const cfg = CATEGORY_CONFIG[item.category]
          const status = itemStatus[item.id]
          const isApplying = status === 'applying'
          const isApplied = status === 'applied'
          const isFirst = i === 0
          const isLast = !hasMore && i === visibleItems.length - 1

          return (
            <div
              key={item.id}
              onClick={isApplying ? undefined : () => setSelectedItem(item)}
              className={`flex items-center gap-3 px-4 py-3 min-h-[64px] overflow-hidden transition-colors cursor-pointer
                ${isFirst ? 'rounded-t-lg' : ''}
                ${isLast ? 'rounded-b-lg' : ''}
                ${isApplying
                  ? 'bg-slate-50 dark:bg-zinc-800 cursor-default'
                  : 'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-700'
                }`}
            >
              {/* Category icon box */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${cfg.boxBg} ${cfg.boxBorder} ${cfg.iconColor} ${isApplying || isApplied ? 'opacity-40' : ''}`}>
                {cfg.icon}
              </div>

              {/* Text */}
              <div className={`flex-1 min-w-0 ${isApplying || isApplied ? 'opacity-40' : ''}`}>
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 leading-snug truncate">
                  {item.meta}
                </p>
              </div>

              {/* CTA / status */}
              {isApplying ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-[11px] text-slate-400">Applying…</span>
                </div>
              ) : isApplied ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l3.5 3.5L13 5" />
                  </svg>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Done</span>
                </div>
              ) : (
                <button
                  onClick={e => handleCTA(e, item)}
                  className="flex-shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-medium rounded-md hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors whitespace-nowrap"
                >
                  {item.actionLabel}
                </button>
              )}
            </div>
          )
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center justify-center gap-1 w-full py-2.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors rounded-b-lg"
          >
            {showAll ? 'Show less' : `Show ${stateItems.length - VISIBLE_COUNT} more`}
            <svg className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>

      {selectedItem && (
        <BookBuildingModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  )
}
