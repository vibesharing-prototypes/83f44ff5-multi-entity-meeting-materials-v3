'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BOOK_BUILDING_ITEMS, ENTITIES, type BookBuildingItem } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import ConfirmActionModal from '@/components/ConfirmActionModal'
import RedirectModal, { type RedirectDestination } from '@/components/RedirectModal'
import AgentProgressWidget from '@/components/AgentProgressWidget'
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
  badgeClasses: string
  badgeLabel: string
  glowColor: string
  priorityFill: string
  priorityGradient: string
  priorityLabel: string
}> = {
  gap: {
    badgeClasses: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400',
    badgeLabel: 'Gap detected',
    glowColor: 'rgba(239,68,68,0.07)',
    priorityFill: '85%',
    priorityGradient: 'linear-gradient(90deg, #D3222A, #f97316)',
    priorityLabel: 'High priority',
  },
  overdue: {
    badgeClasses: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400',
    badgeLabel: 'Overdue',
    glowColor: 'rgba(239,68,68,0.07)',
    priorityFill: '85%',
    priorityGradient: 'linear-gradient(90deg, #D3222A, #f97316)',
    priorityLabel: 'High priority',
  },
  assignment: {
    badgeClasses: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400',
    badgeLabel: 'Needs assignment',
    glowColor: 'rgba(245,158,11,0.07)',
    priorityFill: '55%',
    priorityGradient: 'linear-gradient(90deg, #f59e0b, #eab308)',
    priorityLabel: 'Medium',
  },
  signature: {
    badgeClasses: 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400',
    badgeLabel: 'Awaiting signatures',
    glowColor: 'rgba(148,163,184,0.05)',
    priorityFill: '35%',
    priorityGradient: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
    priorityLabel: 'Low',
  },
  approval: {
    badgeClasses: 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400',
    badgeLabel: 'Awaiting approval',
    glowColor: 'rgba(148,163,184,0.05)',
    priorityFill: '35%',
    priorityGradient: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
    priorityLabel: 'Low',
  },
}


// ─── Detail modal ─────────────────────────────────────────────────────────────

