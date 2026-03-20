'use client'

import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import ConfirmActionModal from '@/components/ConfirmActionModal'
import AgentProgressWidget from '@/components/AgentProgressWidget'
import { useAgentActivity } from '@/components/AgentActivityContext'
import { ENTITIES } from '@/components/data'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconQ3Plan() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="3.5" width="15" height="13.5" rx="2" />
      <path d="M7 1.5v4M13 1.5v4M2.5 8.5h15" />
      {/* date grid — left column (Q1/Q2 passed) */}
      <path d="M5.5 12h3.5M5.5 14.5h3.5" strokeWidth="1.1" strokeOpacity="0.35" />
      {/* Q3 block — highlighted */}
      <rect x="11" y="10.5" width="5.5" height="6" rx="1.5" fill="currentColor" fillOpacity="0.13" strokeWidth="0" />
      <path d="M12.5 12.5h2.5M12.5 14.5h1.5" strokeWidth="1.2" />
    </svg>
  )
}

function IconAnnualPlan() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* back page */}
      <rect x="5" y="2" width="12.5" height="11" rx="1.5" strokeOpacity="0.35" />
      {/* front page */}
      <rect x="2" y="5.5" width="12.5" height="12.5" rx="2" />
      <path d="M6 3.5v4M12.5 3.5v4M2 10.5h12.5" />
      <path d="M4.5 13.5h7.5M4.5 16h5" strokeWidth="1.2" />
    </svg>
  )
}

function IconSyncPresenters() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* primary person */}
      <circle cx="7.5" cy="5.5" r="3" />
      <path d="M2 17.5c0-3 2.5-5.5 5.5-5.5" />
      {/* sync arrows */}
      <path d="M13 8a4.5 4.5 0 110 6.5" />
      <path d="M13 8l-1.5.5.5 1.5" />
      <path d="M13 14.5l1.5-.5-.5-1.5" />
    </svg>
  )
}

function IconUpdateRisk() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* shield */}
      <path d="M10 2L3.5 5v4.5C3.5 13.8 6.5 17 10 18c3.5-1 6.5-4.2 6.5-8.5V5L10 2z" />
      {/* document lines inside */}
      <path d="M7 8.5h6M7 11h6M7 13.5h3.5" strokeWidth="1.3" />
    </svg>
  )
}

function IconAlignESG() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* document */}
      <rect x="2.5" y="10.5" width="9" height="7.5" rx="1.5" />
      <path d="M5 13.5h4M5 15.5h2.5" strokeWidth="1.2" />
      {/* leaf growing from stem */}
      <path d="M9.5 10.5V7" />
      <path d="M9.5 9c1.5-3 4.5-4.5 7.5-3.5-1 3-4 5-7.5 3.5z" />
      <path d="M9.5 8c-1-2.5-0.5-5.5 2.5-6.5.5 2.5-.5 5.5-2.5 6.5z" />
    </svg>
  )
}

// ─── Action data ──────────────────────────────────────────────────────────────

import { type RedirectDestination } from '@/components/AgentActivityContext'

