'use client'

import { useState } from 'react'
import { PLANNING_SUGGESTIONS, ENTITIES, type PlanningSuggestion } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import ConfirmActionModal from '@/components/ConfirmActionModal'
import RedirectModal, { type RedirectDestination } from '@/components/RedirectModal'
import AgentProgressWidget from '@/components/AgentProgressWidget'
import { useAgentActivity } from '@/components/AgentActivityContext'
import { useProtoState } from '@/components/ProtoStateContext'
import { useMarketingMode } from '@/components/MarketingModeContext'
import { SkeletonBar } from '@/components/SkeletonBar'

// ─── Agent workflow steps ─────────────────────────────────────────────────────

function buildEditSteps(connectedApps: string[], affectedSection: string): string[] {
  return [
    'Fetching regulatory source data',
    `Analysing ${affectedSection || 'document'}`,
    connectedApps.includes('Minutes') ? 'Drafting updates in Minutes' : 'Preparing document update',
    connectedApps.includes('Boards NextGen') ? 'Syncing with Boards NextGen' : 'Applying to board pack',
    'Running cross-entity consistency check',
  ]
}

// ─── Source config ────────────────────────────────────────────────────────────

type SourceType = PlanningSuggestion['sourceType']

const SOURCE_CONFIG: Record<SourceType, {
  badgeClasses: string
  glowColor: string
  revealBorderColor: string
  priorityFill: string
  priorityGradient: string
  priorityLabel: string
}> = {
  regulation: {
    badgeClasses: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800',
    glowColor: 'rgba(244,63,94,0.07)',
    revealBorderColor: '#fecdd3',
    priorityFill: '85%',
    priorityGradient: 'linear-gradient(90deg, #D3222A, #f97316)',
    priorityLabel: 'High priority',
  },
  geopolitical: {
    badgeClasses: 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800',
    glowColor: 'rgba(249,115,22,0.07)',
    revealBorderColor: '#fed7aa',
    priorityFill: '85%',
    priorityGradient: 'linear-gradient(90deg, #D3222A, #f97316)',
    priorityLabel: 'High priority',
  },
  market: {
    badgeClasses: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800',
    glowColor: 'rgba(59,130,246,0.07)',
    revealBorderColor: '#bfdbfe',
    priorityFill: '70%',
    priorityGradient: 'linear-gradient(90deg, #f59e0b, #eab308)',
    priorityLabel: 'Medium-high',
  },
  'source-material': {
    badgeClasses: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800',
    glowColor: 'rgba(139,92,246,0.07)',
    revealBorderColor: '#c4b5fd',
    priorityFill: '70%',
    priorityGradient: 'linear-gradient(90deg, #f59e0b, #eab308)',
    priorityLabel: 'Medium-high',
  },
  personnel: {
    badgeClasses: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800',
    glowColor: 'rgba(20,184,166,0.07)',
    revealBorderColor: '#99f6e4',
    priorityFill: '55%',
    priorityGradient: 'linear-gradient(90deg, #f59e0b, #eab308)',
    priorityLabel: 'Medium',
  },
  reorder: {
    badgeClasses: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800',
    glowColor: 'rgba(59,130,246,0.07)',
    revealBorderColor: '#bfdbfe',
    priorityFill: '55%',
    priorityGradient: 'linear-gradient(90deg, #f59e0b, #eab308)',
    priorityLabel: 'Medium',
  },
}

// ─── LogoStack ────────────────────────────────────────────────────────────────