function BookBuildingModal({ item, onClose }: { item: BookBuildingItem; onClose: () => void }) {
  const entities = item.entityIds.map(id => ENTITIES.find(e => e.id === id)!).filter(Boolean)
  const primaryEntity = entities[0]
  const agentActivity = useAgentActivity()
  const cfg = CATEGORY_CONFIG[item.category]

  function handleRunInBackground() {
    if (agentActivity && primaryEntity) {
      const allApps = Array.from(new Set(entities.flatMap(e => e.connectedApps)))
      const jobId = agentActivity.addJob({
        type: 'action',
        entityId: primaryEntity.id,
        entityShortName: entities.length > 1 ? `${entities.length} entities` : primaryEntity.shortName,
        title: item.title,
        workflowSteps: buildBookBuildingSteps(allApps),
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
          <div className="flex items-start gap-3 mb-5 pr-8">
            <div className="flex -space-x-2 flex-shrink-0">
              {entities.map(e => <EntityLogo key={e.id} entity={e} size="md" />)}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 leading-snug">{entities.length} {entities.length === 1 ? 'entity' : 'entities'}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 leading-snug">{entities.map(e => e.shortName).join(', ')}</p>
            </div>
          </div>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${cfg.badgeClasses}`}>
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
              href={`/entity/${primaryEntity?.id ?? 1}`}
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
type ItemStatusEntry = { status: ItemStatus; jobId?: string }

const VISIBLE_COUNT = 3

export default function BookBuilding() {
  const [selectedItem, setSelectedItem] = useState<BookBuildingItem | null>(null)
  const [confirmItem, setConfirmItem] = useState<BookBuildingItem | null>(null)
  const [itemStatus, setItemStatus] = useState<Record<number, ItemStatusEntry>>({})
  const [redirectDest, setRedirectDest] = useState<RedirectDestination | null>(null)
  const [showAll, setShowAll] = useState(false)
  const state = useProtoState()
  const agentActivity = useAgentActivity()

  function executeApply(item: BookBuildingItem) {
    const itemEntities = item.entityIds.map(id => ENTITIES.find(en => en.id === id)!).filter(Boolean)
    const entity = itemEntities[0]
    if (!entity || !agentActivity) return
    const allApps = Array.from(new Set(itemEntities.flatMap(e => e.connectedApps)))
    const jobId = agentActivity.addJob({
      type: 'action',
      entityId: entity.id,
      entityShortName: itemEntities.length > 1 ? `${itemEntities.length} entities` : entity.shortName,
      title: item.title,
      workflowSteps: buildBookBuildingSteps(allApps),
      destination: 'smart-book-builder',
    })
    setItemStatus(prev => ({ ...prev, [item.id]: { status: 'applying', jobId } }))
    setTimeout(() => {
      setItemStatus(prev => ({ ...prev, [item.id]: { status: 'applied' } }))
      agentActivity.completeJob(jobId)
    }, 30_000)
  }

  function handleCTA(e: React.MouseEvent, item: BookBuildingItem) {
    e.stopPropagation()
    setConfirmItem(item)
  }

  function handleDetails(e: React.MouseEvent, item: BookBuildingItem) {
    e.stopPropagation()
    setSelectedItem(item)
  }

  const stateItems = BOOK_BUILDING_ITEMS.filter(i => i.states.includes(state))
  const visibleItems = showAll ? stateItems : stateItems.slice(0, VISIBLE_COUNT)
  const hasMore = stateItems.length > VISIBLE_COUNT

  return (
    <section className="flex flex-col">
      <div className="mb-3">
        <h2 className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
          Book Building
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
          Gaps and missing items detected in your board packs.
        </p>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item, i) => {
          const cfg = CATEGORY_CONFIG[item.category]
          const itemEntities = item.entityIds.map(id => ENTITIES.find(e => e.id === id)!).filter(Boolean)
          const entry = itemStatus[item.id]
          const isApplying = entry?.status === 'applying'
          const isApplied = entry?.status === 'applied'
          const job = isApplying && entry?.jobId ? (agentActivity?.jobs.find(j => j.id === entry.jobId) ?? null) : null

          return (
            <div
              key={item.id}
              onClick={isApplying || isApplied ? undefined : () => setSelectedItem(item)}
              className={`suggestion-card relative rounded-[20px] border overflow-hidden [will-change:transform] [backface-visibility:hidden] transition-[transform,box-shadow,border-color,background-color] duration-[250ms] ease-out ${
                isApplied
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/10 cursor-default'
                  : 'border-black/[0.09] dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:border-slate-200 dark:hover:border-zinc-600 hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-0.5'
              }`}
              style={{ animationDelay: `${i * 120}ms` } as React.CSSProperties}
            >
              {/* Glow — category colour when pending, emerald when done */}
              <div
                className="suggestion-card-glow absolute top-0 left-0 right-0 h-20 pointer-events-none"
                style={{ background: isApplied
                  ? 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 100%)'
                  : `radial-gradient(ellipse 80% 100% at 50% 0%, ${cfg.glowColor} 0%, transparent 100%)` }}
              />

              <div className={`relative p-[22px_24px] ${isApplying ? 'cursor-default' : ''}`}>
                {/* Entity row */}
                <div className={`flex items-center gap-2.5 mb-3.5 ${isApplying ? 'opacity-40' : ''}`}>
                  <div className="flex -space-x-2 flex-shrink-0">
                    {itemEntities.map(e => <EntityLogo key={e.id} entity={e} size="sm" />)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-zinc-100 truncate">{itemEntities.map(e => e.shortName).join(', ')}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">{itemEntities.length} {itemEntities.length === 1 ? 'entity' : 'entities'}</p>
                  </div>
                  {isApplied ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap flex-shrink-0 bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>
                      Applied
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap flex-shrink-0 ${cfg.badgeClasses}`}>
                      {cfg.badgeLabel}
                    </span>
                  )}
                </div>

                {/* Title */}
                <p className={`text-[16px] font-semibold text-slate-900 dark:text-zinc-100 leading-[1.35] mb-2 ${isApplying ? 'opacity-40' : ''}`}>
                  {item.title}
                </p>

                {/* Detail */}
                <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {item.detail}
                </p>

                {/* Progress widget (inline, when applying) or CTA row */}
                {isApplying && job ? (
                  <div className="mt-4">
                    <AgentProgressWidget job={job} />
                  </div>
                ) : isApplied ? (
                  <div className="mt-4">
                    <button
                      onClick={e => { e.stopPropagation(); setRedirectDest('smart-book-builder') }}
                      className="w-full flex items-center justify-center gap-2 text-[14px] font-normal bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl py-[11px] px-4 transition-colors"
                    >
                      Check in Smart Book Builder
                      <svg className="w-3.5 h-3.5 opacity-80" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7h8M7 3l4 4-4 4"/><path d="M11 3h2v2"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={e => handleCTA(e, item)}
                      className="flex-1 text-[14px] font-normal bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl py-[11px] px-4 hover:bg-slate-900 dark:hover:bg-white active:bg-slate-950 dark:active:bg-zinc-200 transition-colors"
                    >
                      {item.actionLabel}
                    </button>
                    <button
                      onClick={e => handleDetails(e, item)}
                      className="text-[13px] font-normal text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-black/[0.09] dark:border-zinc-700 rounded-xl py-[11px] px-4 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-200 dark:hover:border-zinc-600 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center justify-center gap-1 w-full py-2.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
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

      {confirmItem && (() => {
        const cfg = CATEGORY_CONFIG[confirmItem.category]
        return (
          <ConfirmActionModal
            entityIds={confirmItem.entityIds}
            title={confirmItem.title}
            description={confirmItem.detail}
            actionLabel={confirmItem.actionLabel}
            badgeLabel={cfg.badgeLabel}
            badgeClasses={cfg.badgeClasses}
            onConfirm={() => executeApply(confirmItem)}
            onClose={() => setConfirmItem(null)}
          />
        )
      })()}

      {redirectDest && (
        <RedirectModal destination={redirectDest} onClose={() => setRedirectDest(null)} />
      )}
    </section>
  )
}