interface QuickAction {
  id: string
  label: string
  sublabel: string
  icon: React.ReactNode
  entityIds: number[]
  title: string
  description: string
  affectedSection?: string
  proposedEdit?: string
  actionLabel: string
  badgeLabel: string
  badgeClasses: string
  destination: RedirectDestination
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'q3-plan',
    label: 'Create Q3 Plan',
    sublabel: 'All 8 entities · Q3 2026',
    icon: <IconQ3Plan />,
    entityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    title: 'Create Q3 2026 board meeting plans for all 8 entities',
    description: 'Generate draft agenda frameworks for every Q3 2026 board meeting across all eight entities, based on standing items, the regulatory calendar, prior meeting patterns, and any open action items.',
    actionLabel: 'Create Q3 plans',
    badgeLabel: 'Board Planning',
    badgeClasses: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400',
    destination: 'forward-planner',
  },
  {
    id: '2027-plan',
    label: 'Create 2027 Plan',
    sublabel: 'All 8 entities · Full year',
    icon: <IconAnnualPlan />,
    entityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    title: 'Create 2027 annual board calendar for all 8 entities',
    description: 'Generate a full-year 2027 board meeting schedule and agenda frameworks for all entities, aligned with statutory reporting cycles, regulatory filing deadlines, and governance best practices.',
    actionLabel: 'Create 2027 plans',
    badgeLabel: 'Annual Planning',
    badgeClasses: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400',
    destination: 'forward-planner',
  },
  {
    id: 'sync-presenters',
    label: 'Sync All Presenters',
    sublabel: '3 entities · Financial Review',
    icon: <IconSyncPresenters />,
    entityIds: [2, 4, 1],
    title: 'Update presenter assignments across 3 board packs',
    description: 'Apply all recent personnel changes to presenter fields in one step: Anna Bauer replaces Klaus Weber as CFO presenter at Apex Ventures, Erik Lindqvist takes over Financial Review at Nordic Solutions, and the unassigned Financial Review section at Meridian Capital is assigned.',
    affectedSection: 'Financial Review',
    actionLabel: 'Sync all presenters',
    badgeLabel: 'Personnel',
    badgeClasses: 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400',
    destination: 'smart-book-builder',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

// Minimum width (px) each tile must be before overflow kicks in
const MIN_TILE_W = 140
const ITEM_GAP = 8
const MORE_BTN_W = 60

export default function QuickActionsBar() {
  const [confirmAction, setConfirmAction] = useState<QuickAction | null>(null)
  const [visibleCount, setVisibleCount] = useState(QUICK_ACTIONS.length)
  const [activeJobs, setActiveJobs] = useState<Record<string, string>>({}) // actionId → jobId
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const agentActivity = useAgentActivity()

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    function measure() {
      if (!container) return
      const cw = container.offsetWidth
      const n = QUICK_ACTIONS.length

      // All items fit comfortably?
      if (n * MIN_TILE_W + (n - 1) * ITEM_GAP <= cw) {
        setVisibleCount(n)
        return
      }

      // How many tiles fit when we reserve space for the "more" button?
      const available = cw - MORE_BTN_W - ITEM_GAP
      const count = Math.floor((available + ITEM_GAP) / (MIN_TILE_W + ITEM_GAP))
      setVisibleCount(Math.max(1, count))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function handler(e: MouseEvent) {
      if (!(e.target as Element).closest('[data-more-dropdown]')) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  function handleConfirm(action: QuickAction) {
    if (!agentActivity) return
    const entities = action.entityIds.map(id => ENTITIES.find(e => e.id === id)!).filter(Boolean)
    const allApps = Array.from(new Set(entities.flatMap(e => e.connectedApps)))
    const steps = [
      'Scanning all affected board packs',
      allApps.includes('Boards NextGen') ? 'Opening packs in Boards NextGen' : 'Retrieving pack data',
      'Applying changes across entities',
      allApps.includes('Minutes') ? 'Updating documents in Minutes' : 'Finalising updates',
      'Running cross-entity consistency check',
      'Notifying stakeholders',
    ]
    const jobId = agentActivity.addJob({
      type: 'action',
      entityId: entities[0]?.id ?? 1,
      entityShortName: `${entities.length} entities`,
      title: action.title,
      workflowSteps: steps,
      destination: action.destination,
    })
    setActiveJobs(prev => ({ ...prev, [action.id]: jobId }))
    setTimeout(() => agentActivity.completeJob(jobId), 30_000)
  }

  const visible = QUICK_ACTIONS.slice(0, visibleCount)
  const hidden = QUICK_ACTIONS.slice(visibleCount)

  return (
    <>
      <div ref={containerRef} className="flex gap-2">
        {visible.map(action => (
          <button
            key={action.id}
            onClick={() => setConfirmAction(action)}
            className="flex-1 min-w-0 flex items-center gap-3 h-[64px] px-4 bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-zinc-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-200 dark:hover:border-zinc-500 hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] [will-change:transform] [backface-visibility:hidden] transition-[transform,box-shadow,border-color,background-color] duration-[250ms] ease-out group"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-50 dark:bg-zinc-700 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-zinc-600 transition-colors">
              <span className="text-slate-500 dark:text-zinc-300 group-hover:text-slate-700 dark:group-hover:text-zinc-100 transition-colors">{action.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 group-hover:text-slate-900 dark:text-zinc-100 leading-snug truncate transition-colors">
                {action.label}
              </p>
              <p className="text-[11px] text-slate-400 group-hover:text-slate-500 dark:text-zinc-500 leading-snug truncate transition-colors">
                {action.sublabel}
              </p>
            </div>
          </button>
        ))}

        {hidden.length > 0 && (
          <div className="relative flex-shrink-0" data-more-dropdown>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex flex-col items-center justify-center gap-1 h-[64px] w-[52px] bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-zinc-700 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-black/[0.14] transition-all"
            >
              <span className="text-[12px] font-semibold leading-none">+{hidden.length}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-30 min-w-[220px]"
                style={{ animation: 'confirmModalIn 150ms cubic-bezier(0.22,1,0.36,1) both' }}
              >
                {hidden.map(action => (
                  <button
                    key={action.id}
                    onClick={() => { setConfirmAction(action); setDropdownOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 dark:bg-zinc-700 flex items-center justify-center">
                      <span className="text-slate-500 dark:text-zinc-300">{action.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-100 leading-snug">{action.label}</p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-snug">{action.sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {Object.entries(activeJobs).map(([actionId, jobId]) => {
        const job = agentActivity?.jobs.find(j => j.id === jobId) ?? null
        if (!job) return null
        return (
          <div key={actionId} className="mt-3">
            <AgentProgressWidget
              job={job}
              onDismiss={() => setActiveJobs(prev => { const next = { ...prev }; delete next[actionId]; return next })}
            />
          </div>
        )
      })}

      {confirmAction && (
        <ConfirmActionModal
          entityIds={confirmAction.entityIds}
          title={confirmAction.title}
          description={confirmAction.description}
          affectedSection={confirmAction.affectedSection}
          proposedEdit={confirmAction.proposedEdit}
          actionLabel={confirmAction.actionLabel}
          badgeLabel={confirmAction.badgeLabel}
          badgeClasses={confirmAction.badgeClasses}
          onConfirm={() => handleConfirm(confirmAction)}
          onClose={() => setConfirmAction(null)}
        />
      )}
    </>
  )
}