function LogoStack({ entityIds }: { entityIds: number[] }) {
  const entities = entityIds.map(id => ENTITIES.find(e => e.id === id)).filter(Boolean) as NonNullable<typeof ENTITIES[number]>[]
  const primary = entities[0]
  const extra = entities.length - 1
  if (!primary) return null
  return (
    <div className="relative group/logos flex-shrink-0">
      <EntityLogo entity={primary} size="md" />
      {extra > 0 && (
        <div className="absolute -bottom-1 -right-1 min-w-[18px] h-[18px] px-1 bg-slate-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
          +{extra}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-full left-0 mb-1.5 px-2.5 py-2 bg-slate-800 rounded-lg shadow-md opacity-0 group-hover/logos:opacity-100 transition-opacity z-20 whitespace-nowrap space-y-2">
        {entities.map((entity, i) => (
          <div key={entity.id} className={i > 0 ? 'pt-2 border-t border-slate-700' : ''}>
            <p className="text-[11px] font-semibold text-white leading-snug">{entity.name}</p>
            <p className="text-[10px] text-slate-400 leading-snug">{entity.country}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function PlanningSuggestionModal({
  suggestion,
  onApply,
  onClose,
}: {
  suggestion: PlanningSuggestion
  onApply: () => void
  onClose: () => void
}) {
  const entities = suggestion.entities
    .map(e => ENTITIES.find(ent => ent.id === e.entityId))
    .filter(Boolean) as NonNullable<typeof ENTITIES[number]>[]
  const sourceStyle = SOURCE_CONFIG[suggestion.sourceType]
  const isBatch = suggestion.entities.length > 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]" />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
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
          <div className="flex items-start gap-2.5 mb-4 pr-8 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 mt-0.5 ${sourceStyle.badgeClasses}`}>
              {suggestion.sourceLabel}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {entities.map(entity => (
                <div key={entity.id} className="flex items-center gap-1.5">
                  <EntityLogo entity={entity} size="sm" />
                  <span className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">{entity.shortName}</span>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-100 mb-2 leading-snug">
            {suggestion.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
            {suggestion.reason}
          </p>

          {suggestion.affectedSection && (
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Affected Section
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                  <svg className="w-3 h-3 text-slate-500 dark:text-zinc-500 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="2" width="10" height="12" rx="1.5" />
                    <path d="M6 6h4M6 9h4M6 12h2" />
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-zinc-300 font-medium">{suggestion.affectedSection}</span>
                </div>
                {isBatch && (
                  <span className="text-xs text-slate-500">across {suggestion.entities.length} board packs</span>
                )}
              </div>
            </div>
          )}

          {suggestion.suggestedPrompt && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Proposed Edit
              </p>
              <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700">
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {suggestion.suggestedPrompt}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
          <button onClick={onClose} className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onApply(); onClose() }}
            className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors"
          >
            {suggestion.actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type CardStatus = 'applying' | 'applied'
type CardStatusEntry = { status: CardStatus; jobId?: string }

const VISIBLE_COUNT = 3

export default function PlanningSuggestions() {
  const [cardStatus, setCardStatus] = useState<Record<number, CardStatusEntry>>({})
  const [selectedSuggestion, setSelectedSuggestion] = useState<PlanningSuggestion | null>(null)
  const [confirmSuggestion, setConfirmSuggestion] = useState<PlanningSuggestion | null>(null)
  const [redirectDest, setRedirectDest] = useState<RedirectDestination | null>(null)
  const [showAll, setShowAll] = useState(false)
  const agentActivity = useAgentActivity()
  const state = useProtoState()
  const marketingMode = useMarketingMode()

  function handleApply(suggestion: PlanningSuggestion) {
    const id = suggestion.id
    const firstEntityId = suggestion.entities[0]?.entityId
    const entity = firstEntityId ? ENTITIES.find(e => e.id === firstEntityId) : null
    const destination: RedirectDestination = suggestion.sourceType === 'reorder' ? 'forward-planner' : 'smart-book-builder'
    const jobId = entity && agentActivity
      ? agentActivity.addJob({
          type: 'edit',
          entityId: entity.id,
          entityShortName: suggestion.entities.length > 1 ? `${suggestion.entities.length} entities` : entity.shortName,
          title: suggestion.title,
          sectionTitle: suggestion.affectedSection,
          workflowSteps: buildEditSteps(entity.connectedApps, suggestion.affectedSection ?? ''),
          destination,
        })
      : null
    setCardStatus(prev => ({ ...prev, [id]: { status: 'applying', jobId: jobId ?? undefined } }))
    setTimeout(() => {
      setCardStatus(prev => ({ ...prev, [id]: { status: 'applied' } }))
      if (jobId && agentActivity) agentActivity.completeJob(jobId)
    }, 30_000)
  }

  function handleRowCTA(e: React.MouseEvent, suggestion: PlanningSuggestion) {
    e.stopPropagation()
    setConfirmSuggestion(suggestion)
  }

  function handleDetails(e: React.MouseEvent, suggestion: PlanningSuggestion) {
    e.stopPropagation()
    setSelectedSuggestion(suggestion)
  }

  const stateSuggestions = PLANNING_SUGGESTIONS.filter(s => s.states.includes(state))
  const visibleSuggestions = showAll ? stateSuggestions : stateSuggestions.slice(0, VISIBLE_COUNT)
  const hasMore = stateSuggestions.length > VISIBLE_COUNT

  const hasHoverReveal = (s: PlanningSuggestion) => !!(s.affectedSection || s.suggestedPrompt)

  return (
    <section className="flex flex-col">
      <div className="mb-3">
        <h2 className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
          Planning Suggestions
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
          Agenda and presenter changes driven by external events.
        </p>
      </div>

      <div className="space-y-3">
        {visibleSuggestions.map((suggestion, i) => {
          const entry = cardStatus[suggestion.id]
          const isApplying = entry?.status === 'applying'
          const isApplied = entry?.status === 'applied'
          const job = isApplying && entry?.jobId ? (agentActivity?.jobs.find(j => j.id === entry.jobId) ?? null) : null
          const isBatch = suggestion.entities.length > 1
          const cfg = SOURCE_CONFIG[suggestion.sourceType]
          const primaryEntity = ENTITIES.find(e => e.id === suggestion.entities[0]?.entityId)

          return (
            <div
              key={suggestion.id}
              onClick={isApplying || isApplied ? undefined : () => setSelectedSuggestion(suggestion)}
              className={`suggestion-card group relative rounded-[20px] border overflow-hidden [will-change:transform] [backface-visibility:hidden] transition-[transform,box-shadow,border-color,background-color] duration-[250ms] ease-out ${
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
                  {isBatch ? (
                    <LogoStack entityIds={suggestion.entities.map(e => e.entityId)} />
                  ) : primaryEntity ? (
                    <EntityLogo entity={primaryEntity} size="md" />
                  ) : null}
                  <div className="flex-1 min-w-0">
                    {primaryEntity && (
                      <>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-100">
                          {primaryEntity.name}
                          {isBatch && <span className="text-slate-400 dark:text-zinc-500 font-normal"> + {suggestion.entities.length - 1} more</span>}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">{primaryEntity.country} · Board: {primaryEntity.nextBoard}</p>
                      </>
                    )}
                  </div>
                  {isApplied ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap flex-shrink-0 bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>
                      Applied
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0 ${cfg.badgeClasses}`}>
                      {suggestion.sourceLabel}
                    </span>
                  )}
                </div>

                {/* Title */}
                {marketingMode ? (
                  <div className="space-y-2 mb-2">
                    <SkeletonBar w="90%" h={10} />
                    <SkeletonBar w="70%" h={10} />
                  </div>
                ) : (
                  <p className={`text-[16px] font-semibold text-slate-800 dark:text-zinc-100 leading-[1.35] mb-2 ${isApplying ? 'opacity-40' : ''}`}>
                    {suggestion.title}
                  </p>
                )}

                {/* Reason — always visible */}
                {marketingMode ? (
                  <div className="space-y-1.5">
                    <SkeletonBar w="100%" h={7} opacity={0.10} />
                    <SkeletonBar w="92%" h={7} opacity={0.10} />
                    <SkeletonBar w="85%" h={7} opacity={0.10} />
                  </div>
                ) : (
                  <p className={`text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed ${isApplying ? 'opacity-40' : ''}`}>
                    {suggestion.reason}
                  </p>
                )}

                {/* Hover-reveal block */}
                {hasHoverReveal(suggestion) && !isApplied && (
                  <div
                    className={`max-h-0 opacity-0 overflow-hidden transition-all duration-400 ease-in-out group-hover:max-h-[150px] group-hover:opacity-100 group-hover:mt-2.5 ${isApplying ? 'opacity-40' : ''}`}
                  >
                    <div
                      className="border-l-2 pl-3 py-1"
                      style={{ borderColor: cfg.revealBorderColor }}
                    >
                      {suggestion.affectedSection && (
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                          Affected section: {suggestion.affectedSection}
                        </p>
                      )}
                      {suggestion.suggestedPrompt && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                          {suggestion.suggestedPrompt}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress widget (inline, when applying) or CTA row */}
                {marketingMode ? (
                  <div className="flex gap-2 mt-4 justify-end">
                    <SkeletonBar w={110} h={38} />
                    <SkeletonBar w={70} h={38} />
                  </div>
                ) : isApplying && job ? (
                  <div className="mt-4">
                    <AgentProgressWidget job={job} />
                  </div>
                ) : isApplied ? (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={e => { e.stopPropagation(); setRedirectDest(suggestion.sourceType === 'reorder' ? 'forward-planner' : 'smart-book-builder') }}
                      className="flex items-center justify-center gap-2 text-[14px] font-normal bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl py-[11px] px-4 transition-colors"
                    >
                      {suggestion.sourceType === 'reorder' ? 'Check in Forward Planner' : 'Check in Smart Book Builder'}
                      <svg className="w-3.5 h-3.5 opacity-80" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7h8M7 3l4 4-4 4"/><path d="M11 3h2v2"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4 justify-end">
                    <button
                      onClick={e => handleRowCTA(e, suggestion)}
                      className="text-[14px] font-normal bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl py-[11px] px-4 hover:bg-slate-900 dark:hover:bg-white active:bg-slate-950 dark:active:bg-zinc-200 transition-colors"
                    >
                      {suggestion.actionLabel}
                    </button>
                    <button
                      onClick={e => handleDetails(e, suggestion)}
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
            {showAll ? 'Show less' : `Show ${stateSuggestions.length - VISIBLE_COUNT} more`}
            <svg className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>

      {selectedSuggestion && (
        <PlanningSuggestionModal
          suggestion={selectedSuggestion}
          onApply={() => handleApply(selectedSuggestion)}
          onClose={() => setSelectedSuggestion(null)}
        />
      )}

      {confirmSuggestion && (() => {
        const cfg = SOURCE_CONFIG[confirmSuggestion.sourceType]
        return (
          <ConfirmActionModal
            entityIds={confirmSuggestion.entities.map(e => e.entityId)}
            title={confirmSuggestion.title}
            description={confirmSuggestion.reason}
            affectedSection={confirmSuggestion.affectedSection}
            proposedEdit={confirmSuggestion.suggestedPrompt}
            actionLabel={confirmSuggestion.actionLabel}
            badgeLabel={confirmSuggestion.sourceLabel}
            badgeClasses={cfg.badgeClasses}
            onConfirm={() => handleApply(confirmSuggestion)}
            onClose={() => setConfirmSuggestion(null)}
          />
        )
      })()}

      {redirectDest && (
        <RedirectModal destination={redirectDest} onClose={() => setRedirectDest(null)} />
      )}
    </section>
  )
}
